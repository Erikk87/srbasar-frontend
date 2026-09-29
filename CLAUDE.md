# Hinweise für Claude

Fork von dirkdrutschmann/srbasar-frontend, beim NBBV die **Spielebörse** (https://nbbv-basketball.de/spieleboerse/).
Betrieb und NBBV-eigene Dateien: Abschnitt „NBBV-Betrieb“ oben in der [README](README.md).
Gemeinsame Konventionen für Texte und Design: CLAUDE.md im Repo Erikk87/nbbv-webservices („Einheitlicher Auftritt“).

- Arbeits-Branch ist `dev`, auf `main` nur per PR von `dev` und nur auf ausdrückliche Anweisung.
- Nichts deployt von hier: `deploy-spieleboerse.yml` in nbbv-webservices holt Änderungen alle 15 Minuten ab.
- Seit 2026-09-29 bewusst abweichend vom Original (vom User entschieden): `DesignMvpView.vue` ist NBBV-eigen
  (NBBV-Tokens, Schriftstufen `--mvp-fs-*`, kein Dunkelmodus, kein Ballers Club). Kein Merge von `upstream`;
  neue Funktionen von Dirk gezielt übernehmen (Logik ja, Design nein). Der User schaut selbst nach Neuem.
  Autor- und Lizenzangaben (CC BY-NC 4.0) nie entfernen.
- `src/styles/nbbv.css` und `nbbv-header.css` sind Kopien aus nbbv-webservices `shared/`: dort ändern, hier nachziehen.
- Vor dem Commit `npm test` (Lint, Tests, Build).
- Texte in Du-Form, „Spielebörse“, „Schiedsrichter:innen“, „Team“. Antworten und Kommentare auf Deutsch.
