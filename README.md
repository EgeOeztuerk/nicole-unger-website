# Nicole Unger – Website

Portfolio-Website für Nicole Unger (Schauspiel · Sprechen · Dramaturgie & Lektorat · Drehbücher & Romane).

**Technik:** [Astro 7](https://astro.build) (statisch, TypeScript), Plain CSS mit Design-Tokens, [Decap CMS](https://decapcms.org) unter `/admin`, Content Collections mit Zod-Schemas, Bildoptimierung über `astro:assets`, Kontaktformular über Netlify Forms.
**Datenschutz:** keine Cookies, kein Tracking, Schriften lokal (Fontsource), Videos und Hörproben von Filmmakers nur per Zwei-Klick-Lösung (iframe wird erst nach Klick geladen).

---

## Teil 1 – Lokal starten

### Voraussetzungen

- **Node.js ≥ 22.23.4** (Astro 7). Empfohlen: Node 24 LTS. Mit [nvm](https://github.com/nvm-sh/nvm) genügt im Projektordner:

  ```bash
  nvm install && nvm use
  ```

  (Die Version steht in `.nvmrc`.)

### Installation & Entwicklung

```bash
npm install
npm run dev
```

Die Seite läuft dann unter <http://localhost:4321>.

### CMS lokal testen

```bash
npm run dev:cms
```

Startet Astro **und** den lokalen Decap-Server (`decap-server`). Danach das CMS öffnen:
<http://localhost:4321/admin/index.html> → „Login“ klicken (lokal ohne Passwort).

Änderungen im CMS werden direkt als Dateien in `src/content/…` gespeichert und erscheinen sofort im Dev-Server. Lokal gibt es **keinen** Git-Commit – das machst du selbst.

> Hinweis: Im Dev-Server muss `/admin/index.html` aufgerufen werden; auf Netlify funktioniert auch `/admin/`.

### Weitere Befehle

| Befehl                 | Zweck                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run build`        | Produktions-Build nach `dist/` (kopiert vorher Decap nach `public/admin/vendor`) |
| `npm run preview`      | Build lokal ansehen                                                |
| `npm run check`        | TypeScript- und Astro-Prüfung                                      |
| `npm run placeholders` | Platzhalterbilder/-audios neu erzeugen (`-- --force` überschreibt) |

Das Kontaktformular sendet erst auf Netlify; lokal führt das Absenden ins Leere.

### Projektstruktur

```
public/
  admin/config.yml        Decap-Konfiguration (muss zu src/content.config.ts passen!)
  admin/index.html        CMS-Oberfläche (Decap wird lokal ausgeliefert, kein CDN)
  audio/                  Hörproben (MP3/WAV …)
src/
  content.config.ts       Zod-Schemas aller Inhalte
  content/
    pages/de/*.md         Einzelseiten (Startseite, Schauspiel, Sprechen, …)
    vita/de/*.md          Vita-Einträge (Kino/TV/Theater)
    stations/de/*.md      Stationen (Dramaturgie)
    audio/de/*.md         Hörproben-Einträge
    stories/de/*.md       Drehbücher & Romane
    settings/site.json    Links, Agentur, E-Mail-Adressen
  assets/uploads/         Bilder (werden von Astro optimiert: AVIF/WebP, responsive)
  i18n/                   Sprachen, UI-Texte (ui.ts), URL-Slugs (routes.ts)
  styles/tokens.css       Design-Tokens (Farben, Schriften, Abstände)
  components/ views/ layouts/ pages/
scripts/                  Platzhalter-Generator, Decap-Kopierskript
netlify.toml              Build-Einstellungen, Header
```

### Design anpassen

Alle Farben, Schriften und Abstände stehen als CSS-Variablen in `src/styles/tokens.css` (z. B. `--color-accent` für das Petrol). Schriften: Playfair Display (Headlines) und Inter (Fließtext), lokal über Fontsource eingebunden.

### Mehrsprachigkeit (DE / EN / FR)

Deutsch ist die Standardsprache (ohne Präfix), Englisch und Französisch liegen unter `/en/…` und `/fr/…` mit eigenen Slugs (z. B. `/en/acting/`, `/fr/comedienne/`). Im Kopfbereich wechselt ein Sprach-Button auf dieselbe Seite in der anderen Sprache; `hreflang`-Links sind gesetzt.

- `src/i18n/config.ts` – aktive Sprachen; `src/i18n/ui.ts` – feste UI-Texte je Sprache; `src/i18n/routes.ts` – Slugs je Seite.
- `src/pages/[lang]/[...slug].astro` erzeugt alle EN/FR-Seiten aus denselben Views wie die deutschen Seiten.
- Inhalte: `src/content/pages/{de,en,fr}/*.md`. Listen (`vita`, `stations`, `audio`, `stories`) liegen unter `<sammlung>/<sprache>/`; **fehlt eine Übersetzung, wird automatisch der deutsche Eintrag gezeigt**.
- CMS: „Seiten (Deutsch)“, „Pages (English)“ und „Pages (Français)“ teilen sich die Felder per YAML-Anker; Listen-Sammlungen haben einen Sprachumschalter.

---

## Teil 2 – Deployment auf Netlify

### 1. Repository & Site anlegen

1. Projekt in ein **eigenes** GitHub-Repository pushen (z. B. `nicole-unger-website`).
2. In Netlify: **Add new project → Import an existing project → GitHub** → Repository wählen.
3. Build-Einstellungen kommen automatisch aus `netlify.toml` (Befehl `npm run build`, Ordner `dist`, Node 24). Deploy starten.

### 2. CMS-Login einrichten

**Stand Oktober 2026:** Netlify führt *Git Gateway* als **deprecated** („new Git Gateway configurations are not recommended“). Die frühere Kombination Netlify Identity + Git Gateway sollte für neue Seiten nicht mehr verwendet werden. Empfohlen sind:

#### Variante A (Standard, kostenlos): GitHub-Backend + Netlify als OAuth-Provider

Nicole braucht dafür ein (kostenloses) **GitHub-Konto** mit Schreibrechten auf das Repository.

1. **GitHub OAuth-App anlegen:** <https://github.com/settings/developers> → *OAuth Apps* → *New OAuth App*
   - Homepage URL: die Netlify-/Domain-Adresse der Seite
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
   - Client ID kopieren, *Generate a new client secret* → Secret kopieren (wird nur einmal angezeigt).
2. **In Netlify:** *Project configuration → Security → OAuth → Authentication providers → Install provider* → **GitHub** → Client ID und Secret eintragen.
3. **In `public/admin/config.yml`:** `repo: DEIN-GITHUB-NAME/nicole-unger-website` auf das echte Repository ändern (Branch `main`), committen, pushen.
4. **Nicole einladen:** Repository → *Settings → Collaborators → Add people* → Nicoles GitHub-Konto (Rolle *Write*).
5. Nicole meldet sich unter `https://<domain>/admin/` mit „Login with GitHub“ an.

#### Variante B: Decap Turbo (kein GitHub-Konto für Nicole nötig)

[Decap Turbo](https://decapcms.org/docs/turbo-overview/) ist der offizielle gehostete Login-Dienst der Decap-Macher: Redakteur:innen melden sich mit einem Turbo-Konto (E-Mail) an, Inhalte landen weiterhin als Commits im GitHub-Repo. Kostenlos für 1 Site + 1 Person (Stand Oktober 2026; Pro-Tarif für mehrere Personen kostenpflichtig).

1. Konto anlegen: <https://turbo.decapcms.org/signup>, Site anlegen und mit dem GitHub-Repository verbinden ([Anleitung](https://decapcms.org/docs/turbo-connecting-a-site/)).
2. In `public/admin/config.yml` den `backend`-Block ersetzen (ist dort bereits als Kommentar vorbereitet):

   ```yaml
   backend:
     name: turbo-github
     turbo_site_id: DEINE-TURBO-SITE-ID
   ```

3. Nicole in Turbo als Mitglied einladen.

> Das Turbo-Backend ist im lokal ausgelieferten Decap-Bundle (v3.17) bereits enthalten.

### 3. Kontaktformular & Benachrichtigung

Das Formular `kontakt` (in `src/components/ContactForm.astro`) ist für **Netlify Forms** vorbereitet (`data-netlify`, Honeypot `bot-field`, Datenschutz-Checkbox).

1. Netlify: *Project configuration → Forms* → **Enable form detection** aktivieren und danach **einmal neu deployen** (*Deploys → Trigger deploy*). Danach erscheint das Formular „kontakt“ unter *Forms*.
2. **E-Mail-Benachrichtigung:** *Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification* → Formular „kontakt“ und Zieladresse (z. B. Nicoles private Adresse) wählen.
3. Spamschutz: Honeypot ist aktiv; Netlify filtert zusätzlich automatisch (Spam-Einsendungen landen unter *Forms → Spam*).
4. Nach dem Absenden landet man auf `/kontakt/danke/`.

### 4. Domain & E-Mail-Adressen

1. Netlify: *Domain management → Add a domain* (`nicoleunger.com`, DNS bei Cloudflare, Proxy aus) und DNS beim Domain-Anbieter wie angezeigt setzen. HTTPS wird automatisch aktiviert.
2. Die endgültige Domain eintragen in: `astro.config.mjs` (`site`), `public/admin/config.yml` (`site_url`, `display_url`) und im CMS unter *Einstellungen* (E-Mail-Adressen).
3. **E-Mail:** Nur `info@nicoleunger.com` – Weiterleitung über Cloudflare Email Routing an Nicoles private Adresse. Kontaktformular-Benachrichtigungen gehen per Netlify-Formular-Benachrichtigung ebenfalls an info@.

### Checkliste vor dem Livegang

- [x] Datenschutzerklärung (DE/EN/FR) – Stand November 2026; bei neuen Diensten (z. B. Zoho, Analytics) ergänzen.
- [ ] Impressum/Haftungsausschluss rechtlich prüfen lassen.
- [ ] Echte Hörproben hochladen (Gesang, Bairisch, Hörbuch/Kinderbuch/Trickstimme, Werbung).
- [ ] Alle Platzhalterbilder und -hörproben ersetzen; Vita, Stationen und Stories mit echten Daten füllen.
- [ ] Domain eintragen (siehe oben), Formular-Benachrichtigung testen.

---

## Teil 3 – Anleitung für Nicole

### Anmelden

1. `https://<deine-domain>/admin/` öffnen.
2. **Login** (mit GitHub bzw. Turbo-Konto, je nach Einrichtung).
3. Links siehst du die **Inhaltstypen**. Alles, was du speicherst, ist nach **1–2 Minuten** live (die Seite wird automatisch neu erstellt).

> **Wichtig:** Nach jeder Änderung oben auf **„Veröffentlichen“ → „Jetzt veröffentlichen“** klicken. Erst dann wird gespeichert.

### Texte ändern

*Seiten* → gewünschte Seite (z. B. *Dramaturgie & Lektorat*) → Text im Feld ändern → **Veröffentlichen**.
Längere Texte (Biografie, Profiltext, Impressum) haben einen kleinen Editor mit **fett**, *kursiv* und Links.

### Fotos austauschen

1. Seite öffnen (z. B. *Schauspiel* → *Galerie*), beim Bild auf **„Bild ändern“** klicken → **Hochladen** → Foto auswählen.
2. **Bildbeschreibung (Alternativtext) ausfüllen** – Pflichtfeld. Kurz beschreiben, was zu sehen ist (z. B. „Nicole Unger, Porträt mit Blick in die Kamera“). Das hilft blinden Menschen und Google.
3. Optional: Bildunterschrift / Fotocredit.
4. **Veröffentlichen.**

Tipps: JPG in guter Qualität hochladen, ideal **mind. 2000 px** breit (Titelbilder) bzw. 1200 px (Headshots), max. ca. 5 MB. Die Website verkleinert und optimiert die Bilder automatisch.
Neue Galeriebilder: *Galerie → „Galerie hinzufügen +“*. Reihenfolge ändern: Einträge an den ☰-Griffen ziehen.

### Hörproben

*Hörproben* → **„+ Hörprobe“** (neu) oder bestehende anklicken:

- **Titel**, **Kategorie** (= Tab: Gesang / Bairisch / Hörbuch, Kinderbuch & Trickstimmen / Werbung), **Sprache(n)**
- **Audiodatei** → Datei hochladen (am besten **MP3**, 128–192 kbit/s, kurze Proben bis ca. 2 Minuten)
- **Reihenfolge:** kleinere Zahl = weiter oben
- **Veröffentlichen.** Löschen: Eintrag öffnen → oben „Eintrag löschen“.

Die **Stimmmerkmale** (Stimmlage, Dialekte …) änderst du unter *Seiten → Sprechen*.

### Vita-Einträge (Schauspiel)

*Vita (Schauspiel)* → **„+ Vita-Eintrag“**:
Titel der Produktion, **Bereich** (Kino & Film / Fernsehen / Theater), **Jahr**, optional Rolle, Regie, Produktion/Sender/Bühne → **Veröffentlichen**.
Die Tabelle sortiert sich automatisch (neueste zuerst). Über „Gruppieren nach → Bereich“ behältst du im CMS den Überblick.

Die **Stationen** auf der Dramaturgie-Seite funktionieren genauso (*Stationen (Dramaturgie)*). „Jahr für die Sortierung“ bestimmt die Reihenfolge.

### Leistungspakete & Honorare

*Seiten* → *Dramaturgie & Lektorat* → **Leistungspakete**: Titel, Untertitel, Leistung und Honorar je Paket ändern. Drei Pakete passen am besten ins Layout. Darunter: **Hinweis zu den Honoraren** und der Button-Text.
Die **Referenzleiste** (Telepool | Leonine | …) steht im selben Formular unter *Referenzleiste*.

### Stories (Drehbücher & Romane)

*Stories – Projekte* → **„+ Projekt“**: Titel, Art (z. B. „Roman“), Logline; optional Jahr, Status, Bild (+ Alternativtext), Auszeichnung, Link. **Reihenfolge**: kleinere Zahl = weiter oben.

### Links, Agentur & E-Mail-Adressen

*Einstellungen → Links & Kontaktadressen*:

- **Agentur:** Name, Website, E-Mail und Telefon (erscheinen bei „Buchung & Anfragen“ auf der Schauspiel-Seite, unter Kontakt und im Fußbereich)
- **Profile & Datenbanken:** erscheinen im Menü und im Fußbereich jeder Seite
- **E-Mail-Adressen:** Bereich und Adresse ändern. Den **Schlüssel** (info, lektorat …) bitte nicht umbenennen.

### Videos austauschen

*Seiten → Schauspiel → Videos (Filmmakers)*: pro Video Titel, Sprache und den **Link zum Video auf Filmmakers** eintragen (z. B. `https://www.filmmakers.eu/de/actors/nicole-unger/video/261902`). Das erste Video wird groß angezeigt; Reihenfolge per ☰-Griff ändern. Der Filmmakers-Player wird erst nach Klick der Besucher:innen geladen und läuft direkt auf der Seite. Englische und französische Seite: unter *Pages (English)* bzw. *Pages (Français)* getrennt pflegen.

Das Hörproben-Reel auf der Seite *Sprechen* wird genauso über einen Filmmakers-Audio-Link eingebunden.

### Wenn etwas schiefgeht

- Fehlermeldung „Pflichtfeld“ → rot markiertes Feld ausfüllen.
- Seite zeigt die Änderung nicht → 2 Minuten warten, Seite neu laden.
- Jede Änderung ist im Git-Verlauf gespeichert und kann wiederhergestellt werden – einfach Bescheid geben.
