import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { compile } from "json-schema-to-typescript";

const args = process.argv.slice(2);
const options = Object.fromEntries(
  args
    .filter(arg => arg.startsWith("--"))
    .map(arg => {
      const [key, value] = arg.replace(/^--/, "").split("=");
      return [key, value || true];
    })
);

const { url, name = "GeneratedType", out = "src/shared/types/generated-type.ts" } = options;

if (!url) {
  console.error("❌ Fehler: Bitte gib eine URL an mit --url=<schema-url>");
  process.exit(1);
}

async function fetchJson(url, { timeoutMs = 15000 } = {}) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function run() {
  console.log(`↻ Hole Schema von: ${url}`);
  const schema = await fetchJson(url);

  const ts = await compile(schema, name, {
    bannerComment: "",
    additionalProperties: false,
    style: { semi: true, singleQuote: false },
  });

  const abs = resolve(out);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, ts, "utf8");

  console.log(`✔︎ Interface "${name}" wurde erzeugt: ${abs}`);
}

run().catch((err) => {
  console.error("✖ Fehler beim Generieren:", err);
  process.exit(1);
});
