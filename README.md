# Starwars

Diese Projekt ist meine Lösungsvariante für diese [Aufgabe](public\Probeaufgabe_Angular.pdf). Die Designumsetzung ist mit Angular Material erfolgt. 

## Angular Standard Befehle

Die Standard-Scripts von Angular wurden nicht überschrieben oder geändert. Dev-Server läuft unter weiterhin unter `http://localhost:4200/`.


## Generating Types

Für die Typisierung werden die schemas von `https://swapi.info/` verwendet und automatisch Interfaces angelegt. 
Hinweis: Das schema enthält nicht die ID des Datensatzes, diese wird allerdings für die Anwendungslogik benötigt. Dazu musste das generierte Interface extended werden s. [Person.ts](src\app\shared\types\person.ts). 

```bash
npm run gen:swapi:people
```

Um die anderen Types, die von der Api zur Verfügung gestellt werden, generieren zu lassen, muss lediglich ein neues npm script angelegt werden. Dazu kann das jetzige kopiert und der --name sowie die --url und der --out=src angepasst werden. 


## Erweiterbarkeit

Die `https://swapi.info/` API liefert noch 5 weitere Endpunkte neben der `https://swapi.info/people`. Diese sind auf der Startseite angedeutet. Die Komponenten dafür wurden nicht erstellt, ebenso wenig die Routen, da es zur Erfüllung der Aufgabe nicht relevant war. Allerdings wurde für die Side-by-Side-View ein [Template](\src\app\shared\ui-components\split-view\split-view.html) angelegt. Dort werden durch Content-Projection die Inhalte nebeneinander gerendert. Die genaue Funktionsweise kann der [PeopleList](src\app\components\people\people-list\people-list.html) entnommen werden. So muss zur Erweiterung der Anwednung nur der [ApiService](src\app\shared\services\api\api.ts) angepasst und die Komponente sowie der entsprechende Resolver angelegt werden.

