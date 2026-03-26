# Security Policy

## Projekt Vault

Diese Security Policy beschreibt, wie Sicherheitsprobleme für `Projekt Vault` gemeldet und behandelt werden sollen.

## Unterstützte Stände

| Stand | Unterstützt |
| --- | --- |
| `master` / aktueller Server-Stand | Ja |
| älterer Deploy ohne aktuelle Commits | Eingeschränkt |
| alte lokale Kopien / alte Branches | Nein |

Kurz gesagt: Sicherheitsmeldungen sollen immer gegen den aktuellen `master`-Stand oder den aktuellen Live-Deploy geprüft werden.

## Sicherheitsprobleme melden

Bitte **keine öffentlichen GitHub-Issues** für Sicherheitslücken verwenden.

Stattdessen:

1. melde das Problem **privat** an den Repository-Eigentümer
2. oder nutze, wenn im Repository aktiviert, **GitHub Private Vulnerability Reporting / Security Advisories**

Wenn du eine Meldung schickst, füge möglichst diese Informationen bei:

- kurze Beschreibung des Problems
- betroffener Bereich
  - Login / Registrierung
  - Sessions / Rollen / Admin
  - Profil / Freunde / Handel / Duelle
  - Shop / Booster / Markt
  - Decks / Hardcore / Match-Logik
  - Server / Deploy / Persistenz
- konkrete Schritte zur Reproduktion
- erwartetes Verhalten
- tatsächliches Verhalten
- Schweregrad-Einschätzung
- falls vorhanden Screenshots, Logs oder HTTP-Requests

Bitte **niemals** mitschicken:

- Passwörter
- Admin-Passwörter
- Session-Tokens
- `.env`-Dateien
- vollständige Datenbank-Dumps mit echten Nutzerdaten
- private SSH-Keys

## Reaktionsziel

Zielwerte für die Bearbeitung:

- Eingangsbestätigung: innerhalb von `72 Stunden`
- erste technische Einschätzung: innerhalb von `7 Tagen`
- kritische Lücken: so schnell wie möglich
- hohe Lücken: priorisiert im nächsten Sicherheitsfix
- mittlere/niedrige Lücken: im regulären Wartungszyklus

Diese Zeiten sind Zielwerte und keine rechtliche Garantie.

## Umgang mit gemeldeten Schwachstellen

Der normale Ablauf sollte so aussehen:

1. Eingang der privaten Meldung
2. technische Prüfung und Reproduktion
3. Risikobewertung
4. Fix und Validierung
5. Deployment
6. koordinierte Offenlegung, wenn sinnvoll

Wenn die Meldung valide ist, sollte das Problem erst öffentlich beschrieben werden, **nachdem** ein Fix bereitsteht oder das Risiko klar eingegrenzt wurde.

## Was als relevant gilt

Diese Bereiche gelten als besonders sicherheitsrelevant:

- Authentifizierung und Passwortprüfung
- Session-Handling
- Admin-Bereich und Admin-Aktionen
- serverseitiger Spielstand
- Handels- und Freundesfunktionen
- Marktpreise, Belohnungen und Währungslogik
- Datenpersistenz auf dem Server
- Docker/Coolify/Hetzner-Deploy-Pfade

## Typische Beispiele

Beispiele für relevante Sicherheitsprobleme:

- Login-Bypass
- Rechteausweitung auf Admin
- Manipulation von Gold, Karten, Packs oder Marktwerten
- Replay / Doppel-Claim von Belohnungen
- Persistenzfehler, durch die Kontodaten überschrieben oder gelöscht werden
- ungeschützte API-Route
- Preisgabe sensibler Daten in URL, Logs oder Responses

## Nicht oder nur eingeschränkt im Scope

In der Regel nicht als klassische Sicherheitslücke behandelt:

- rein lokale Darstellungfehler ohne Sicherheitsauswirkung
- Balancing-Probleme ohne technischen Exploit
- veraltete private Teststände außerhalb des aktuellen Deploys
- Probleme, die nur durch absichtlichen lokalen Quellcode-Umbau im eigenen Browser entstehen

## Sichere Offenlegung

Wenn du glaubst, dass bereits sensible Daten offengelegt wurden:

1. betroffene Secrets sofort rotieren
2. Logs und Deploy-Konfiguration prüfen
3. betroffene Sessions ungültig machen
4. wenn nötig betroffene Nutzer informieren

## Server-Betrieb

Für produktiven Betrieb gilt:

- Nutzerdaten gehören in einen persistenten Serverpfad
- Secrets dürfen nicht im Repository liegen
- `ADMIN_PASSWORD` muss serverseitig gesetzt und regelmäßig geprüft werden
- Deploys sollten nicht ohne Backup-/Restore-Pfad erfolgen
- sicherheitsrelevante Änderungen sollten erst nach Test und Review live gehen

## Hinweis

Diese Policy ist ein praktischer Projektstandard für dieses Repository. Sie ersetzt keine rechtliche Beratung, kein vollständiges Compliance-Programm und kein professionelles Incident-Response-Framework.
