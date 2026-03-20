# Projekt Vault

Projekt Vault kann weiter direkt lokal aus den Root-Dateien gestartet werden, hat aber jetzt auch einen serverfähigen Pfad mit Backend, persistentem Spielstand und Deploy-Setup für Hetzner/Coolify.

## Struktur

- `index.html`, `styles.css`, `app.js`
  Aktuelles Spiel-Frontend.
- `frontend/public/`
  Server-Ausgabe des Frontends. Wird aus den Root-Dateien gespiegelt.
- `backend/src/`
  API-Server für Auth, Profil, Spielstand, Markt, Freunde, Admin und Match-Snapshots.
- `backend/data/`
  Lokaler Entwicklungsordner für den JSON-Store.
- `/data/projekt-vault`
  Empfohlener Server-Pfad für persistente Nutzerdaten, Marktstände und Backups bei Docker/Coolify.
- `scripts/sync-frontend.mjs`
  Spiegelt die Root-Dateien nach `frontend/public/`.
- `Dockerfile`
  Deploy-Pfad für Coolify oder andere Docker-Setups.

## Lokal starten

### Direkt im Browser

`index.html` öffnen.

### Über den Server

```powershell
npm run dev
```

Danach im Browser:

`http://localhost:3000`

## Wichtige Scripts

```powershell
npm run sync:frontend
npm run dev
npm run start
npm run check
```

## API-Routen

- `GET /api/health`
- `GET /api/meta`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/profile/me`
- `PATCH /api/profile/me`
- `PATCH /api/profile/password`
- `GET /api/game/state`
- `PATCH /api/game/state`
- `GET /api/shop/catalog`
- `GET /api/market/overview`
- `GET /api/market/state`
- `PATCH /api/market/state`
- `GET /api/friends/overview`
- `PATCH /api/friends/overview`
- `GET /api/admin/accounts`
- `POST /api/admin/action`
- `GET /api/matches/active`
- `PATCH /api/matches/active`

## Aktueller Server-Stand

Im Serverpfad werden Konto, Sammlung, Booster, Decks, Profil, Einstellungen, Marktstand und Match-Snapshot an das Backend gespiegelt. Die Match-Logik selbst läuft noch im Frontend, aber der aktive Matchzustand wird serverseitig gespeichert.

## Deploy

Für Hetzner/Coolify liegt die Anleitung in:

[DEPLOY_HETZNER.md](C:/Users/ginow/Desktop/EasyCrashX/1/DEPLOY_HETZNER.md)

Wichtige Env-Variablen:

- `HOST=0.0.0.0`
- `PORT=3000`
- `DATA_DIR=/data/projekt-vault`
- `ADMIN_USERNAME=obsidian_admin`
- `ADMIN_PASSWORD=<eigenes starkes Passwort>`

Wichtig für Serverbetrieb:

- Nutzerdaten sollen nicht im App-Code-Pfad liegen.
- Der Server schreibt standardmäßig nach `/data/projekt-vault/local-database.json`.
- Vor jedem Schreibvorgang wird zusätzlich `/data/projekt-vault/local-database.backup.json` aktualisiert.
- In Coolify sollte der Persistenz-Mount deshalb genau auf `/data/projekt-vault` zeigen.

## Nächste sinnvolle Schritte

- Match-Aktionen selbst serverautoritativ machen
- Freundes- und Handelsaktionen serverseitig ausbauen
- JSON-Store bei Bedarf auf eine echte Datenbank umstellen
- Produktivdomain, HTTPS und engere Firewall-Regeln setzen
