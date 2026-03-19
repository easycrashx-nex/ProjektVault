# Arcane Vault

Lokaler Prototyp eines Sammelkartenspiels mit:

- Kontoerstellung mit Spielername und Passwort
- 5 kostenlosen Starter-Boostern bei neuen Konten
- mehreren Booster-Stufen im Shop
- mehr als 700 Karten inklusive Trainerkarten
- Status-Effekten, Synergien und Timing-Regeln im Match
- Deckspeicherung mit Verfügbarkeitsprüfung
- rundenbasierter Test-Arena
- lokale Hardening-Schicht für Sessions, Passwort-Hashes und Save-Sanitizing

## Lokal testen

`index.html` direkt im Browser öffnen oder einen kleinen lokalen Webserver verwenden.

## Später auf Server umstellen

Die App speichert aktuell alles in `localStorage`.

Wichtige Umschaltpunkte in [app.js](C:/Users/ginow/Desktop/EasyCrashX/1/app.js):

- `loadDatabase()`
- `saveDatabase()`
- `loadSession()`
- `loginAs()`
- `logout()`
- `persistCurrentAccount()`
- `handleLogin()`
- `handleRegister()`
- `normalizeAccount()`
- `normalizeMarketState()`
- `buyCardOnMarket()`
- `sellCardOnMarket()`

Für einen späteren Serverbetrieb können diese Stellen auf API-Requests umgestellt werden, ohne das restliche UI oder die Spiellogik neu zu schreiben.

Empfohlene Server-Aufteilung:

- Authentifizierung und Session-Tokens gehören ins Backend, nicht in `localStorage`
- Gold, Sammlung, Booster, Decks und Marktpreise müssen serverseitig geprüft und gespeichert werden
- Admin-Rechte dürfen später nur über serverseitige Rollenprüfung freigeschaltet werden
- Marktplatzgebühren sollten serverseitig verbucht werden, damit sie nicht lokal manipulierbar bleiben

Wichtig: Der aktuelle Stand ist lokal deutlich härter als vorher, aber ein reines Browser-Spiel kann Wirtschaft, Admin-Rechte und Besitzstände nie vollständig absichern. Für echten Live-Betrieb braucht es zwingend ein Backend.
