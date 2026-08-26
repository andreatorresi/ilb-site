# Deploy — Aggiornamento landing Interrogalabolletta

**Data pacchetto:** 26 agosto 2026
**Repo target:** `andreatorresi/ilb-site` (branch `main`)
**Deploy automatico:** Cloudflare Pages (progetto `interrogalabolletta`) tramite webhook GitHub

---

## Cosa contiene il pacchetto

```
output/
├── index.html                                    (MODIFICATO — sostituisce quello esistente)
├── privacy.html                                  (NUOVO)
├── cookie.html                                   (NUOVO)
├── termini.html                                  (NUOVO)
├── cookie-banner.js                              (NUOVO)
├── robots.txt                                    (NUOVO)
├── sitemap.xml                                   (NUOVO)
├── README-DEPLOY.md                              (questo file)
└── assets/
    ├── Metodo_Lockup_Ponte_Bianco.png            (NUOVO — usato nel footer)
    ├── Metodo_Lockup_Ponte_Bianco.svg            (NUOVO — riserva)
    ├── Metodo_Lockup_Ponte_Colore.png            (NUOVO — riserva per contesti chiari)
    ├── Metodo_Lockup_Ponte_Colore.svg            (NUOVO — riserva)
    ├── Metodo_Lockup_Ponte_Nero.png              (NUOVO — riserva stampa)
    └── Metodo_Lockup_Ponte_Nero.svg              (NUOVO — riserva)
```

---

## Riepilogo modifiche

### File nuovi (7)

1. **`privacy.html`** — Informativa privacy completa conforme artt. 13-14 GDPR, con contitolarità art. 26 GDPR, base giuridiche per finalità, periodi di conservazione, diritti, RPD non nominato con motivazione.
2. **`cookie.html`** — Cookie Policy conforme Provv. Garante 231/2021, elenco cookie per categoria, gestione consenso.
3. **`termini.html`** — Termini di servizio B2B con: definizioni, oggetto, trasparenza cross-sell, limitazioni responsabilità, IP, foro di Macerata, clausole vessatorie ex artt. 1341-1342 c.c.
4. **`cookie-banner.js`** — Cookie banner conforme (accetta/rifiuta/personalizza, "X" = rifiuto, re-prompt automatico dopo 6 mesi).
5. **`robots.txt`** — indicizzazione consentita ai motori di ricerca, blocco esplicito scraper AI.
6. **`sitemap.xml`** — 4 URL indicizzabili (home + 3 legali).
7. **`assets/Metodo_Lockup_*.png/svg`** — lockup ponte Torresi & Associati (6 file, 3 varianti cromatiche).

### File modificati (1)

**`index.html`** — modifiche mirate:

- `<head>`: aggiunto `<link rel="canonical">`, favicon references (SVG + 32px + apple-touch-icon), meta `og:image` con dimensioni.
- **Schema.org**: aggiornato da provider singolo a array con doppia titolarità (Gruppo Energia + Torresi & Associati) con `taxID`, indirizzo, telefono.
- **Sezione "Chi firma il check"**: rimosso "(ProFiscal)" dalla descrizione di Andrea Torresi, sostituito "Titolare di" con "Amministratore Unico di" (formalmente corretto per S.r.l.).
- **Nuova sezione VOCE 02.C "Bolletta Perfetta"**: inserita tra "Cosa controlliamo" e "L'offerta". Copre il tema 96 prezzi/quarto d'ora (MTU15) allineando la messaggistica ai flyer. Include riferimento normativo Reg. UE 2019/943 + delibera ARERA 353/2024. Anchor `#bolletta-perfetta`.
- **FAQ "Mi cambiate il fornitore?"**: risposta completamente riscritta con trasparenza cross-sell coerente col posizionamento reale. Ora dice apertamente che Gruppo Energia è anche venditore ma l'analisi resta indipendente e la proposta commerciale è separata e opzionale.
- **Sezione FAQ**: aggiunto `id="faq"` per anchor link.
- **Footer completo**: sostituito con versione a 4 colonne:
  - Col 1: descrizione + menzione contitolarità art. 26 + immagine lockup Torresi bianco (max 220px, opacity 0.85)
  - Col 2: link servizio (aggiunto link FAQ)
  - Col 3: link legali (aggiunto "Preferenze cookie" con richiamo `window.ilbReopenConsent()`)
  - Col 4: contatti + dati identificativi completi Torresi (sede, REA, PEC) + P.IVA Operations
