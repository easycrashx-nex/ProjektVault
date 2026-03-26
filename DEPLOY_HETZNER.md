# Projekt Vault auf Hetzner deployen

Diese Anleitung beschreibt einen einfachen Produktionspfad für `Projekt Vault` auf Hetzner.

## Empfohlene Varianten

### Variante A: Hetzner + Coolify

Empfohlen für:

- GitHub-basierte Deployments
- einfache Verwaltung per Weboberfläche
- kleine bis mittlere Projekte

### Variante B: Hetzner + Docker

Empfohlen für:

- manuelle Deployments
- einfache Server ohne zusätzliche Verwaltungsebene
- Entwickler, die den Stack selbst kontrollieren wollen

## Voraussetzungen

- Hetzner Cloud Server
- SSH-Zugriff
- Repository-Zugriff
- Domain optional, aber empfohlen

## Server-Grundsetup

In Hetzner werden für einen einfachen Start in der Regel diese Bereiche benötigt:

- `Servers`
- `Firewalls`
- optional `DNS Zones`

Für viele erste Setups sind diese Ports eingehend ausreichend:

- `22` TCP für SSH
- `80` TCP für HTTP
- `443` TCP für HTTPS

Wenn Coolify initial direkt über Port `8000` verwendet wird, muss dieser Port während des Setups zusätzlich freigegeben sein.

## Variante A: Deploy mit Coolify

### 1. Server erstellen

Empfohlene Basis:

- Image: `Coolify` oder `Ubuntu 24.04`
- öffentlicher SSH-Key
- kleine bis mittlere Instanz für den Anfang

### 2. Firewall setzen

Mindestens:

- TCP `22`
- TCP `80`
- TCP `443`

Falls nötig temporär zusätzlich:

- TCP `8000`
- TCP `6001`
- TCP `6002`

### 3. Repository verbinden

In Coolify:

1. Projekt anlegen
2. GitHub-App oder Repository-Zugriff verbinden
3. Anwendung als `Dockerfile`-Deploy anlegen
4. Port `3000` verwenden

### 4. Persistente Daten setzen

Für produktiven Betrieb sollte ein persistenter Directory Mount gesetzt werden:

- Host-Pfad: `/data/projekt-vault`
- Container-Pfad: `/data/projekt-vault`

Dadurch bleiben Nutzerdaten und Backups bei Redeploys erhalten.

### 5. Wichtige Umgebungsvariablen

Mindestens:

- `HOST=0.0.0.0`
- `PORT=3000`
- `DATA_DIR=/data/projekt-vault`
- `ADMIN_USERNAME=<eigener-admin-name>`
- `ADMIN_PASSWORD=<starkes-passwort>`

### 6. Domain hinzufügen

Sobald die App läuft:

1. Domain in Coolify eintragen
2. DNS auf die Server-IP zeigen lassen
3. HTTPS/Let's Encrypt aktivieren

## Variante B: Deploy mit Docker

### 1. Server vorbereiten

```bash
apt update && apt upgrade -y
apt install -y git docker.io docker-compose-plugin
```

### 2. Projekt klonen

```bash
git clone https://github.com/<user>/<repo>.git
cd <repo>
cp .env.example .env
```

### 3. `.env` anpassen

Wichtige Variablen:

- `HOST=0.0.0.0`
- `PORT=3000`
- `DATA_DIR=/data/projekt-vault`
- `ADMIN_USERNAME=<eigener-admin-name>`
- `ADMIN_PASSWORD=<starkes-passwort>`

### 4. Persistenz vorbereiten

```bash
mkdir -p /data/projekt-vault
```

### 5. Container starten

```bash
docker compose up -d --build
```

Danach ist die Anwendung typischerweise unter folgendem Port erreichbar:

- `http://SERVER-IP:3000`

## Backup-Hinweise

Für produktiven Betrieb empfohlen:

- regelmäßige Sicherung von `DATA_DIR`
- Backups außerhalb des App-Code-Pfads
- vor größeren Updates ein zusätzliches manuelles Backup

## Sicherheit

Für einen öffentlichen oder produktiven Betrieb sollte zusätzlich beachtet werden:

- keine Secrets ins Repository committen
- starke Admin-Zugangsdaten verwenden
- Daten nicht im Container-Dateisystem ohne Persistenz speichern
- produktive Änderungen erst nach Test deployen

Weitere Hinweise:

- `SECURITY.md`

## Nützliche Quellen

- [Hetzner Cloud: Server erstellen](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server)
- [Hetzner Cloud: Server verbinden](https://docs.hetzner.com/cloud/servers/getting-started/connecting-to-the-server/)
- [Hetzner Cloud: Firewalls](https://docs.hetzner.com/cloud/firewalls/getting-started/creating-a-firewall)
- [Hetzner Cloud: Coolify App](https://docs.hetzner.com/de/cloud/apps/list/coolify/)
