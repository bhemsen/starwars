import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

  
const numStars = 100;
const stars: HTMLDivElement[] = [];
const starNormPos: Array<number[]> = [];
let width = 0, height = 0;

const starContainer = document.createElement("div");
Object.assign(starContainer.style, {
  position: "fixed",
  inset: "0",
  overflow: "hidden",
  pointerEvents: "none",
  contain: "content",
});
document.body.appendChild(starContainer);

function initStars() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < numStars; i++) {
    const u = Math.random();
    const v = Math.random();
    starNormPos.push([u, v]);

    const el = document.createElement("div");
    el.className = "star";
    el.style.position = "absolute";
    el.style.transform = "translate(0px,0px)";
    frag.appendChild(el);
    stars.push(el);
  }
  starContainer.appendChild(frag);
}

function layoutFromSize(w: number, h: number) {
  // nur 1x read, dann nur writes
  for (let i = 0; i < numStars; i++) {
    const [u, v] = starNormPos[i];
    const x = Math.floor(u * w);
    const y = Math.floor(v * h);
    stars[i].style.transform = `translate(${x}px, ${y}px)`;
  }
}

function relayout() {
  const w = starContainer.clientWidth;
  const h = starContainer.clientHeight;
  if (w === width && h === height) return; // keine Arbeit, wenn unverändert
  width = w; height = h;
  layoutFromSize(width, height);
}

// Initialisierung
initStars();
relayout();

// ResizeObserver mit rAF-Throttle
let needsRelayout = false;
const ro = new ResizeObserver(() => {
  if (needsRelayout) return;
  needsRelayout = true;
  requestAnimationFrame(() => {
    needsRelayout = false;
    relayout();
  });
});
ro.observe(starContainer);