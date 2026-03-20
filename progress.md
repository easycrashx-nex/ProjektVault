Original prompt: und hp ist immernoch kleiner als wie die anderen beiden... das bitte auch noch anpassen

- 2026-03-19: Karten-Stats auf ein echtes 3-Spalten-Raster gestellt, damit Kosten, ATK und HP gleich breit sind.
- 2026-03-19: Detail-Modal scrollt jetzt intern und sperrt den Hintergrund.
- 2026-03-19: Doppelte mittlere Effekt-Chips auf normalen Karten entfernt.
- 2026-03-19: Markt-/Besitz-Labels im Karten-Modal gekürzt und sicherer Umbruch fuer kleine Kennzahl-Karten aktiviert.
- 2026-03-19: Neue Spielernamen-Regel eingefuehrt: maximal 12 Zeichen, Admin-Varianten wie Admin/Adm1n/a-d-m-i-n werden bei Registrierung und Umbenennen blockiert.
- 2026-03-20: Karten-Modal weiter entschlackt: alte tote Legacy-Details aus `renderCardModal()` entfernt, Marktlabels auf kurze Varianten reduziert (`Brutto`, `Netto`, `Gebühr`, `Ankauf`, `Trend`) und `detail-stat` mit `min-width: 0` sowie Umbruchschutz gegen überlaufende Titel gehärtet.

TODO
- Karten-Modal im echten Browser noch einmal visuell gegen lange franzoesische und deutsche Texte pruefen.
- Falls weitere Marktlabels knapp werden, die unteren Kennzahl-Karten in einem 4+4 statt 2x4 Layout testen.