- **Cookie banner script**: aggiunto `<script src="/cookie-banner.js" defer>` in fondo al footer.

---

## Procedura deploy (via GitHub web UI)

Se non hai Git installato o preferisci la via veloce da browser:

### Step 1 — Backup (opzionale ma raccomandato)

Su GitHub, vai su `andreatorresi/ilb-site`, apri l'`index.html` attuale, clicca sul menu `...` in alto a destra → **View raw** → Ctrl+S per salvare localmente una copia. Ora se qualcosa va storto puoi ripristinare.

### Step 2 — Sostituzione index.html

1. Sul repo GitHub, apri `index.html` esistente.
2. Clicca sull'icona **matita (Edit this file)** in alto a destra.
3. **Seleziona tutto il contenuto** (Ctrl+A) e cancellalo.
4. **Incolla** il contenuto del nuovo `index.html` (da questo pacchetto).
5. Scorri in fondo alla pagina → sezione **Commit changes**:
   - Commit message: `Aggiornamento landing: footer completo, sezione Bolletta Perfetta, trasparenza cross-sell, cookie banner, brand identity Torresi`
   - Descrizione (opzionale): riassunto delle modifiche
   - Selezione: **Commit directly to the main branch**
6. Clicca **Commit changes**.

### Step 3 — Upload nuovi file

1. Nella root del repo GitHub, clicca **Add file** → **Upload files**.
2. Trascina in un colpo solo TUTTI questi file dalla cartella `output/`:
   - `privacy.html`
   - `cookie.html`
   - `termini.html`
   - `cookie-banner.js`
   - `robots.txt`
   - `sitemap.xml`
3. Commit message: `Aggiunta pagine legali (privacy, cookie, termini), cookie banner, robots, sitemap`
4. Clicca **Commit changes**.

### Step 4 — Upload cartella assets/

1. Nella root del repo, clicca **Add file** → **Create new file**.
2. Nella barra del nome file scrivi: `assets/README.md` (questo crea la cartella).
3. Metti come contenuto: `# Assets grafici`
4. Commit.
5. Ora la cartella `/assets/` esiste. Aprila.
6. Clicca **Add file** → **Upload files** e trascina TUTTI i 6 file dalla cartella `output/assets/`:
   - `Metodo_Lockup_Ponte_Bianco.png` (usato nel footer)
   - `Metodo_Lockup_Ponte_Bianco.svg`
   - `Metodo_Lockup_Ponte_Colore.png`
   - `Metodo_Lockup_Ponte_Colore.svg`
   - `Metodo_Lockup_Ponte_Nero.png`
   - `Metodo_Lockup_Ponte_Nero.svg`
7. Commit message: `Assets grafici: lockup ponte Torresi & Associati`

### Step 5 — Attendi deploy automatico

Cloudflare Pages rileva il commit su `main` in circa 30-60 secondi e avvia il build. Puoi monitorare in:
- Dashboard Cloudflare → **Workers & Pages** → **interrogalabolletta** → tab **Deployments** → vedrai un deployment nuovo in stato "Building" → poi "Success"
- Tempo totale medio: 2-4 minuti dal commit alla live.

### Step 6 — Verifica in produzione (in incognito)

Apri Chrome/Edge in incognito (Ctrl+Shift+N per bypassare cache):

