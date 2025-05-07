
const maxVisible = 4;
const duration = 10000; // in Millisekunden (10 Sekunden)

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
  tip:        'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  donation:   'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  cheer:      'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  raid:       'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  inventory:  'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  inventoryToggle: 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  wantedLevel: 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  default:    'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3'
};

const customInventoryItems = [
  "Wasserflasche",
  "Cola",
  "Boxhandschuhe",
  "Equipment",
  "Rucksack",
  "iPhone"
];

function playSound(type) {
  console.log('🔊 playSound triggered for:', type);
  const audioUrl = sounds[type] || sounds.default;
  const audioElement = document.createElement('audio');
  audioElement.src = audioUrl;
  audioElement.volume = 0.7;
  audioElement.autoplay = true;
  audioElement.style.display = 'none';
  document.body.appendChild(audioElement);

  audioElement.addEventListener('ended', () => {
    audioElement.remove();
  });

  audioElement.addEventListener('error', (e) => {
    console.warn('Fehler beim Abspielen von Audio:', e);
  });
}

function addNotification(type, title, message) {
  const container = document.getElementById('notification-container');
  if (!container) {
    console.warn('❌ Kein notification-container im DOM gefunden.');
    return;
  }
  console.log('📢 Notification aufgerufen für:', { type, title, message });
  const color = typeColors[type] || typeColors.default;

  const div = document.createElement('div');
  div.classList.add('notification');
  div.innerHTML = `
    <div class="title">${title}</div>
    <div class="message">${message}</div>
    <div class="timer-bar" style="background: ${color}; animation: countdown ${duration / 1000}s linear forwards;"></div>
  `;

  container.appendChild(div);
  if (!container) {
    console.warn('❌ Kein notification-container gefunden!');
  }

  if (container.children.length > maxVisible) {
    container.removeChild(container.children[0]);
  }

  setTimeout(() => {
    div.remove();
  }, duration);

  playSound(type);
}

let previousInventoryCounts = {};
let previousInventoryOpen = null;

async function checkInventoryToggle() {
  try {
    const inventoryStatus = await SE_API.counters.get('Inventory');
    if (typeof inventoryStatus?.count !== 'number') return;

    const isOpen = inventoryStatus.count > 0;
    if (previousInventoryOpen === null) {
      previousInventoryOpen = isOpen;
      return;
    }

    if (isOpen !== previousInventoryOpen) {
      previousInventoryOpen = isOpen;
      addNotification(
        'inventoryToggle',
        `Inventar ${isOpen ? 'geöffnet' : 'geschlossen'}`,
        isOpen ? 'Du schaust jetzt in deine Tasche.' : 'Inventar wurde geschlossen.'
      );
    }
  } catch (e) {
    console.warn('❌ Fehler beim Prüfen des Inventory-Zustands:', e);
  }
}

let previousWantedLevel = null;

async function checkWantedLevel() {
  try {
    const starsStatus = await SE_API.counters.get('Stars');
    if (typeof starsStatus?.count !== 'number') return;

    const currentLevel = starsStatus.count;
    if (previousWantedLevel === null) {
      previousWantedLevel = currentLevel;
      return;
    }

    if (currentLevel !== previousWantedLevel) {
      const change = currentLevel > previousWantedLevel ? 'erhöht' : 'verringert';

      addNotification(
        'wantedLevel',
        `Challange Level ${change}`,
        `Aktuell: ${currentLevel} ${currentLevel === 1 ? 'Stern' : 'Sterne'}`
      );

      previousWantedLevel = currentLevel;
    }
  } catch (e) {
    console.warn('❌ Fehler beim Prüfen des Wanted-Levels:', e);
  }
}

async function checkInventoryUpdates() {
  for (const itemName of customInventoryItems) {
    try {
      const counter = await SE_API.counters.get(itemName);
            if (typeof counter?.count !== 'number') {
        console.warn(`⚠️ Ungültiger Wert für '${itemName}':`, counter);
        continue;
      }

      const newCount = parseInt(counter.count);

      if (!(itemName in previousInventoryCounts)) {
        previousInventoryCounts[itemName] = newCount;
        await SE_API.store.set(itemName, { value: newCount });

        continue;
      }

      const oldCount = previousInventoryCounts[itemName];

      if (newCount !== oldCount) {
        const action = newCount > oldCount ? 'added' : 'removed';
        const diff = Math.abs(newCount - oldCount);

        addNotification(
          'inventory',
          `${itemName} ${action === 'added' ? 'hinzugefügt' : 'entfernt'}`,
          `${action === 'added' ? '+' : '-'}${diff}`
        );

        previousInventoryCounts[itemName] = newCount;
      }
    } catch (e) {
      console.warn(`❌ Fehler beim Verarbeiten von '${itemName}':`, e);
    }
  }

  }

window.addEventListener('onWidgetLoad', async function (obj) {
  const data = obj.detail;
  
  // 🟡 Initiale Counter-Stände speichern und anzeigen
  for (const itemName of customInventoryItems) {
    try {
      const counter = await SE_API.counters.get(itemName);
      if (typeof counter?.value !== 'number') {
        console.warn(`⚠️ Ungültiger Startwert für '${itemName}':`, counter);
        continue;
      }

      const initialValue = parseInt(counter.value);
      previousInventoryCounts[itemName] = initialValue;
      await SE_API.store.set(itemName, { value: initialValue });
          } catch (e) {
      console.warn(`❌ Fehler beim Initialisieren von '${itemName}':`, e);
    }
  }

  setInterval(() => {
    checkInventoryUpdates();
    checkInventoryToggle();
    checkWantedLevel();
}, 5000);
});

window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

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

  }
});
