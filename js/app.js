// =============================================================================
// WAKE UP MISSION - SCRIPT PRINCIPAL (app.js)
// =============================================================================
//
// Ce fichier gère :
//   1. L'enregistrement du Service Worker (PWA)
//   2. La navigation mobile (menu hamburger)
//   3. Le bouton flottant WhatsApp
//   4. Les animations au défilement (Intersection Observer)
//   5. La modal d'annonce RM5
//   6. L'application automatique des liens externes (config.js)
//   7. Les notifications toast (confirmations légères)
//
// PRÉREQUIS : charger js/config.js AVANT ce fichier.
// =============================================================================

const AFFICHER_MODAL_RM5 = true;
const DELAI_MODAL_RM5 = 1500;

document.addEventListener('DOMContentLoaded', () => {
  initServiceWorker();
  initMenuMobile();
  initWhatsApp();
  initLiensExternes();
  initImageFallbacks();
  initAnimationsScroll();
  initModalRM5();
});

// =============================================================================
// SERVICE WORKER — PWA
// =============================================================================
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Chemin relatif : fonctionne sous /WUM_Web/ (GitHub Pages) comme à la racine.
      navigator.serviceWorker.register('sw.js', { scope: './' })
        .then(() => console.log('[WUM] Service Worker enregistré ✓'))
        .catch(err => console.warn('[WUM] Échec du Service Worker :', err));
    });
  }
}

// =============================================================================
// MENU MOBILE
// =============================================================================
function initMenuMobile() {
  const toggleBtn = document.querySelector('.toggle-mobile');
  const menuMobile = document.querySelector('.menu-mobile');
  const overlayMobile = document.querySelector('.overlay-mobile');

  if (!toggleBtn || !menuMobile) return;

  function majEtat(ouvert) {
    toggleBtn.classList.toggle('ouvert', ouvert);
    menuMobile.classList.toggle('ouvert', ouvert);
    toggleBtn.setAttribute('aria-expanded', String(ouvert));
    toggleBtn.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    if (overlayMobile) overlayMobile.classList.toggle('actif', ouvert);
    document.body.style.overflow = ouvert ? 'hidden' : '';
  }

  function basculerMenu() {
    majEtat(!menuMobile.classList.contains('ouvert'));
  }

  function fermerMenu() {
    if (menuMobile.classList.contains('ouvert')) majEtat(false);
  }

  toggleBtn.addEventListener('click', basculerMenu);
  if (overlayMobile) overlayMobile.addEventListener('click', fermerMenu);
  menuMobile.querySelectorAll('a').forEach(lien => lien.addEventListener('click', fermerMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuMobile.classList.contains('ouvert')) {
      majEtat(false);
      toggleBtn.focus();
    }
  });
  window.matchMedia('(min-width: 993px)').addEventListener('change', (e) => { if (e.matches) fermerMenu(); });
  window.addEventListener('pageshow', fermerMenu);
}

// =============================================================================
// WHATSAPP — Bouton flottant et liens footer
// =============================================================================
function initWhatsApp() {
  const config = window.WUM_CONFIG || {};
  const phone = config.WHATSAPP_PHONE;
  if (!phone) return;
  const message = config.WHATSAPP_MESSAGE || 'Bonjour Wake Up Mission !';

  const urlWA = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  const btnWA = document.querySelector('.whatsapp-flottant');
  if (btnWA) {
    btnWA.href = urlWA;
    btnWA.setAttribute('target', '_blank');
    btnWA.setAttribute('rel', 'noopener noreferrer');
  }

  document.querySelectorAll('.lien-whatsapp-footer').forEach(lien => {
    lien.href = urlWA;
    lien.setAttribute('target', '_blank');
    lien.setAttribute('rel', 'noopener noreferrer');
  });
}