**Test funzionali:**
1. https://interrogalabolletta.it → homepage caricata correttamente, layout coerente
2. **Cookie banner appare** in basso al primo caricamento
3. **Nuova sezione "Bolletta Perfetta"** visibile tra "Cosa controlliamo" e "L'offerta"
4. Footer completo con logo Torresi (immagine bianca a sinistra) + P.IVA doppia + contatti + preferenze cookie
5. Click su "Privacy Policy" nel footer → carica `privacy.html` (NON più homepage)
6. Click su "Cookie Policy" → carica `cookie.html`
7. Click su "Termini di servizio" → carica `termini.html`
8. Click su "Preferenze cookie" nel footer → riapre il banner
9. Chiudi il banner con la X → salva scelta "rifiuto" (verifica in DevTools → Application → Local Storage → `ilb_consent`)
10. Test FAQ "Mi cambiate il fornitore?" → risposta nuova con trasparenza cross-sell

**Test tecnici:**
11. https://interrogalabolletta.it/robots.txt → mostra il file
12. https://interrogalabolletta.it/sitemap.xml → mostra XML
13. DevTools → tab Console → nessun errore rosso
14. DevTools → tab Network → verifica che `cookie-banner.js` carichi con 200 OK
15. DevTools → tab Elements → cerca `<link rel="canonical">` presente
16. Mobile responsive: DevTools → toggle device toolbar → verifica su iPhone/Android

---

## Note tecniche importanti

### Favicon mancante
Il file `index.html` ora dichiara favicon in 3 formati (SVG, PNG 32px, apple-touch-icon 180px) che **non sono ancora nel repo**. Il sito funziona lo stesso ma il browser mostra un warning 404 nella console per la favicon. Da produrre in seconda battuta (compito grafico o generatore automatico tipo realfavicongenerator.net).

Riferimenti nel codice:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
```

### og:image mancante
Analogo per l'immagine social preview: dichiarata `/assets/og-cover.png` ma non ancora prodotta. Chiedere al grafico un'immagine 1200×630 con logo e claim.

Riferimento:
```html
<meta property="og:image" content="https://interrogalabolletta.it/assets/og-cover.png" />
```

### Sede legale Operations S.r.l.
Nella Privacy Policy la sede legale Operations è marcata `[in aggiornamento]`. Da chiedere a Giacomo/Denis e aggiornare `privacy.html` righe 138-143.

### Email privacy@interrogalabolletta.it
Nelle pagine legali è indicato l'indirizzo `privacy@interrogalabolletta.it` che al momento non esiste (Email Routing ancora da ricostruire sul nuovo Cloudflare). Da attivare quando ricostruisci Email Routing. Nel frattempo un'eventuale email a quell'indirizzo bouncerà.

### Cookie banner — nessun cookie non tecnico attivo
Il sito attualmente non usa Google Analytics, Meta Pixel o simili. Il cookie banner registra la scelta dell'utente ma non esegue nessun caricamento condizionale. Quando in futuro introdurrai analytics, l'hook è già pronto: le scelte utente sono in `window.ilbConsent` e viene emesso l'evento `ilb:consent`. Basta ascoltare l'evento e attivare gli script condizionalmente.

Esempio integrazione futura Google Analytics:
```javascript
document.addEventListener('ilb:consent', (e) => {
  if (e.detail.analytics) {
    // carica GA solo se acconsentito
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX';
    document.head.appendChild(s);
    // ...
  }
});
```

---

## Prossimi step consigliati (fuori scope pacchetto)

1. **Favicon** (produzione grafica o generatore automatico)
2. **og:image** 1200×630 (produzione grafica)
3. **Sede Operations S.r.l.** da recuperare e inserire in privacy.html
4. **Email Routing Cloudflare** da ricostruire per attivare `info@` e `privacy@`
5. **Google Search Console**: submit del sito + sitemap dopo verifica proprietà
6. **DPIA** al superamento primo lotto significativo di lead (500+)
7. **Contratti art. 28 GDPR** verso responsabili esterni (Cloudflare, n8n, Resend, fornitori tecnici Gruppo Energia)
8. **Redirect Rule Cloudflare .com → .it** quando la propagazione .com è completata

---

Fine README.
