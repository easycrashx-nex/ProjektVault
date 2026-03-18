# Arcane Vault

Lokaler Prototyp eines Sammelkartenspiels mit:

- Kontoerstellung mit Spielername und Passwort
- 5 kostenlosen Starter-Boostern bei neuen Konten
- mehreren Booster-Stufen im Shop
- mehr als 200 Karten inklusive Trainerkarten
- Deckspeicherung mit Verfügbarkeitsprüfung
- rundenbasierter Test-Arena

## Lokal testen

`index.html` direkt im Browser öffnen oder einen kleinen lokalen Webserver verwenden.

## Später auf Server umstellen

Die App speichert aktuell alles in `localStorage`.

Wichtige Umschaltpunkte in [app.js](C:/Users/ginow/Desktop/EasyCrashX/1/app.js):

- `loadDatabase()`
- `saveDatabase()`
- `loadSession()`
- `persistCurrentAccount()`
- `handleLogin()`
- `handleRegister()`

Für einen späteren Serverbetrieb können diese Stellen auf API-Requests umgestellt werden, ohne das restliche UI oder die Spiellogik neu zu schreiben.
