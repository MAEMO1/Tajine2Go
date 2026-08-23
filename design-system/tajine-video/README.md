# tajine-video

Werkmap voor de 3D-render van de tajine-animatie.

| Map | Wat er in hoort |
|---|---|
| `input/` | De bronvideo, precies zoals hij uit de renderstap komt. Niets aan wijzigen. |
| `frames/` | De losse beelden die uit de bronvideo getrokken zijn. |
| `transparent/` | Dezelfde beelden nadat de achtergrond verwijderd is. |
| `output/` | Het eindresultaat: de samengestelde video of animatie voor de site. |

De mappen staan in git, de bestanden niet — zie `.gitignore` hiernaast. Een
bronvideo van tientallen megabytes en duizenden losse frames horen niet in de
repo-geschiedenis; die blijven op de machine waar je rendert.

Wat wél de repo in gaat is het eindresultaat, en dan op zijn plek in `public/`
van de website, niet hier.
