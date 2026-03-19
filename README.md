# Arcane Vault

Arcane Vault läuft jetzt in zwei Modi:

- direkt lokal im Browser über die Root-Dateien `index.html`, `styles.css`, `app.js`
- serverbereit über `backend/` plus `frontend/public/`

Damit kannst du lokal weiter wie bisher testen, hast aber parallel schon eine Struktur, die später sauber auf einen Server geschoben werden kann.

## Projektstruktur

- `index.html`, `styles.css`, `app.js`
  Der aktuelle lokale Prototyp. Direkt im Browser nutzbar.
- `frontend/public/`
  Server-Ausgabe des Frontends. Wird aus den Root-Dateien synchronisiert.
- `backend/src/`
  Server-Grundgerüst mit API-Routen, statischem Datei-Server, JSON-Datenspeicher und Auth-Basis.
- `backend/data/`
  Laufzeitdaten für den lokalen Serverbetrieb.
- `scripts/sync-frontend.mjs`
  Kopiert die Root-Dateien nach `frontend/public/`.

## Lokal testen

### Direkt wie bisher

`index.html` direkt im Browser öffnen.

### Über den neuen Server

```powershell
npm run dev
```

Danach im Browser öffnen:

`http://localhost:3000`

## Wichtige Scripts

```powershell
npm run sync:frontend
npm run dev
npm run start
npm run check
```

## API-Startpunkt

Der Server stellt bereits vorbereitete Routen bereit:

- `GET /api/health`
- `GET /api/meta`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/profile/me`
- `PATCH /api/profile/me`
- `GET /api/shop/catalog`
- `GET /api/market/overview`
- `GET /api/friends/overview`
- `GET /api/admin/accounts`
- `GET /api/matches/active`

Wichtig: Das Frontend nutzt aktuell weiterhin seine lokale Spiel- und Speicherlogik. Das Backend ist als sauberer nächster Schritt vorbereitet, aber noch nicht vollständig an das große `app.js` gekoppelt.

## Für späteren Serverbetrieb

Wenn du später auf deinen Server gehst, ist der sinnvolle Ablauf:

1. Repository auf GitHub aktuell halten
2. auf dem Server clonen
3. `.env` aus `.env.example` ableiten
4. `npm run sync:frontend`
5. `npm run start`

Für Hetzner gibt es jetzt zusätzlich eine konkrete Anleitung in:

[DEPLOY_HETZNER.md](C:/Users/ginow/Desktop/EasyCrashX/1/DEPLOY_HETZNER.md)

## Server-Migration

Die nächsten sinnvollen Migrationsschritte sind jetzt klar getrennt:

- Frontend schrittweise von `localStorage` auf `/api/*` umstellen
- Sessions und Rollen komplett serverseitig erzwingen
- Gold, Sammlung, Booster und Markt vollständig ins Backend ziehen
- Arena-Matches serverseitig speichern
- Freundeslisten und Handel über echte Datenbank-Tabellen/API-Routen anbinden

## Hinweis

Die Root-Dateien bleiben absichtlich erhalten, damit dein bisheriger lokaler Testablauf nicht kaputtgeht. `frontend/public/` ist die serverfähige Spiegelung davon.