// =============================================================================
// LIENS EXTERNES — Application depuis config.js
// Applique automatiquement les URLs aux éléments marqués par classe ou data-attribut.
// =============================================================================
function initLiensExternes() {
  const config = window.WUM_CONFIG;
  if (!config) return;

  // Boutons d'adhésion (Rejoindre le Mouvement, Devenir membre, etc.)
  document.querySelectorAll('.lien-adhesion, [data-lien="adhesion"]').forEach(el => {
    el.href = config.LIEN_ADHESION;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  // Billetterie RM5 : conférence (24 octobre) et banquet (25 octobre)
  [
    ['.lien-rm5-conference, [data-lien="rm5-conference"]', config.RM5_CONFERENCE],
    ['.lien-rm5-banquet, [data-lien="rm5-banquet"]', config.RM5_BANQUET]
  ].forEach(([selecteur, url]) => {
    if (!url) return;
    document.querySelectorAll(selecteur).forEach(el => {
      el.href = url;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
  });

  // Instagram
  document.querySelectorAll('.lien-instagram, [data-lien="instagram"]').forEach(el => {
    el.href = config.INSTAGRAM;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  // Clubhouse
  document.querySelectorAll('.lien-clubhouse, [data-lien="clubhouse"]').forEach(el => {
    el.href = config.CLUBHOUSE;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  // YouTube Podcast
  document.querySelectorAll('.lien-youtube-podcast, [data-lien="youtube-podcast"]').forEach(el => {
    el.href = config.YOUTUBE_PODCAST;
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  // Mettre à jour les handles Instagram affichés en texte
  document.querySelectorAll('[data-instagram-handle]').forEach(el => {
    el.textContent = config.INSTAGRAM_HANDLE;
  });
}

// =============================================================================
// IMAGES — Masquer les images manquantes pour laisser le fond gradient visible
// =============================================================================
function initImageFallbacks() {
  document.querySelectorAll('.activite-carte-image, .signe-carte-photo-img, .carte-visuel-img, .activite-vedette-image').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('image-manquante');
    });
  });
}

// =============================================================================
// ANIMATIONS AU DÉFILEMENT
// =============================================================================
function initAnimationsScroll() {
  const elementsAnimes = document.querySelectorAll(
    '.carte, .timeline-item, .signe-carte, .signe-carte-photo, .activite-carte, [data-animer]'
  );

  const observateur = new IntersectionObserver((entrees, obs) => {
    entrees.forEach(entree => {
      if (entree.isIntersecting) {
        entree.target.style.opacity = '1';
        entree.target.style.transform = 'translateY(0)';
        obs.unobserve(entree.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elementsAnimes.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    observateur.observe(el);
  });
}

// =============================================================================
// MODAL RM5 — Annonce sur la page d'accueil (une fois par session)
// =============================================================================
function initModalRM5() {
  const modal = document.getElementById('modal-rm5');
  if (!modal || !AFFICHER_MODAL_RM5) return;

  if (sessionStorage.getItem('wum_modal_rm5_vue')) return;

  setTimeout(() => {
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem('wum_modal_rm5_vue', '1');
  }, DELAI_MODAL_RM5);

  modal.querySelectorAll('[data-fermer-modal]').forEach(btn => {
    btn.addEventListener('click', fermerModalRM5);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) fermerModalRM5();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fermerModalRM5();
  });
}

function fermerModalRM5() {
  const modal = document.getElementById('modal-rm5');
  if (!modal) return;
  modal.classList.remove('visible');
  document.body.style.overflow = '';
}

window.fermerModalRM5 = fermerModalRM5;

// =============================================================================
// NOTIFICATIONS TOAST
// =============================================================================
function showNotification(message, type = 'success') {
  let conteneur = document.getElementById('conteneur-notifications');
  if (!conteneur) {
    conteneur = document.createElement('div');
    conteneur.id = 'conteneur-notifications';
    Object.assign(conteneur.style, {
      position: 'fixed', top: '5.5rem', right: '1.5rem', zIndex: '9999',
      display: 'flex', flexDirection: 'column', gap: '0.5rem'
    });
    document.body.appendChild(conteneur);
  }

  const notification = document.createElement('div');
  const couleurBordure = type === 'success' ? '#71F4B3' : '#4D41D9';

  Object.assign(notification.style, {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    background: 'linear-gradient(135deg, #4D41D9, #803DB4)',
    borderLeft: `4px solid ${couleurBordure}`, color: 'white',
    padding: '0.9rem 1.4rem', borderRadius: '10px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)', fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif', transform: 'translateX(120%)',
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    maxWidth: '320px'
  });

  notification.innerHTML = `<strong>${type === 'success' ? '✓' : 'ℹ'}</strong><span>${message}</span>`;
  conteneur.appendChild(notification);
  notification.offsetHeight;
  notification.style.transform = 'translateX(0)';

  setTimeout(() => {
    notification.style.transform = 'translateX(120%)';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

window.showNotification = showNotification;
