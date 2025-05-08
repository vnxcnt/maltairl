const phoneBackgroundImages = {
  0: 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/phone_background01.png',
  1: 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/phone_background02.png',
  2: 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/phone_background03.png',
  3: 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/phone_background04.png',
  4: 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/phone_background05.png'
};

function setPhoneBackground(value) {
  const bg = document.getElementById('phone-background');
  if (!bg) return;
  const url = phoneBackgroundImages[value];
  if (url) {
    bg.style.backgroundImage = `url('${url}')`;
  } else {
    console.warn('🔁 Kein gültiges Hintergrundbild für:', value);
  }
}

let weatherInterval;

window.addEventListener('onWidgetLoad', async function (obj) {
  const fieldData = obj.detail.fieldData;
  const apiKey = fieldData.weatherApiKey;
  const city = fieldData.weatherCity || 'Berlin';
  const unit = 'metric';

  // ⛅ Wetter initial abrufen
  if (!apiKey) {
    document.getElementById('weather-info').innerText = '⚠️ Kein API-Key';
    return;
  }

  fetchWeather(apiKey, city, unit);
  weatherInterval = setInterval(() => {
    fetchWeather(apiKey, city, unit);
  }, 800000); // alle 10 Minuten

  // 📱 PhoneBackground-Counter initial abrufen
  try {
    const bgCounter = await SE_API.counters.get('PhoneBackground');
    const value = parseInt(bgCounter?.count);
    if (!isNaN(value)) {
      setPhoneBackground(value);
    }
  } catch (e) {
    console.warn('❌ Fehler beim Abrufen von PhoneBackground:', e);
  }

  // 📞 Phone-Counter initial abrufen
  try {
    const phoneCounter = await SE_API.counters.get('Phone');
    const phoneValue = parseInt(phoneCounter?.count);
    const phone = document.getElementById('phone');

    if (phone && !isNaN(phoneValue)) {
      phone.classList.remove('phone-hidden', 'phone-minimized', 'phone-full');
      switch (phoneValue) {
        case 0:
          phone.classList.add('phone-hidden');
          break;
        case 1:
          phone.classList.add('phone-minimized');
          break;
        case 2:
          phone.classList.add('phone-full');
          break;
        default:
          console.warn('❓ Unbekannter Phone-Zustand beim Start:', phoneValue);
      }
    }
  } catch (e) {
    console.warn('❌ Fehler beim Abrufen des Phone-Counters:', e);
  }

  // 👥 Social Stats initial setzen
  try {
    const sessionData = obj.detail.session?.data || {};

    const followerEl = document.getElementById('latest-follower');
    if (followerEl) {
      followerEl.innerText = sessionData["follower-latest"]?.name || '–';
    }

    const subEl = document.getElementById('latest-sub');
    if (subEl) {
      subEl.innerText = sessionData["subscriber-latest"]?.name || '–';
    }

    const tipEl = document.getElementById('latest-donator');
    if (tipEl) {
      const tipName = sessionData["tip-latest"]?.name || '–';
      const tipAmount = sessionData["tip-latest"]?.amount
        ? parseFloat(sessionData["tip-latest"].amount).toFixed(2) + '€'
        : '';
      tipEl.innerText = `${tipName} ${tipAmount}`;
    }
  } catch (e) {
    console.warn('❌ Fehler beim Initialisieren der Social Stats:', e);
  }
});

