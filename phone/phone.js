// Funktion zum Aktualisieren der Uhrzeit
function updateTime() {
    const timeElement = document.getElementById('current-time');
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Füge führende Nullen hinzu, wenn Stunden oder Minuten einstellig sind
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Setze die Uhrzeit im HH:MM-Format
    timeElement.innerText = `${hours}:${minutes}`;
}

// Aktualisiere die Uhrzeit jede Minute
setInterval(updateTime, 60000);

// Initialer Aufruf, um die Uhrzeit sofort zu setzen
updateTime();

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

// Funktion zum Hinzufügen einer Benachrichtigung
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
    <div class="notification-content">
      <div class="username" style="font-weight: bold;">${title}</div>
      <div class="event">${message}</div>
    </div>
    <div class="timer-bar" style="background: ${color}; animation: countdown ${duration / 1000}s linear forwards;"></div>
  `;

  container.prepend(div); // Füge das Event oben ein

  // Entferne das älteste Event, wenn das Limit von 8 überschritten wird
  if (container.children.length > 8) {
    container.removeChild(container.children[container.children.length - 1]); // Entferne das älteste Event
  }
}

// Event-Listener für empfangene Events
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  console.log('Empfangenes Event:', listener, data); // Überprüfen der empfangenen Event-Daten

  if (!data || !data.name) {
    console.warn('Eventdaten sind unvollständig:', data);
    return;  // Verhindert das Weiterverarbeiten von unvollständigen Daten
  }

  // Verarbeite den Event-Typ und zeige ihn an
switch (listener) {
    case 'subscriber-latest':
        addNotification('subscriber', `${data.name} hat abonniert!`, '');
        break;
    case 'follower-latest':
        addNotification('follow', `${data.name} folgt jetzt!`, '');
        break;
    case 'tip-latest':
        addNotification('tip', `${data.name} hat ${data.amount} € gespendet!`, '');
        break;
    case 'donation-latest':
        addNotification('donation', `${data.name} hat ${data.amount} € gespendet!`, '');
        break;
    case 'cheer-latest':
        addNotification('cheer', `${data.name} hat ${data.amount} Bits gespendet!`, '');
        break;
    case 'raid-latest':
        addNotification('raid', `Raid von ${data.name}`, `${data.amount} Malteser schauen vorbei!`);
        break;
    default:
        console.warn('Unbekannter Event-Typ:', listener);
        break;
}
});
