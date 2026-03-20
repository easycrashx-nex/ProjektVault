# Arcane Vault auf Hetzner deployen

Diese Anleitung ist für den einfachsten Weg gedacht.

## Meine klare Empfehlung

Nimm in Hetzner links:

- `Servers`
- danach zusätzlich `Firewalls`
- optional später `DNS Zones`, wenn du eine Domain direkt bei Hetzner verwalten willst

`Volumes`, `Load Balancers`, `Floating IPs`, `Networks`, `Buckets` und `Storage Boxes` brauchst du für den ersten Start nicht.

## Zwei sinnvolle Wege

### Weg A: Am einfachsten für GitHub-Deploys

Server mit `Coolify` aufsetzen.

Das ist für dich wahrscheinlich der leichteste Weg, weil du dann später einfach dein GitHub-Repo verbindest und Deployments über eine Oberfläche anstoßen kannst.

### Weg B: Direkt und schlicht

Server mit `Docker CE` oder normalem `Ubuntu 24.04` aufsetzen und das Projekt per Docker Compose starten.

Das ist technisch einfacher zu verstehen, aber etwas manueller.

## Was du in Hetzner konkret klickst

### 1. Server anlegen

In Hetzner:

1. `Servers`
2. `Create Server`
3. Region auswählen
4. Image:
   - entweder `Coolify`
   - oder `Docker CE`
   - oder `Ubuntu 24.04`
5. Einen kleinen Cloud-Server wählen

Für den Anfang reicht meistens ein kleiner Server. Wenn später viele Spieler gleichzeitig online sind, musst du hochskalieren.

Wichtig:

- SSH-Key direkt beim Erstellen auswählen
- wenn du keinen SSH-Key auswählst, musst du mit dem Root-Passwort arbeiten

### 2. Firewall anlegen

In Hetzner:

1. `Firewalls`
2. `Create Firewall`
3. eingehend nur freigeben:
   - TCP `22` für SSH
   - TCP `80` für HTTP
   - TCP `443` für HTTPS
4. Firewall auf den Server anwenden

## Weg A: Mit Coolify

Wenn du `Coolify` als Server-App wählst:

1. Server erstellen
2. per SSH auf den Server
3. Coolify-Erstsetup abschließen
4. in Coolify dein GitHub-Repo verbinden
5. Deployment-Typ über `Dockerfile`
6. Port `3000`
7. als Persistenz in Coolify einen `Directory Mount` setzen:
   - Server-Pfad: `/data/projekt-vault`
   - Container-Pfad: `/data/projekt-vault`
8. Domain hinzufügen
9. Deploy auslösen

Dann reicht später meistens:

1. lokal ändern
2. auf GitHub pushen
3. in Coolify neu deployen oder Auto-Deploy nutzen

## Weg B: Direkt mit Docker

### 1. Auf den Server verbinden

Beispiel:

```bash
ssh root@DEINE_SERVER_IP
```

### 2. Projekt klonen

```bash
apt update && apt upgrade -y
apt install -y git docker.io docker-compose-plugin
git clone https://github.com/DEINNAME/arcane-vault.git
cd arcane-vault
cp .env.example .env
```

Wichtig:

- `DATA_DIR` sollte auf `/data/projekt-vault` bleiben
- dort liegen die Nutzerdaten und Marktstände bewusst außerhalb des austauschbaren App-Codes
- zusätzlich wird vor jedem Schreibvorgang eine Backup-Datei `local-database.backup.json` im selben Ordner gepflegt

### 3. Container starten

```bash
docker compose up -d --build
```

Danach läuft die App erstmal auf:

`http://DEINE_SERVER_IP:3000`

## Domain später

Wenn du eine Domain hast:

- DNS `A` Record auf die Server-IP zeigen lassen
- danach Reverse Proxy oder Coolify-HTTPS nutzen

## Wichtiger Sicherheitsstatus

Der Server-Teil ist jetzt vorbereitet und Auth/Profil laufen bereits über Backend, aber die komplette Spielwirtschaft ist noch nicht vollständig serverseitig.

Das heißt:

- Login ist schon auf dem Server möglich
- Profiländerungen sind schon serverseitig vorbereitet
- Gold, Karten, Booster, Decks und Marktplatz sind noch nicht vollständig vom Frontend ins Backend migriert

Für echte Sicherheit im Live-Betrieb ist genau das der nächste Schritt.

## Was du als Nächstes von mir bekommen solltest

Wenn du willst, mache ich jetzt als Nächstes genau diese Server-Migration:

1. Gold, Sammlung und Booster serverseitig speichern
2. Decks serverseitig speichern
3. Marktplatz serverseitig speichern
4. lokale direkte Spielstände komplett abschalten

Dann wäre dein Ablauf wirklich:

1. lokal coden
2. auf GitHub pushen
3. auf Hetzner deployen
4. nur noch den Serverstand verwenden

## Quellen

- [Hetzner: Creating a Server](https://docs.hetzner.com/cloud/servers/getting-started/creating-a-server)
- [Hetzner: Connecting to your Server](https://docs.hetzner.com/cloud/servers/getting-started/connecting-to-the-server/)
- [Hetzner: Creating a Firewall](https://docs.hetzner.com/cloud/firewalls/getting-started/creating-a-firewall)
- [Hetzner: Docker CE App](https://docs.hetzner.com/cloud/apps/list/docker-ce/)
- [Hetzner: Coolify App](https://docs.hetzner.com/de/cloud/apps/list/coolify/)
