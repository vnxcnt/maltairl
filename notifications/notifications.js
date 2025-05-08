const maxVisible = 4;
const duration = 10000;

const typeColors = {
  subscriber: '#4CAF50',
  follow: '#2196F3',
  tip: '#FFC107',
  donation: '#FF5722',
  cheer: '#9C27B0',
  raid: '#00BCD4',
  inventory: '#00E676',
  inventoryToggle: '#8BC34A',
  wantedLevel: '#F44336',
  default: '#FFFFFF'
};

const sounds = {
  subscriber: 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  follow:     'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  tip:        'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_coins.wav',
  donation:   'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_coins.wav',
  cheer:      'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_coins.wav',
  raid:       'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_trumpets.mp3',
  inventory:  'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_pop.mp3',
  inventoryToggle: 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_pop.mp3',
  wantedLevel: 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_police.mp3',
  default:    'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_pop.mp3'
};

const customInventoryItems = [
  "Wasserflasche",
  "Cola",
  "Boxhandschuhe",
  "Equipment",
  "Rucksack",
  "Bilal",
  "iPhone"
];

function playSound(type) {
  const audioUrl = sounds[type] || sounds.default;
  const audioElement = document.createElement('audio');
  audioElement.src = audioUrl;
  audioElement.volume = 0.7;
  audioElement.autoplay = true;
  audioElement.style.display = 'none';
  document.body.appendChild(audioElement);

  audioElement.addEventListener('ended', () => audioElement.remove());
  audioElement.addEventListener('error', (e) => console.warn('Audio-Fehler:', e));
}

function addNotification(type, title, message) {
  const container = document.getElementById('notification-container');
  if (!container) return;
  const color = typeColors[type] || typeColors.default;

  const div = document.createElement('div');
  div.classList.add('notification');
  div.innerHTML = `
    <div class="title">${title}</div>
    <div class="message">${message}</div>
    <div class="timer-bar" style="background: ${color}; animation: countdown ${duration / 1000}s linear forwards;"></div>
  `;

  container.appendChild(div);
  if (container.children.length > maxVisible) {
    container.removeChild(container.children[0]);
  }

  setTimeout(() => div.remove(), duration);
  playSound(type);
}

const previousInventoryCounts = {};
let previousInventoryOpen = null;
let previousWantedLevel = null;

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  console.log('📩 Event empfangen:', listener, data);

  switch (listener) {
    case 'subscriber-latest':
      addNotification('subscriber', `${data.name} hat abonniert!`, 'Willkommen im Team!');
      break;
    case 'follower-latest':
      addNotification('follow', `${data.name} folgt jetzt!`, 'Willkommen auf der Insel!');
      break;
    case 'tip-latest':
      addNotification('tip', `${data.name} hat ${data.amount} € gespendet!`, data.message || '');
      break;
    case 'donation-latest':
      addNotification('donation', `${data.name} hat ${data.amount} € gespendet!`, data.message || 'Du bist nun ein echter Malteser!');
      break;
    case 'cheer-latest':
      addNotification('cheer', `${data.name} hat ${data.amount} Bits gespendet!`, 'Vielen Dank!');
      break;
    case 'raid-latest':
      addNotification('raid', `Raid von ${data.name}`, `${data.amount} Malteser schauen vorbei!`);
      break;

    case 'bot:counter': {
      const rawName = data.counter;
      const name = rawName.toLowerCase();
      const value = parseInt(data.value);

      if (customInventoryItems.map(i => i.toLowerCase()).includes(name)) {
        const old = previousInventoryCounts[rawName];
        const diff = old !== undefined ? value - old : 0;

        const action = diff > 0 ? 'hinzugefügt' : 'entfernt';
        const needsNotification = old === undefined || diff !== 0;

        if (needsNotification) {
          addNotification(
            'inventory',
            `${rawName} ${action}`,
            `${diff > 0 ? '+' : ''}${diff}`
          );
          previousInventoryCounts[rawName] = value;
        }

      } else if (name === 'inventory') {
        const isOpen = value > 0;
        if (previousInventoryOpen === null || previousInventoryOpen !== isOpen) {
          addNotification(
            'inventoryToggle',
            `Inventar ${isOpen ? 'geöffnet' : 'geschlossen'}`,
            isOpen ? 'Du schaust jetzt in deine Tasche.' : 'Inventar wurde geschlossen.'
          );
          previousInventoryOpen = isOpen;
        }

      } else if (name === 'stars') {
        if (previousWantedLevel === null || previousWantedLevel !== value) {
          const change = previousWantedLevel === null
            ? 'gesetzt'
            : value > previousWantedLevel ? 'erhöht' : 'verringert';

          addNotification(
            'wantedLevel',
            `Challange Level ${change}`,
            `Aktuell: ${value} ${value === 1 ? 'Stern' : 'Sterne'}`
          );
          previousWantedLevel = value;
        }
      }
      break;
    }
  }
});
