// 🕒 Uhrzeit-Update
function updateTime() {
  const timeElement = document.getElementById('current-time');
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  timeElement.innerText = `${hours}:${minutes}`;
}
setInterval(updateTime, 60000);
updateTime();

const maxVisible = 8;
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

// 📦 Holt gespeicherte Events und zeigt sie an
function loadStoredNotifications() {
  const stored = localStorage.getItem('notifications');
  if (!stored) return;

  const notifications = JSON.parse(stored);
  notifications.forEach(n => {
    renderNotification(n.type, n.title, n.message);
  });
}

// 💾 Speichert alle aktuellen Events im localStorage
function storeNotifications() {
  const container = document.getElementById('notification-container');
  const items = Array.from(container.children).map(el => {
    const type = el.dataset.type;
    const title = el.querySelector('.username')?.innerText || '';
    const message = el.querySelector('.event')?.innerText || '';
    return { type, title, message };
  });

  localStorage.setItem('notifications', JSON.stringify(items));
}

// 🔔 Fügt ein Event visuell ein
function renderNotification(type, title, message) {
  const container = document.getElementById('notification-container');
  const color = typeColors[type] || typeColors.default;

  const div = document.createElement('div');
  div.classList.add('notification');
  div.dataset.type = type;

div.innerHTML = `
  <div class="notification-content">
    <div class="notification-line">${title} ${message}</div>
  </div>
  <div class="timer-bar" style="background: ${color}; animation: countdown ${duration / 1000}s linear forwards;"></div>
`;

  container.prepend(div);

  // Entferne älteste, wenn mehr als erlaubt
  if (container.children.length > maxVisible) {
    container.removeChild(container.children[container.children.length - 1]);
  }
}

// ➕ Erstellt eine neue Notification und speichert sie
function addNotification(type, title, message) {
  renderNotification(type, title, message);
  storeNotifications(); // nach jedem neuen Event speichern
}

// 📡 Reagiere auf empfangene Events
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  if (!data || !data.name) return;

  let title = '', message = '', type = '';

switch (listener) {
  case 'subscriber-latest':
  case 'follower-latest':
    const isSub = listener === 'subscriber-latest';
    const platform = data?.platform || 'twitch'; // Fallback zu Twitch
    const color = platform === 'youtube' ? '#FF0000' : '#9146FF'; // YouTube-Rot oder Twitch-Lila

    const nameHTML = `<span style="color: ${color}; font-weight: bold;">${data.name}</span>`;
    type = isSub ? 'subscriber' : 'follow';
    title = nameHTML;
    message = isSub
      ? `hat dich auf ${platform === 'youtube' ? 'YouTube' : 'Twitch'} abonniert!`
      : `folgt dir jetzt auf ${platform === 'youtube' ? 'YouTube' : 'Twitch'}!`;
    break;

  case 'tip-latest':
  case 'donation-latest':
    type = 'tip';
    title = `${data.name} hat ${data.amount || ''} € gespendet!`;
    message = '';
    break;

  case 'cheer-latest':
    type = 'cheer';
    title = `${data.name} hat ${data.amount || ''} Bits gespendet!`;
    message = '';
    break;

  case 'raid-latest':
    type = 'raid';
    title = `Raid von ${data.name}`;
    message = `${data.amount || ''} Malteser schauen vorbei!`;
    break;

  default:
    console.warn('🟡 Unbekannter Event-Typ:', listener);
    return;
  }
  addNotification(type, title, message);
});

// 🟢 Lade vorhandene Benachrichtigungen beim Start
loadStoredNotifications();
