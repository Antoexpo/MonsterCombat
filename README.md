# Monster Combat

Clone web in stile Urban Rivals utilizzando asset generati da AI.

## Struttura del progetto

```
assets/
  cards/             # immagini delle carte
  ui/                # icone per i menu e banner
data/
  cards.json         # dati di esempio delle carte
index.html           # pagina principale
style.css            # stile dell'interfaccia
app.js               # logica di base (view e deck manager)
```

## Requisiti

- **Visual Studio Code** con estensione **Live Server** oppure qualsiasi server HTTP capace di servire i file statici.
- Un browser moderno.

## Avvio rapido

1. Clona o scarica il repository.
2. Apri la cartella con VS Code e installa l'estensione *Live Server* se non presente.
3. Clicca con il tasto destro su `index.html` e scegli **Open with Live Server**.
4. Si aprir\u00e0 il browser all'indirizzo fornito dall'estensione e potrai navigare tra le varie viste dell'app.

## Note

Il progetto gestisce la navigazione tramite JavaScript e salva i mazzi nel `localStorage` del browser (massimo 4). La funzione `initGameWithDeck(deck)` \u00e8 pronta per essere collegata alla logica di gioco completa.
