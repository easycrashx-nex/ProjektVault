# Contributing

Vielen Dank für dein Interesse an `Projekt Vault`.

## Entwicklungsgrundsätze

- Änderungen möglichst klein und nachvollziehbar halten
- keine Secrets, Tokens oder Zugangsdaten committen
- bei neuen Features auf bestehende Spielbalance achten
- UI-Änderungen konsistent zum vorhandenen Stil umsetzen
- serverrelevante Änderungen auf Persistenz und Sicherheitsfolgen prüfen

## Lokale Entwicklung

Voraussetzung:

- Node.js `20+`

Start:

```powershell
npm run dev
```

Checks:

```powershell
npm run check
```

## Pull Requests

Bitte bei Pull Requests möglichst:

- kurz erklären, was geändert wurde
- relevante Screenshots bei UI-Änderungen anhängen
- erwähnen, ob Frontend, Backend oder beide Bereiche betroffen sind
- bekannte Einschränkungen oder offene Punkte nennen

## Issue-Hinweise

- Bugs und Feature-Wünsche können als normale Issues eingereicht werden
- Sicherheitsprobleme bitte nicht öffentlich posten
- für Security-Themen gilt `SECURITY.md`

## Code-Stil

- klare, lesbare Namen
- keine unnötig großen Refactors in kleinen Fixes
- neue Features möglichst modular ergänzen
- bestehende Strukturen respektieren, statt sie ohne Grund komplett umzubauen

## Balance und Content

Bei neuen Karten, Boostern, Packs, Fraktionen oder Effekten gilt:

- hohe Seltenheiten dürfen stärker sein, aber nicht alles allein gewinnen
- niedrige Seltenheiten sollen durch clevere Synergien relevant bleiben
- neue Inhalte sollen das Spiel erweitern, nicht bestehende Decktypen komplett entwerten

## Deployment

Produktive Deploys und Serverhinweise:

- `DEPLOY_HETZNER.md`

## Lizenz

Mit einem Beitrag erklärst du dich damit einverstanden, dass dein Code unter der Projektlizenz veröffentlicht werden kann.
