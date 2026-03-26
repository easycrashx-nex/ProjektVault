# Projekt Vault

Projekt Vault ist ein browserbasiertes Sammelkartenspiel mit Booster-Öffnung, Sammlung, Deckbau, Arena-Kämpfen, Markt, Quests, Errungenschaften, Freundesfunktionen und serverfähigem Spielstand.

Das Projekt kann lokal entwickelt und direkt im Browser getestet werden, besitzt aber zusätzlich einen Backend-Pfad für persistenten Serverbetrieb.

## Features

- Booster, Packs und Marktplatz
- Sammlung mit Filtern, Sortierung und Detailansicht
- Standard- und Hardcore-Decks
- Arena mit mehreren Schwierigkeitsstufen
- Quests, Liga und Errungenschaften
- Freundesliste, Handel und Freundesduelle
- Profilsystem mit Kosmetik
- Admin-Bereich für Verwaltung

## Projektstruktur

- `index.html`, `styles.css`, `app.js`
  Haupt-Frontend für das Spiel.
- `frontend/public/`
  Gespiegelte Frontend-Ausgabe für den Serverbetrieb.
- `backend/src/`
  Backend für Auth, Profil, Spielstand, Markt, Freunde, Admin und Matchzustand.
- `backend/data/`
  Lokaler Entwicklungsordner für gespeicherte Daten.
- `shared/`
  Gemeinsam genutzte Definitionen zwischen Frontend und Backend.
- `scripts/`
  Hilfsskripte für Synchronisation und Entwicklung.
- `Dockerfile`
  Docker-Build für Deployments.

## Voraussetzungen

- Node.js `20+`

## Lokal starten

### Direkt im Browser

Einfach `index.html` öffnen.

### Über den lokalen Server

```powershell
npm run dev
```

Danach im Browser öffnen:

`http://localhost:3000`

## Wichtige Skripte

```powershell
npm run sync:frontend
npm run dev
npm run start
npm run check
```

## Deployment

Für einen produktiven Server-Deploy liegt eine Hetzner/Coolify-Anleitung in:

- `DEPLOY_HETZNER.md`

## Sicherheit

Hinweise zur Meldung von Schwachstellen und zum Security-Prozess liegen in:

- `SECURITY.md`

Wichtige Umgebungsvariablen:

- `HOST=0.0.0.0`
- `PORT=3000`
- `DATA_DIR=/data/projekt-vault`
- `ADMIN_USERNAME=<dein-admin-name>`
- `ADMIN_PASSWORD=<starkes-passwort>`

Für produktiven Betrieb gilt:

- Nutzerdaten nicht im austauschbaren App-Code speichern
- einen persistenten Pfad oder Mount für `DATA_DIR` verwenden
- Secrets niemals ins Repository committen
- vor produktiven Änderungen Backups einplanen

## API-Überblick

Das Backend stellt unter anderem Routen für diese Bereiche bereit:

- Authentifizierung
- Profil
- Spielstand
- Shop und Markt
- Freunde und Handel
- Admin-Funktionen
- Matchzustand

Healthcheck:

- `GET /api/health`

## Roadmap

Ein paar sinnvolle nächste Schritte für das Projekt:

- weitere PvE- und PvP-Modi
- feinere Balance-Pässe
- echte Datenbank statt JSON-Store
- Desktop-Client für spätere Store-Releases
- zusätzliche Live-Events und Saison-Inhalte

## Hinweis

Dieses Repository enthält aktiven Spielcode in Entwicklung. Strukturen, Werte und Inhalte können sich noch ändern.
