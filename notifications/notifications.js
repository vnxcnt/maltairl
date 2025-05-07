const container = document.getElementById('notification-container');
const maxVisible = 4;
const duration = 10000; // in Millisekunden (10 Sekunden)

const typeColors = {
  subscriber: '#4CAF50',
  follow: '#2196F3',
  tip: '#FFC107',
  donation: '#FF5722',
  cheer: '#9C27B0',
  raid: '#00BCD4',
  default: '#FFFFFF'
};

const sounds = {
  subscriber: 'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  follow:     'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  tip:        'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  donation:   'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  cheer:      'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  raid:       'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3',
  default:    'https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_default.mp3'
};

// ✅ DOM-basiertes Audio für Kompatibilität mit StreamElements
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

  setTimeout(() => {
    div.remove();
  }, duration);

  playSound(type);
}

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
