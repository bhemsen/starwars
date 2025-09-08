// add-person-dialog.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AddPersonDialog } from './add-person-dialog';

describe('AddPersonDialog (Karma/Jasmine)', () => {
  let fixture: ComponentFixture<AddPersonDialog>;
  let component: AddPersonDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddPersonDialog>>;

  const fixedNow = new Date('2025-01-02T03:04:05.000Z');

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<AddPersonDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddPersonDialog],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    jasmine.clock().install();
    jasmine.clock().mockDate(fixedNow);

    fixture = TestBed.createComponent(AddPersonDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });

  it('should have required validators on name, birth_year, gender, url', () => {
    const f = component.form.controls;

    f.name.setValue('');
    f.birth_year.setValue('');
    f.gender.setValue('');
    f.url.setValue('');

    expect(f.name.invalid).withContext('name required').toBeTrue();
    expect(f.birth_year.invalid).withContext('birth_year required').toBeTrue();
    expect(f.gender.invalid).withContext('gender required').toBeTrue();
    expect(f.url.invalid).withContext('url required + pattern').toBeTrue();
  });

  it('should allow empty height/mass but enforce number-like pattern when set', () => {
    const { height, mass } = component.form.controls;

    // leer ist gültig (kein required)
    height.setValue('');
    mass.setValue('');
    expect(height.valid).toBeTrue();
    expect(mass.valid).toBeTrue();

    // ungültige Zahlen
    height.setValue('12a');
    mass.setValue('1.2.3');
    expect(height.invalid).toBeTrue();
    expect(mass.invalid).toBeTrue();

    // gültige Zahlen
    height.setValue('180');
    mass.setValue('72.5');
    expect(height.valid).toBeTrue();
    expect(mass.valid).toBeTrue();
  });

  it('should validate url pattern', () => {
    const url = component.form.controls.url;

    url.setValue('not-a-url');
    expect(url.invalid).toBeTrue();

    url.setValue('http://example.com');
    expect(url.valid).toBeTrue();

    url.setValue('https://sub.example.co.uk/path?x=1#y');
    expect(url.valid).toBeTrue();
  });

  it('should not close the dialog when form is invalid', () => {
    component.form.patchValue({
      name: '',
      birth_year: '',
      gender: '',
      url: '',
    });
    component.submit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should parse comma-separated lists correctly (trim + filter empties)', () => {
    component.form.patchValue({
      name: 'Luke',
      birth_year: '19BBY',
      gender: 'male',
      url: 'https://swapi.dev/api/people/1/',
      films: ' , , A New Hope , Empire Strikes Back,,  Return of the Jedi , ',
      species: ',human, ,',
      vehicles: 'speeder',
      starships: '',
      height: '',
      mass: '',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      homeworld: 'https://swapi.dev/api/planets/1/',
    });

    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    const payload = dialogRefSpy.close.calls.mostRecent().args[0] as any;

    expect(payload.films).toEqual([
      'A New Hope',
      'Empire Strikes Back',
      'Return of the Jedi',
    ]);
    expect(payload.species).toEqual(['human']);
    expect(payload.vehicles).toEqual(['speeder']);
    expect(payload.starships).toEqual([]); 
  });

  it('should build PersonRaw and close dialog with correct payload (created/edited use now)', () => {
    component.form.patchValue({
      name: 'Leia Organa',
      birth_year: '19BBY',
      gender: 'female',
      height: '150',
      mass: '49.5',
      hair_color: 'brown',
      skin_color: 'light',
      eye_color: 'brown',
      homeworld: 'https://swapi.dev/api/planets/2/',
      films: 'A New Hope, The Last Jedi',
      species: '',
      vehicles: '',
      starships: 'Tantive IV',
      url: 'https://swapi.dev/api/people/5/',
    });

    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    const person = dialogRefSpy.close.calls.mostRecent().args[0] as any;

    expect(person).toEqual({
      name: 'Leia Organa',
      height: '150',
      mass: '49.5',
      hair_color: 'brown',
      skin_color: 'light',
      eye_color: 'brown',
      birth_year: '19BBY',
      gender: 'female',
      homeworld: 'https://swapi.dev/api/planets/2/',
      films: ['A New Hope', 'The Last Jedi'],
      species: [],
      vehicles: [],
      starships: ['Tantive IV'],
      created: fixedNow.toISOString(),
      edited: fixedNow.toISOString(),
      url: 'https://swapi.dev/api/people/5/',
    });
  });

  it('close() should close the dialog without payload', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});
