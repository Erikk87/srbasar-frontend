# Hinweise für Claude

Fork von dirkdrutschmann/srbasar-frontend, beim NBBV die **Spielebörse** (https://nbbv-basketball.de/spieleboerse/).
Betrieb und NBBV-eigene Dateien: Abschnitt „NBBV-Betrieb“ oben in der [README](README.md).
Gemeinsame Konventionen für Texte und Design: CLAUDE.md im Repo Erikk87/nbbv-webservices („Einheitlicher Auftritt“).

- Arbeits-Branch ist `dev`, auf `main` nur per PR von `dev` und nur auf ausdrückliche Anweisung.
- Nichts deployt von hier: `deploy-spieleboerse.yml` in nbbv-webservices holt Änderungen alle 15 Minuten ab.
- Anpassungen möglichst über `VITE_*` in `.env.strato` oder in den NBBV-eigenen Dateien, Upstream-Dateien nur
  wenn nötig ändern (Merges mit `upstream` sollen einfach bleiben). Autor- und Lizenzangaben (CC BY-NC 4.0) nie entfernen.
- `src/styles/nbbv.css` und `nbbv-header.css` sind Kopien aus nbbv-webservices `shared/`: dort ändern, hier nachziehen.
- Vor dem Commit `npm test` (Lint, Tests, Build).
- Texte in Du-Form, „Spielebörse“, „Schiedsrichter:innen“, „Team“. Antworten und Kommentare auf Deutsch.