function fetchWeather(apiKey, city, unit) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}&lang=de`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data || data.cod !== 200) {
        document.getElementById('weather-info').innerText = '⚠️ Wetter nicht verfügbar';
        return;
      }

      const temp = Math.round(data.main.temp);
      const weather = data.weather[0].main.toLowerCase();
      const icon = getWeatherIcon(weather);
      const location = data.name;

      document.getElementById('weather-city').innerText = location;
      document.getElementById('weather-temp').innerText = `${temp}°C`;
      document.getElementById('weather-icon').innerText = `${icon}`;
    })
    .catch(err => {
      console.warn('Wetter-API-Fehler:', err);
      document.getElementById('weather-info').innerText = '⚠️ Fehler beim Laden';
    });
}

function getWeatherIcon(condition) {
  if (condition.includes('cloud')) return '☁️';
  if (condition.includes('rain')) return '🌧️';
  if (condition.includes('storm')) return '⛈️';
  if (condition.includes('snow')) return '❄️';
  if (condition.includes('clear')) return '☀️';
  return '🌡️';
}

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

  // Log zum Debuggen
  console.log('📩 Event empfangen:', listener, data);

  // 📱 Phone Sichtbarkeit per Counter
  if (listener === 'bot:counter' && data.counter === 'Phone') {
    console.log('📲 Phone-Counter Event empfangen:', data.value);
    const phone = document.getElementById('phone');
    if (phone) {
      phone.classList.remove('phone-hidden', 'phone-minimized', 'phone-full');

      const phoneSound = document.getElementById('phone-sound');
      if (phoneSound) {
        phoneSound.currentTime = 0;
        phoneSound.play().catch(err => console.warn('🔇 Kann Sound nicht abspielen:', err));
      }

      switch (parseInt(data.value)) {
        case 0: phone.classList.add('phone-hidden'); break;
        case 1: phone.classList.add('phone-minimized'); break;
        case 2: phone.classList.add('phone-full'); break;
        default: console.warn('❓ Unbekannter Phone-Zustand:', data.value);
      }
    }
    return;
  }

  // 🎨 Hintergrundwechsel per Counter
  if (listener === 'bot:counter' && data.counter === 'PhoneBackground') {
    const value = parseInt(data.value);
    if (!isNaN(value)) {
      setPhoneBackground(value); // Funktion muss separat definiert sein
    }
  }

  // 💬 Chatnachricht anzeigen
  if (listener === 'message') {
    const messageData = data.data;
    let platform = data?.platform || 'twitch';
    let sender = '', message = '';
    let badges = messageData.badges || [];

    if (platform === 'twitch') {
      sender = messageData.displayName || messageData.nick;
      message = messageData.text;
    } else if (platform === 'youtube') {
      sender = messageData.displayName || messageData.nick;
      message = messageData.text || messageData.snippet?.textMessageDetails?.messageText || '';
    }

    showChatPopup(sender, message, badges); // Funktion muss separat definiert sein
    return;
  }

  // 🧍‍♂️ Follower → Social Stats Widget
  if (listener === 'follower-latest') {
    const el = document.getElementById('latest-follower');
    if (el) el.innerText = data.name || '–';
  }

  // 🌟 Subscriber → Social Stats Widget
  if (listener === 'subscriber-latest') {
    const el = document.getElementById('latest-sub');
    if (el) el.innerText = data.name || '–';
  }

  // 💸 Donator → Social Stats Widget
  if (listener === 'tip-latest') {
    const name = data.name || '–';
    const amount = data.amount ? parseFloat(data.amount).toFixed(2) + '€' : '';
    const el = document.getElementById('latest-donator');
    if (el) el.innerText = `${name} ${amount}`;
  }

  // 🔔 Andere Notification-Typen mit Namen
  if (!data || !data.name) return;

  let title = '', message = '', type = '';

  switch (listener) {
    case 'subscriber-latest':
    case 'follower-latest':
      const isSub = listener === 'subscriber-latest';
      const platform = data?.platform || 'twitch';
      const color = platform === 'youtube' ? '#FF0000' : '#9146FF';

      const nameHTML = `<span style="color: ${color}; font-weight: bold;">${data.name}</span>`;
      type = isSub ? 'subscriber' : 'follow';
      title = nameHTML;
      message = isSub
        ? `hat auf ${platform === 'youtube' ? 'YouTube' : 'Twitch'} abonniert!`
        : `folgt auf ${platform === 'youtube' ? 'YouTube' : 'Twitch'}!`;
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

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showChatPopup(sender, message, badges = []) {
  const popup = document.getElementById('chat-popup');
  if (!popup) return;

  const badgeHTML = badges.map(b => `<img src="${b.url}" alt="${b.type}" class="chat-badge">`).join('');

  popup.innerHTML = `
    <span class="sender">${badgeHTML}<span>${sender}</span></span>
    <span class="message">${message}</span>
  `;

  popup.classList.add('show');
  popup.classList.remove('hidden');

  clearTimeout(popup._hideTimer);
  popup._hideTimer = setTimeout(() => {
    popup.classList.remove('show');
    popup.classList.add('hidden');
  }, 5000);
}

// 🟢 Lade vorhandene Benachrichtigungen beim Start
loadStoredNotifications();
