// Sichtbarkeit toggeln
function toggleScoreboard(show) {
  const sb = document.getElementById('scoreboard');
  if (!sb) return;

  if (show) {
    sb.classList.add('visible');
    sb.classList.remove('hidden');
  } else {
    sb.classList.add('hidden');
    sb.classList.remove('visible');
  }
}

// Punktestand aktualisieren
function updateScore(team, value) {
  const el = document.getElementById(`score-${team}`);
  if (!el) return;

  if (el.innerText != value) {
    el.classList.add('score-pop');
    setTimeout(() => el.classList.remove('score-pop'), 300);
  }

  el.innerText = value;
}

// Initiale API-Abfrage (einmalig beim Start)
async function initializeScoreboard() {
  try {
    const [scoreboard, team1, team2] = await Promise.all([
      SE_API.counters.get('Scoreboard'),
      SE_API.counters.get('Team1'),
      SE_API.counters.get('Team2')
    ]);

    toggleScoreboard(scoreboard?.count > 0);
    updateScore('a', team1?.count ?? 0);
    updateScore('b', team2?.count ?? 0);
  } catch (err) {
    console.warn('❌ Fehler bei Initialisierung:', err);
  }
}

// Bot-Counter Event Listener
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  if (listener === 'bot:counter') {
    switch (data.counter) {
      case 'Scoreboard':
        toggleScoreboard(data.value > 0);
        break;
      case 'Team1':
        updateScore('a', data.value);
        break;
      case 'Team2':
        updateScore('b', data.value);
        break;
    }
  }
});

// Initiale Abfrage starten
initializeScoreboard();
