// Funktion zum Abrufen des Counters und Aktualisieren der Sterne
function updateStars() {
  SE_API.counters.get('Stars').then(counter => {
    const stars = counter.count;
    setStars(stars);
  }).catch(error => {
    console.error('Fehler beim Abrufen des Counters:', error);
  });
}

// Funktion zum Setzen der Sterne basierend auf dem Wert des Counters
function setStars(level) {
  const stars = document.querySelectorAll('.star');

  stars.forEach(star => {
    const starLevel = parseInt(star.getAttribute('data-level'));

    if (starLevel <= level) {
      // Zeige einen "gefüllten" Stern an
      star.src = 'https://raw.githubusercontent.com/vnxcnt/maltairl/refs/heads/main/images/star.png'; // gefüllter Stern
      star.style.display = 'inline'; // Stelle sicher, dass der Stern sichtbar ist
    } else {
      // Wenn der Stern leer ist, verstecke ihn
      star.style.display = 'none'; // Der leere Stern wird nicht angezeigt
    }
  });
}

// Initiale Ausführung
updateStars();

// Alle 5 Sekunden den Stand des Counters abrufen und die Sterne aktualisieren
setInterval(updateStars, 5000);
