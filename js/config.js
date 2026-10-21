// =============================================================================
// WUM — CONFIGURATION CENTRALE DES LIENS EXTERNES (config.js)
// =============================================================================
//
// Site vitrine : aucune donnée n'est stockée localement.
// Toutes les inscriptions et adhésions passent par des liens externes.
//
// COMMENT METTRE À JOUR :
//   Remplacer les URLs ci-dessous par les liens officiels WUM confirmés.
// =============================================================================

const WUM_CONFIG = {

  // --- Adhésion / Rejoindre le mouvement ---
  LIEN_ADHESION: 'https://docs.google.com/forms/d/e/1FAIpQLScDXrvZrPlLmhQKy1JWvxqmS4kdfFaX4O5OL5aPTSmzIG4Jfw/viewform',

  // --- Billetterie RM5 (24 et 25 octobre 2026) ---
  // Deux événements distincts : chaque lien ne doit être utilisé que pour son événement.
  RM5_CONFERENCE: 'https://ticket.streameex.com/event/rm5-conference',
  RM5_BANQUET: 'https://ticket.streameex.com/event/rm5-banquet-financier-jour2',

  // --- Réseaux sociaux ---
  INSTAGRAM: 'https://www.instagram.com/mywake_up?igsh=MXV6N2c4dzRycHd1MA==',
  INSTAGRAM_HANDLE: '@mywake_up',

  CLUBHOUSE: 'https://www.clubhouse.com/house/wake-up-mission?chs=zg1I860QYE%3A_wVbFHGRl7RRLFqZqRhrZ9sePM8x1XUyYRn8n9MGXF4&utm_medium=ch_house_settings',

  // Lien officiel de la chaîne YouTube RM Podcast
  YOUTUBE_PODCAST: 'https://www.youtube.com/@mywake_up',

  YOUTUBE_WUM: 'https://www.youtube.com/@wakeupmission',

  WHATSAPP_PHONE: '+243835620138',
  WHATSAPP_MESSAGE: 'Bonjour Wake Up Mission ! Je souhaite en savoir plus sur vos programmes.'
};

// Exposer globalement pour utilisation dans app.js et les pages HTML
window.WUM_CONFIG = WUM_CONFIG;
