// Monster Combat client logic

const STORAGE_KEY = 'monsterDecks';
let decks = [];
let editingDeck = null;
let editingIndex = null;
let cardsData = [];
let gameState = null;

function cardInfo(card) {
  return `${card.nome} - Potenza ${card.potenza}, Danno ${card.danno}, Abilità: ${card['abilità']}, Clan: ${card.clan}, Bonus: ${card.bonus}, Stelle: ${card.star}`;
}

const views = {};

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  views.menu = document.getElementById('view-menu');
  views.decks = document.getElementById('view-decks');
  views.editor = document.getElementById('view-editor');
  views.select = document.getElementById('view-deckselect');
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
  document.getElementById('btn-cancel-deckselect').addEventListener('click', () => showView('menu'));
  document.getElementById('btn-start-match').addEventListener('click', startMatch);
  document.getElementById('btn-back-menu-game').addEventListener('click', () => showView('menu'));
  document.getElementById('btn-back-settings').addEventListener('click', () => showView('menu'));

  fetch('data/cards.json').then(r => r.json()).then(d => { cardsData = d; });
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
    slot.innerHTML = '';
    const id = editingDeck[i];
    if (id) {
      const card = cardsData.find(c => c.id === id);
      const img = document.createElement('img');
      img.src = 'assets/cards/placeholder.png';
      img.alt = card.nome;
      slot.appendChild(img);
      slot.title = cardInfo(card);
    } else {
      slot.textContent = `Slot ${i+1}`;
      slot.title = '';
    }
    slot.onclick = () => selectCardForSlot(i);
  });
}

function selectCardForSlot(i) {
  const id = prompt(`Inserisci ID carta per slot ${i+1}`);
  if (id) {
    editingDeck[i] = parseInt(id);
    openEditor(editingIndex);
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
  if (decks.length < 2) {
    if (decks.length === 0) {
      alert('Devi creare almeno un mazzo');
      showView('decks');
    } else {
      alert('Servono almeno due mazzi per giocare');
    }
    return;
  }
  populateDeckSelects();
  showView('select');
}

function populateDeckSelects() {
  const sel1 = document.getElementById('select-deck1');
  const sel2 = document.getElementById('select-deck2');
  sel1.innerHTML = '';
  sel2.innerHTML = '';
  decks.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Mazzo ${i + 1}`;
    sel1.appendChild(opt);
    sel2.appendChild(opt.cloneNode(true));
  });
}

function startMatch() {
  const i1 = parseInt(document.getElementById('select-deck1').value);
  const i2 = parseInt(document.getElementById('select-deck2').value);
  initGameWithDecks(decks[i1], decks[i2]);
  showView('game');
}

// hook for real game logic
function initGameWithDecks(deck1, deck2) {
  console.log('Avvio partita con mazzi:', deck1, deck2);
  gameState = {
    round: 1,
    players: [createPlayer(deck1), createPlayer(deck2)]
  };
  renderGame();
}

function createPlayer(deck) {
  return {
    deck: deck.map(id => Object.assign({used:false}, cardsData.find(c => c.id === id))),
    life: 12,
    pillz: 12
  };
}

function renderGame() {
  const area = document.querySelector('.game-area');
  area.innerHTML = '';
  const info = document.createElement('div');
  info.textContent = `Round ${gameState.round} - P1 Vita ${gameState.players[0].life} (Pillz ${gameState.players[0].pillz}) vs P2 Vita ${gameState.players[1].life} (Pillz ${gameState.players[1].pillz})`;
  area.appendChild(info);

  if (gameState.round > 4 || gameState.players[0].life <= 0 || gameState.players[1].life <= 0) {
    const winner = gameState.players[0].life === gameState.players[1].life ? 'Pareggio' : (gameState.players[0].life > gameState.players[1].life ? 'Giocatore 1' : 'Giocatore 2');
    const end = document.createElement('div');
    end.textContent = `Partita finita! Vince: ${winner}`;
    area.appendChild(end);
    return;
  }

  const sel = document.createElement('div');
  sel.className = 'round-select';

  gameState.players.forEach((p, idx) => {
    const col = document.createElement('div');
    col.className = 'player-col';
    const h = document.createElement('h3');
    h.textContent = `Giocatore ${idx + 1}`;
    col.appendChild(h);
    const ul = document.createElement('ul');
    ul.className = 'hand';
    p.deck.forEach((card, i) => {
      if (!card.used) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        const img = document.createElement('img');
        img.src = 'assets/cards/placeholder.png';
        img.alt = card.nome;
        const label = document.createElement('span');
        label.textContent = `${card.nome} (P:${card.potenza} D:${card.danno})`;
        btn.appendChild(img);
        btn.appendChild(label);
        btn.title = cardInfo(card);
        btn.addEventListener('click', () => selectCard(idx, i));
        li.appendChild(btn);
        ul.appendChild(li);
      }
    });
    col.appendChild(ul);
    sel.appendChild(col);
  });

  area.appendChild(sel);
}

function selectCard(playerIndex, cardIndex) {
  const player = gameState.players[playerIndex];
  const maxPillz = player.pillz;
  const pillz = parseInt(prompt(`Pillz da usare (0-${maxPillz})`));
  if (isNaN(pillz) || pillz < 0 || pillz > maxPillz) return;
  player.selected = {index: cardIndex, pillz};
  if (gameState.players.every(p => p.selected)) {
    resolveRound();
  } else {
    renderGame();
  }
}

function resolveRound() {
  const p1 = gameState.players[0];
  const p2 = gameState.players[1];
  const c1 = p1.deck[p1.selected.index];
  const c2 = p2.deck[p2.selected.index];
  const atk1 = c1.potenza * (p1.selected.pillz + 1);
  const atk2 = c2.potenza * (p2.selected.pillz + 1);
  p1.pillz -= p1.selected.pillz;
  p2.pillz -= p2.selected.pillz;

  let winner;
  if (atk1 > atk2) {
    winner = 0;
    p2.life -= c1.danno;
  } else if (atk2 > atk1) {
    winner = 1;
    p1.life -= c2.danno;
  } else {
    winner = Math.random() < 0.5 ? 0 : 1;
    if (winner === 0) p2.life -= c1.danno; else p1.life -= c2.danno;
  }
  c1.used = true;
  c2.used = true;
  delete p1.selected;
  delete p2.selected;
  gameState.round++;
  renderGame();
}
