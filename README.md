# Yoga Peschiera — Guida

## Struttura del progetto

```
yoga-peschiera/
├── index.html            → struttura della pagina
├── css/style.css          → aspetto grafico (colori, font, layout)
├── js/main.js              → logica del sito (non toccare)
├── data/content.json       ★ i contenuti: corsi, news, team, sede, contatti, ordine sezioni
├── admin/                  → il pannello Decap CMS (config.yml + index.html)
└── images/                 → loghi, foto galleria, foto team
```

## Come aggiornare i contenuti A MANO (senza Decap)

Apri `data/content.json` con un editor di testo (consigliato: [VS
Code](https://code.visualstudio.com/), gratuito) e modifica i valori
tra virgolette. È JSON: attenzione a non rompere virgole `,` e
virgolette `"`. Se qualcosa si rompe dopo una modifica, controlla lì
per primo.

**Ordine e visibilità delle sezioni** sono in cima al file, nel blocco
`"sezioni"`: sposta le righe per riordinare, metti `"visibile": false`
per nascondere una sezione senza eliminarla.

## Anteprima locale

Da quando il sito legge `data/content.json`, aprire `index.html` con
doppio click **non funziona più** (il browser blocca il caricamento
del file per sicurezza). Due opzioni:

1. **Più semplice**: pubblica su Netlify (sotto) e guarda sempre la
   versione online — Netlify genera un link di anteprima ad ogni
   modifica, anche prima di renderla definitiva.
2. **Se vuoi testare in locale**: apri il Terminale nella cartella del
   progetto e lancia `python3 -m http.server 8000`, poi vai su
   `http://localhost:8000` nel browser.

---

## Guida: mettere il sito online con Netlify + pannello Decap CMS

Questa parte va fatta una volta sola. Dopo, aggiornerai tutto da
`tuosito.netlify.app/admin` senza toccare file.

### Passo 1 — Crea un account GitHub

1. Vai su [github.com](https://github.com) → **Sign up** (se non hai
   già un account)
2. Crea un nuovo repository: clicca **New repository** (in alto a
   destra, icona "+")
   - Nome: `yoga-peschiera`
   - Lascialo **Public** (va bene, non conterrà dati sensibili)
   - Non aggiungere README/licenza: lascia tutto deselezionato
   - Clicca **Create repository**

### Passo 2 — Carica i file del sito su GitHub

1. Nella pagina del repository appena creato, clicca **uploading an
   existing file**
2. Apri la cartella `yoga-peschiera` sul tuo computer (quella che ti
   ho dato io) e trascina **tutto il contenuto** (non la cartella
   stessa, ma index.html, css/, js/, data/, admin/, images/ ecc.)
   nella pagina del browser
3. Scorri in basso, scrivi un messaggio tipo "Primo caricamento del
   sito" e clicca **Commit changes**

### Passo 3 — Collega Netlify al repository

1. Vai su [netlify.com](https://www.netlify.com) → **Sign up** (puoi
   accedere direttamente con l'account GitHub, più comodo)
2. Nella dashboard, clicca **Add new site** → **Import an existing
   project**
3. Scegli **GitHub**, autorizza l'accesso, e seleziona il repository
   `yoga-peschiera`
4. Le impostazioni di build vanno lasciate vuote/di default (è un
   sito statico, non serve compilare nulla) → clicca **Deploy site**
5. Dopo un minuto avrai un link tipo `nome-a-caso-123.netlify.app` —
   il sito è online. Puoi rinominarlo in **Site settings → Change site
   name** (es. `yoga-peschiera.netlify.app`)

### Passo 4 — Attiva il login per il pannello (Identity + Git Gateway)

1. Nella dashboard del sito su Netlify, vai su **Site configuration →
   Identity** → **Enable Identity**
2. Scorri fino a **Registration preferences** → imposta su **Invite
   only** (così solo chi inviti tu può accedere al pannello)
3. Sempre in Identity, sezione **Services** → **Git Gateway** → **Enable
   Git Gateway** (questo è ciò che permette al pannello di salvare le
   modifiche su GitHub senza che tu debba gestire token/permessi)
4. Torna su **Identity** → tab in alto **Invite users** → inserisci la
   tua email (e quella di chi altro deve poter modificare il sito) →
   invia
5. Controlla la mail: arriverà un invito Netlify → clicca, imposta una
   password

### Passo 5 — Usa il pannello

Vai su `tuosito.netlify.app/admin`, accedi con l'email e la password
appena creata: vedrai il pannello con "Corsi", "News", "Chi siamo",
"Dove", "Contatti" e "Ordine e visibilità delle sezioni", tutto
compilabile con caselle di testo — nessun file da aprire.

Ogni volta che clicchi **Publish** nel pannello, la modifica viene
salvata su GitHub e Netlify aggiorna il sito online in automatico, di
solito in meno di un minuto.

---

## Se in futuro vuoi cambiare qualcosa di strutturale

Il pannello Decap modifica solo `data/content.json` (testi, immagini,
ordine sezioni). La struttura vera — nuove sezioni, layout diverso,
colori, font — resta nei file `index.html` / `css/style.css`, sempre
leggibili e modificabili. Puoi tornare in qualsiasi momento con questi
file (o scaricandoli da GitHub) e si riparte da lì senza perdere nulla
di quello che hai già pubblicato.

## Cosa manca ancora (in `data/content.json`)

- Calendario corsi definitivo (`calendario`, poi metti
  `"calendarioAttivo": true`)
- Indirizzo esatto della sede (`luogo`)
