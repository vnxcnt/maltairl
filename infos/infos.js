// 🔊 Link zum Info-Sound
const infoBannerSound = "https://cdn.jsdelivr.net/gh/vnxcnt/maltairl/sound/notification_positive.mp3";

// 🔊 Soundfunktion für Info-Banner
function playInfoSound() {
  const audioElement = document.createElement('audio');
  audioElement.src = infoBannerSound;
  audioElement.volume = 0.7;
  audioElement.autoplay = true;
  audioElement.style.display = 'none';
  document.body.appendChild(audioElement);

  audioElement.addEventListener('ended', () => {
    audioElement.remove();
  });

  audioElement.addEventListener('error', (e) => {
    console.warn('❌ Fehler beim Info-Sound:', e);
  });
}

// 🧾 Zufällige Info-Nachricht anzeigen
function showInfoBanner(message, duration = 8000, color = "#2196F3") {
  playInfoSound(); // 🔊 Sound abspielen

  const container = document.getElementById('info-banner-container');
  const banner = document.createElement('div');
  banner.classList.add('info-banner');
  banner.innerHTML = `
    <div class="message">${message}</div>
    <div class="timer-bar" style="animation-duration: ${duration}ms; background: ${color};"></div>
  `;

  container.appendChild(banner);

  setTimeout(() => {
    banner.style.animation = "slide-up 0.5s ease-in forwards";
    setTimeout(() => {
      banner.remove();
    }, 500); // Dauer der slide-up Animation
  }, duration);
}

// 📋 Liste zufälliger Infotexte
const infoMessages = [
  "🔗 Wenn du Fragen hast wende dich an die Administration im D-Funk: discord.gg/mCAwP2ePac",
  "📷 Folge mir auf Instagram: @tmmyttv",
  "👮 Du hast wirst Ingame OOC angesprochen? Wende dich IC an die RP Polizei oder allen__gamble",
  "📜 Du willst Bilal sehen? Besuche den Ganoven unter twitch.tv/nycrox",
  "💖 Danke für euren Support – ihr seid die Besten!",
  "🕹️ Du bist unter 15 und hängst nur auf Tiktok? Schaue hier vorbei: @maltairl",
  "🚗 Alle Autos werden eingeparkt. Fraktionsfahrzeuge sind in der Garage verfügbar.",
  "✈️ Die Zivi Einreise steht aktuell nur weiblichen Spielerinnen zur Verfügung. Instagram: @tmmyttv",
  "🎁 Abonniere kostenlos mit Twitch Prime!"
];

// 🔁 Zufällige Nachricht auswählen
function getRandomInfoMessage() {
  const index = Math.floor(Math.random() * infoMessages.length);
  return infoMessages[index];
}

// ▶️ Erste Nachricht beim Start anzeigen
setTimeout(() => {
  showInfoBanner(getRandomInfoMessage(), 12000, "#2196F3");
}, 2000);

// ⏱ Alle 5 Minuten automatisch neue Nachricht anzeigen
setInterval(() => {
  showInfoBanner(getRandomInfoMessage(), 12000, "#2196F3");
}, 500000);
