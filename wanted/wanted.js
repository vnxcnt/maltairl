window.addEventListener('onWidgetLoad', function () {
  SE_API.counters.get('Stars').then(counter => {
    if (typeof counter?.count === 'number') {
      setStars(counter.count);
    }
  }).catch(error => {
    console.warn('❌ Fehler beim Laden des Star-Counters:', error);
  });
});

function setStars(level) {
  const stars = document.querySelectorAll('.star');

  stars.forEach(star => {
    const starLevel = parseInt(star.getAttribute('data-level'));
    if (starLevel <= level) {
      star.src = 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/star.png';
      star.style.display = 'inline';
    } else {
      star.style.display = 'none';
    }
  });
}

// Reagiere auf WantedLevel per Event
window.addEventListener('onEventReceived', function (obj) {
  const listener = obj.detail.listener;
  const data = obj.detail.event;

  if (listener === 'bot:counter' && data.counter?.toLowerCase() === 'stars') {
    const value = parseInt(data.value);
    setStars(value);
  }
});
