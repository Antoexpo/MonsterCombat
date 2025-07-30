// Monster Combat client logic

const STORAGE_KEY = 'monsterDecks';
let decks = [];
let editingDeck = null;
let editingIndex = null;

const views = {};

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  views.menu = document.getElementById('view-menu');
  views.decks = document.getElementById('view-decks');
  views.editor = document.getElementById('view-editor');
  views.game = document.getElementById('view-game');
  views.settings = document.getElementById('view-settings');

  // buttons
  document.getElementById('btn-singleplayer').addEventListener('click', startSingleplayer);
  document.getElementById('btn-multiplayer').addEventListener('click', () => alert('Modalit\u00e0 multiplayer in sviluppo'));
  document.getElementById('btn-decks').addEventListener('click', () => showView('decks'));
  document.getElementById('btn-settings').addEventListener('click', () => showView('settings'));
  document.getElementById('btn-create-deck').addEventListener('click', () => openEditor(null));
  document.getElementById('btn-save-deck').addEventListener('click', saveDeck);
  document.getElementById('btn-cancel-edit').addEventListener('click', () => { showView('decks'); });
  document.getElementById('btn-back-menu').addEventListener('click', () => showView('menu'));
  document.getElementById('btn-back-menu-game').addEventListener('click', () => showView('menu'));
  document.getElementById('btn-back-settings').addEventListener('click', () => showView('menu'));

  loadDecks();
  renderDeckList();
  showView('menu');
});

function showView(name) {
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
  if (name === 'decks') renderDeckList();
}

function loadDecks() {
  const data = localStorage.getItem(STORAGE_KEY);
  decks = data ? JSON.parse(data) : [];
}

function saveDecks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function renderDeckList() {
  const list = document.getElementById('decks-list');
  list.innerHTML = '';
  decks.forEach((deck, i) => {
    const li = document.createElement('li');
    li.textContent = `Mazzo ${i + 1}`;
    const edit = document.createElement('button');
    edit.textContent = 'Modifica';
    edit.addEventListener('click', () => openEditor(i));
    const del = document.createElement('button');
    del.textContent = 'Elimina';
    del.addEventListener('click', () => { decks.splice(i,1); saveDecks(); renderDeckList(); });
    li.append(edit, del);
    list.appendChild(li);
  });
  document.getElementById('btn-create-deck').disabled = decks.length >= 4;
}

function openEditor(index) {
  showView('editor');
  editingIndex = index;
  editingDeck = index != null ? [...decks[index]] : [null,null,null,null];
  const slots = document.querySelectorAll('#deck-cards li');
  slots.forEach((slot,i) => {
    slot.textContent = editingDeck[i] || `Slot ${i+1}`;
    slot.onclick = () => selectCardForSlot(i);
  });
}

function selectCardForSlot(i) {
  const id = prompt(`Inserisci ID carta per slot ${i+1}`);
  if (id) {
    editingDeck[i] = parseInt(id);
    document.querySelectorAll('#deck-cards li')[i].textContent = editingDeck[i];
  }
}

function saveDeck() {
  if (editingDeck.some(id => id == null)) {
    alert('Completa tutti gli slot prima di salvare');
    return;
  }
  if (editingIndex == null) decks.push(editingDeck);
  else decks[editingIndex] = editingDeck;
  saveDecks();
  showView('decks');
  renderDeckList();
}

function startSingleplayer() {
  if (decks.length === 0) {
    alert('Devi creare almeno un mazzo');
    showView('decks');
    return;
  }
  const deck = decks[0];
  initGameWithDeck(deck);
  showView('game');
}

// hook for real game logic
function initGameWithDeck(deck) {
  console.log('Avvio partita con mazzo:', deck);
}
