// app.js

// Views
const views = {
  menu: document.getElementById('view-menu'),
  decks: document.getElementById('view-decks'),
  game: document.getElementById('view-game'),
  settings: document.getElementById('view-settings')
};

// Menu buttons
const btnSingle = document.getElementById('btn-singleplayer');
const btnMulti = document.getElementById('btn-multiplayer');
const btnDecks = document.getElementById('btn-decks');
const btnSettings = document.getElementById('btn-settings');

// Deck manager elements
const decksList = document.getElementById('decks-list');
const btnCreateDeck = document.getElementById('btn-create-deck');
const deckEditor = document.getElementById('deck-editor');
const deckSlots = document.querySelectorAll('#deck-cards li');
const btnSaveDeck = document.getElementById('btn-save-deck');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const btnBackMenu = document.getElementById('btn-back-menu');

// Game back button
const btnBackGame = document.getElementById('btn-back-menu-game');

// Data
let decks = []; // array of decks, each is array of 4 card IDs
let currentDeckIndex = null;
let editingDeck = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDecks();
  bindMenu();
  showView('menu');
});

function bindMenu() {
  btnSingle.addEventListener('click', () => startSingleplayer());
  btnMulti.addEventListener('click', () => alert('Multiplayer in sviluppo'));  
  btnDecks.addEventListener('click', () => showView('decks'));
  btnSettings.addEventListener('click', () => showView('settings'));
  btnBackMenu.addEventListener('click', () => showView('menu'));
  btnBackGame.addEventListener('click', () => showView('menu'));
  btnCreateDeck.addEventListener('click', () => openDeckEditor(null));
  btnSaveDeck.addEventListener('click', saveDeck);
  btnCancelEdit.addEventListener('click', () => openDeckEditor(null));
}

function showView(name) {
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
  if (name === 'decks') renderDeckList();
}

// Decks: load and save
function loadDecks() {
  const data = localStorage.getItem('monsterDecks');
  decks = data ? JSON.parse(data) : [];
}

function saveDecksToStorage() {
  localStorage.setItem('monsterDecks', JSON.stringify(decks));
}

function renderDeckList() {
  decksList.innerHTML = '';
  decks.forEach((deck, idx) => {
    const li = document.createElement('li');
    li.textContent = `Mazzo ${idx + 1}`;
    const btnEdit = document.createElement('button'); btnEdit.textContent = 'Modifica';
    const btnDelete = document.createElement('button'); btnDelete.textContent = 'Elimina';
    btnEdit.addEventListener('click', () => openDeckEditor(idx));
    btnDelete.addEventListener('click', () => { decks.splice(idx,1); saveDecksToStorage(); renderDeckList(); });
    li.append(btnEdit, btnDelete);
    decksList.append(li);
  });
  btnCreateDeck.disabled = decks.length >= 4;
}

function openDeckEditor(idx) {
  deckEditor.classList.toggle('hidden', idx === null);
  document.querySelector('.deck-list').classList.toggle('hidden', idx !== null);
  if (idx === null) {
    editingDeck = [null,null,null,null]; currentDeckIndex = null;
  } else {
    editingDeck = [...decks[idx]]; currentDeckIndex = idx;
  }
  deckSlots.forEach((slot, i) => {
    slot.textContent = editingDeck[i] || `Slot ${i+1}`;
    slot.onclick = () => selectCardForSlot(i);
  });
}

function selectCardForSlot(slotIndex) {
  const cardId = prompt('Inserisci ID carta per slot ' + (slotIndex+1));
  if (cardId) editingDeck[slotIndex] = parseInt(cardId);
  deckSlots[slotIndex].textContent = editingDeck[slotIndex] || `Slot ${slotIndex+1}`;
}

function saveDeck() {
  if (editingDeck.some(id => id == null)) {
    alert('Completa tutti e 4 i slot!'); return;
  }
  if (currentDeckIndex === null) decks.push(editingDeck);
  else decks[currentDeckIndex] = editingDeck;
  saveDecksToStorage();
  openDeckEditor(null);
  renderDeckList();
}

// Singleplayer start
function startSingleplayer() {
  if (decks.length === 0) { alert('Crea almeno un mazzo prima'); return; }
  // per ora prendi il primo mazzo
  const deck = decks[0];
  // salva deck selezionato e poi init game
  selectedDeck = deck;
  // Inizializza il gioco con il mazzo
  initGameWithDeck(deck);
  showView('game');
}

// Placeholder: inserire qui la logica di gioco già scritta (fetch, shuffle, round, ecc.)
function initGameWithDeck(deck) {
  console.log('Inizio partita con mazzo:', deck);
  // TODO: sostituire playerDeck con deck caricato
}

// A questo punto potrai inserire la logica di gioco già pronta per utilizzare il mazzo selezionato

