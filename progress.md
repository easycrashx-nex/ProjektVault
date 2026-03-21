Original prompt: wenn du damit fertig bist baue bitte den freundes bereich komplett fertig das man Traden kann und aber auch freunde adden bzw suchen kann und das man auch gegen freunde spielen kann... zusätlich erweitere den profiel bereich das man jetzt auch sowas wie profielbilder, profielrahmen, Titel usw haben kann die Profielbilder, Profielrahmen und die titel kann man dann im shop kaufern dafür muss du logischerweise dann einen neuen tab oder mehrere neue tabs machen wo man das dann kaufen kann da lass ich dich entscheiden...

- 2026-03-20: Profilbereich auf serverfähiges Loadout umgestellt: Profilbild, Profilrahmen und Titel lassen sich jetzt direkt im Profil auswählen und speichern.
- 2026-03-20: Profil-Sammlung als echte Kosmetik-Übersicht aufgebaut, inklusive Besitzstatus, Aktiv-Markierung und Direkt-Anlegen.
- 2026-03-20: Freundesbereich vollständig auf servergestützte Suche, Freundesanfragen, Blocken/Entsperren, Handel und Freundesduelle umgebaut.
- 2026-03-20: Shop um einen dritten Tab für Profil-Kosmetik erweitert; Avatare, Rahmen und Titel werden jetzt direkt aus dem Shop gekauft.
- 2026-03-20: Freundesduelle in die Match-Erstellung integriert, inklusive eigener Match-Kennzeichnung ohne Arena-Belohnungen oder Arena-Strafen.
- 2026-03-20: Neue UI-Komponenten für Social/Profile/Shop gebaut und das Layout vereinheitlicht: Identity-Preview, Social-Cards, Angebotskarten, Trade-/Duel-Builder und Kosmetik-Karten.
- 2026-03-20: Frontend-Spiegel nach `frontend/public` synchronisiert und Syntaxprüfung mit `npm run check` erfolgreich ausgeführt.

TODO
- Social-/Profilbereiche noch einmal auf dem live deployten Server visuell gegen echte Daten prüfen.
- Bei Bedarf Freundesduelle später vollständig serverautoritativ machen statt den Kampf lokal im Frontend abzuwickeln.

- 2026-03-20: Detail-Stat-Karten im Kartenfenster gegen �berlange Label geh�rtet; Titel umbrechen jetzt sauber und kollidieren nicht mehr mit Nachbarkarten.

- 2026-03-20: Server-Datenspeicher f�r Redeploys geh�rtet: Persistenzpfad /data/projekt-vault, automatische Migration vom alten Pfad und Backup-Datei vor Schreibvorg�ngen eingebaut.

- 2026-03-21: Backend-Store gegen Race-Conditions geh�rtet: updateDatabase serialisiert jetzt den kompletten Read-Modify-Write-Zyklus, damit parallele Saves keine Accounts mehr �berschreiben. Login-Route ebenfalls auf atomaren Session-Write umgestellt.

- 2026-03-21: Dockerfile-Fallback-Volume entfernt, damit Coolify nicht still auf ein wegwerfbares Docker-Volume ausweicht. /api/meta zeigt jetzt den aktiven Datenpfad zur Server-Diagnose.
