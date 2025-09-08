import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { PersonRaw } from '../../../shared/types/swapi-person';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

type PersonForm = FormGroup<{
  name: FormControl<string>;
  birth_year: FormControl<string>;
  gender: FormControl<string>;
  height: FormControl<string>;
  mass: FormControl<string>;
  hair_color: FormControl<string>;
  skin_color: FormControl<string>;
  eye_color: FormControl<string>;
  homeworld: FormControl<string>;
  films: FormControl<string>;
  species: FormControl<string>;
  vehicles: FormControl<string>;
  starships: FormControl<string>;
  url: FormControl<string>;
}>;

@Component({
  selector: 'app-add-person-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './add-person-dialog.html',
  styleUrl: './add-person-dialog.scss'
})
export class AddPersonDialog {
  private readonly dialogRef = inject(MatDialogRef<AddPersonDialog, PersonRaw>);

  // Hinweis: pattern erlaubt leere Werte (Required separat)
  private readonly numberLike = Validators.pattern(/^\d+(\.\d+)?$/);
  private readonly urlPattern = Validators.pattern(
    /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:[/?#][^\s]*)?$/
  );
  form: PersonForm = new FormGroup({
    name:        new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    birth_year:  new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    gender:      new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    height:      new FormControl<string>('', { nonNullable: true, validators: [this.numberLike] }),
    mass:        new FormControl<string>('', { nonNullable: true, validators: [this.numberLike] }),
    hair_color:  new FormControl<string>('', { nonNullable: true }),
    skin_color:  new FormControl<string>('', { nonNullable: true }),
    eye_color:   new FormControl<string>('', { nonNullable: true }),
    homeworld:   new FormControl<string>('', { nonNullable: true }),
    films:     new FormControl<string>('', { nonNullable: true }),
    species:   new FormControl<string>('', { nonNullable: true }),
    vehicles:  new FormControl<string>('', { nonNullable: true }),
    starships: new FormControl<string>('', { nonNullable: true }),
    url:          new FormControl<string>('', { nonNullable: true, validators: [Validators.required, this.urlPattern] }),
  });

  private parse = (s: string): string[] => s.split(',').map(x => x.trim()).filter(Boolean);
  
  submit() {
    if (this.form.invalid) return;

    const f = this.form.getRawValue(); // dank nonNullable überall string
    const now = new Date().toISOString();

    const person: PersonRaw = {
      name: f.name,
      height: f.height,
      mass: f.mass,
      hair_color: f.hair_color,
      skin_color: f.skin_color,
      eye_color: f.eye_color,
      birth_year: f.birth_year,
      gender: f.gender,
      homeworld: f.homeworld,
      films: this.parse(f.films) as [] | [string],
      species: this.parse(f.species) as [] | [string],
      vehicles: this.parse(f.vehicles) as [] | [string],
      starships: this.parse(f.starships) as [] | [string],
      created: now,
      edited: now,
      url: f.url
    };

    this.dialogRef.close(person);
  }

  close() { this.dialogRef.close(); }
}
