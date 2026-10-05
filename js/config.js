// =============================================================================
// WUM — CONFIGURATION CENTRALE DES LIENS EXTERNES (config.js)
// =============================================================================
//
// Site vitrine : aucune donnée n'est stockée localement.
// Toutes les inscriptions et adhésions passent par des liens externes.
//
// COMMENT METTRE À JOUR :
//   Remplacer les URLs placeholder ci-dessous par les liens officiels WUM.
// =============================================================================

const WUM_CONFIG = {

  // --- Adhésion / Rejoindre le mouvement ---
  // TODO : Remplacer par le lien officiel Google Forms des adhésions WUM
  LIEN_ADHESION: 'https://docs.google.com/forms/d/e/1FAIpQLScDXrvZrPlLmhQKy1JWvxqmS4kdfFaX4O5OL5aPTSmzIG4Jfw/viewform?usp=publish-editor',

  // --- Réservation RM5 ---
  // TODO : Ajouter ici le lien Google Forms de réservation RM5
  LIEN_RM5: 'https://ticket.streameex.com/event/rm5-conference?utm_source=ig&utm_medium=social&utm_content=link_in_biohttps://docs.google.com/forms/d/e/PLACEHOLDER_RM5/viewform',

  // --- Réseaux sociaux ---
  INSTAGRAM: 'https://www.instagram.com/mywake_up?igsh=MXV6N2c4dzRycHd1MA==',
  INSTAGRAM_HANDLE: '@mywake_up',

  CLUBHOUSE: 'https://www.clubhouse.com/house/wake-up-mission?chs=zg1I860QYE%3A_wVbFHGRl7RRLFqZqRhrZ9sePM8x1XUyYRn8n9MGXF4&utm_medium=ch_house_settings',

  // Lien officiel de la chaîne YouTube RM Podcast
  YOUTUBE_PODCAST: 'https://www.youtube.com/@mywake_up',

  YOUTUBE_WUM: 'https://www.youtube.com/@wakeupmission',

  WHATSAPP_PHONE: '+243835620138',
  WHATSAPP_MESSAGE: 'Bonjour Wake Up Mission ! Je souhaite en savoir plus sur vos programmes.',

  // --- Chemins des visuels (dossier assets/images/) ---
  // Déposer les fichiers fournis aux emplacements indiqués.
  IMAGES: {
    rm5: 'assets/images/rm5.jpg',
    aes: 'assets/images/aes.jpg',
    rondeVeille: 'assets/images/ronde-veille.jpg',
    fps: 'assets/images/fps.jpg',
    rdr: 'assets/images/rdr.jpg',
    rmPodcast: 'assets/images/rm-podcast.jpg',
    clickUpMotion: 'assets/images/click-up-motion.jpg',
    signes: {
      revelation: 'assets/images/signes/signe-01-revelation.jpg',
      amour: 'assets/images/signes/signe-02-amour.jpg',
      repentance: 'assets/images/signes/signe-03-repentance.jpg',
      degout: 'assets/images/signes/signe-04-degout.jpg',
      desir: 'assets/images/signes/signe-05-desir.jpg'
    }
  }
};

// Exposer globalement pour utilisation dans app.js et les pages HTML
window.WUM_CONFIG = WUM_CONFIG;
