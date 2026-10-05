// Logique de gestion de la billetterie et des tickets d'événements

const WUM_EVENTS = [
  {
    id: 'evt-01',
    title: 'Awakening Experience Service',
    category: 'Virtuel (Zoom & Youtube)',
    date: 'Dimanche 26 Juillet 2026',
    time: '18:00 (Paris) / 17:00 (Kinshasa)',
    description: 'Culte d\'éveil et d\'expérience psycho-spirituelle en direct.',
    location: 'Lien Virtuel envoyé par email'
  },
  {
    id: 'evt-02',
    title: 'Revival Day - Retreat',
    category: 'Présentiel',
    date: '12 au 15 Août 2026',
    time: 'Journées complètes',
    description: 'Retraite spirituelle intensive et ateliers pratiques d\'impact.',
    location: '7e rue Limete, Kinshasa, RDC'
  },
  {
    id: 'evt-03',
    title: 'Emouna Session',
    category: 'Virtuel (Clubhouse & Zoom)',
    date: 'Chaque Jeudi soir',
    time: '21:00 (Paris) / 20:00 (Kinshasa)',
    description: 'Partage biblique profond sur la foi agissante et les signes de l\'éveil.',
    location: 'Plateformes virtuelles de WUM'
  },
  {
    id: 'evt-04',
    title: 'Descente Caritative Régionale',
    category: 'Présentiel',
    date: 'Samedi 29 Août 2026',
    time: '09:00 - 16:00',
    description: 'Action terrain d\'aide aux populations vulnérables. Service et partage.',
    location: 'Kinshasa Est - Orphelinat de la Paix'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderEvents();

  const ticketForm = document.getElementById('ticket-booking-form');
  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nom = document.getElementById('tkt-nom').value.trim();
      const email = document.getElementById('tkt-email').value.trim();
      const whatsapp = document.getElementById('tkt-whatsapp').value.trim();
      const eventId = document.getElementById('tkt-event-select').value;

      if (!nom || !email || !eventId) {
        window.showNotification("Veuillez remplir tous les champs obligatoires.", "error");
        return;
      }

      const event = WUM_EVENTS.find(evt => evt.id === eventId);
      if (!event) return;

      const ticket = {
        id: 'WUM-TKT-' + Math.floor(100000 + Math.random() * 900000),
        nom,
        email,
        whatsapp,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        dateGenerated: new Date().toLocaleDateString()
      };

      // Sauvegarder dans localStorage
      saveTicket(ticket);

      // Générer le ticket visuel
      renderVisualTicket(ticket);
      
      window.showNotification("Votre réservation a été validée !");
      ticketForm.reset();
      
      // Scroller jusqu'au ticket
      document.getElementById('ticket-result-section').scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// Afficher la liste des événements
function renderEvents() {
  const container = document.getElementById('events-container');
  const select = document.getElementById('tkt-event-select');
  if (!container) return;

  container.innerHTML = '';
  if (select) select.innerHTML = '<option value="">-- Sélectionnez un événement --</option>';

  WUM_EVENTS.forEach(evt => {
    // Ajouter à la grille HTML
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="event-content">
        <span class="event-badge">${evt.category}</span>
        <h3 class="event-title">${evt.title}</h3>
        <div class="event-meta">
          <span>📅 ${evt.date}</span>
          <span>⏰ ${evt.time}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">${evt.description}</p>
        <button class="btn btn-secondary" onclick="prepareBooking('${evt.id}')" style="width: 100%;">Réserver un ticket</button>
      </div>
    `;
    container.appendChild(card);

    // Ajouter au select du formulaire
    if (select) {
      const option = document.createElement('option');
      option.value = evt.id;
      option.textContent = `${evt.title} (${evt.category})`;
      select.appendChild(option);
    }
  });
}

// Remplir le formulaire avec l'événement sélectionné
window.prepareBooking = function(eventId) {
  const select = document.getElementById('tkt-event-select');
  if (select) {
    select.value = eventId;
    document.getElementById('ticket-booking-form').scrollIntoView({ behavior: 'smooth' });
    // Petit flash visuel pour indiquer le focus
    select.style.borderColor = 'var(--color-accent-mint)';
    setTimeout(() => {
      select.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }, 1000);
  }
};

// Sauvegarder dans localStorage
function saveTicket(ticket) {
  let tickets = JSON.parse(localStorage.getItem('wum_tickets')) || [];
  tickets.push(ticket);
  localStorage.setItem('wum_tickets', JSON.stringify(tickets));
}

// Rendu visuel du Ticket et Génération du QR Code simulé sur Canvas
function renderVisualTicket(ticket) {
  const resultSection = document.getElementById('ticket-result-section');
  const detailsDiv = document.getElementById('ticket-visual-details');
  if (!resultSection || !detailsDiv) return;

  resultSection.style.display = 'block';
  
  detailsDiv.innerHTML = `
    <div class="ticket-container">
      <div class="ticket-header">
        <h3 style="color: var(--color-accent-mint); font-family: var(--font-title); font-size: 1.5rem;">WAKE UP MISSION</h3>
        <p style="font-size: 0.75rem; letter-spacing: 0.1em; color: var(--text-muted);">TICKET D'ENTRÉE OFFICIEL</p>
      </div>
      <div style="text-align: left; margin: 1.5rem 0;">
        <p style="font-size: 0.8rem; color: var(--text-muted);">Événement :</p>
        <h4 style="color: white; margin-bottom: 0.75rem; font-size: 1.1rem;">${ticket.eventTitle}</h4>
        
        <p style="font-size: 0.8rem; color: var(--text-muted);">Participant :</p>
        <p style="color: white; font-weight: 600; margin-bottom: 0.75rem;">${ticket.nom}</p>
        
        <p style="font-size: 0.8rem; color: var(--text-muted);">Date & Lieu :</p>
        <p style="color: white; font-size: 0.85rem; margin-bottom: 0.25rem;">📅 ${ticket.eventDate}</p>
        <p style="color: white; font-size: 0.85rem;">📍 ${ticket.eventLocation}</p>
      </div>
      
      <div class="ticket-qrcode">
        <canvas id="qr-canvas" width="130" height="130"></canvas>
      </div>
      
      <p style="font-family: monospace; color: var(--color-accent-mint); font-size: 1rem; font-weight: bold; margin: 1rem 0;">${ticket.id}</p>
      
      <div class="ticket-info">
        <p>Généré le ${ticket.dateGenerated}</p>
        <p style="font-size: 0.7rem; margin-top: 0.5rem; color: #cc3333;">Présentez ce code à l'accueil de l'événement.</p>
      </div>
      
      <div class="ticket-actions">
        <button class="btn btn-primary" onclick="downloadTicketPNG()" style="font-size: 0.8rem; padding: 0.5rem 1rem;">Télécharger PNG</button>
      </div>
    </div>
  `;

  // Dessiner le QR Code simulé sur le Canvas
  generateSimulatedQRCode('qr-canvas', ticket.id);
}

// Fonction de dessin d'un QR code factice (mais propre et géométrique) sur Canvas
function generateSimulatedQRCode(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  
  // Fond blanc
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  // Dessin des yeux de repère (QR Code standard dans 3 coins)
  ctx.fillStyle = '#000000';
  
  // Fonction pour dessiner un œil de repérage de taille standard
  function drawFinderPattern(x, y, eyeSize) {
    ctx.fillRect(x, y, eyeSize, eyeSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 4, y + 4, eyeSize - 8, eyeSize - 8);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + 8, eyeSize - 16, eyeSize - 16);
  }

  const eyeSize = 32;
  drawFinderPattern(5, 5, eyeSize); // Coin haut gauche
  drawFinderPattern(size - eyeSize - 5, 5, eyeSize); // Coin haut droite
  drawFinderPattern(5, size - eyeSize - 5, eyeSize); // Coin bas gauche
  
  // Dessiner le corps du QR code (pixels aléatoires structurés)
  // On utilise le texte comme seed pour générer des pixels fixes pour un texte donné
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Grille de pixels de 4x4
  const pixelSize = 4;
  for (let x = 5; x < size - 5; x += pixelSize) {
    for (let y = 5; y < size - 5; y += pixelSize) {
      // Exclure les zones des yeux de repérage
      const isEye1 = (x < eyeSize + 10 && y < eyeSize + 10);
      const isEye2 = (x > size - eyeSize - 10 && y < eyeSize + 10);
      const isEye3 = (x < eyeSize + 10 && y > size - eyeSize - 10);
      
      if (!isEye1 && !isEye2 && !isEye3) {
        // Pixel déterministe basé sur le hash
        const val = Math.abs(Math.sin(hash + x * y)) * 1000;
        if (Math.floor(val) % 2 === 0) {
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    }
  }
}

// Fonction pour télécharger le ticket au format image (PNG)
window.downloadTicketPNG = function() {
  // On va recréer l'ensemble du ticket dans un canvas masqué de grande taille pour pouvoir le télécharger en haute qualité
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 550;
  const ctx = canvas.getContext('2d');

  // Fond dégradé sombre
  ctx.fillStyle = '#1c1c1f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Bordure violette
  ctx.strokeStyle = '#7B2CBF';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Titre
  ctx.fillStyle = '#5CFFB0';
  ctx.font = 'bold 22px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WAKE UP MISSION', canvas.width / 2, 50);

  ctx.fillStyle = '#6C757D';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('TICKET D\'ENTRÉE OFFICIEL', canvas.width / 2, 70);

  // Ligne de séparation
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 90);
  ctx.lineTo(canvas.width - 30, 90);
  ctx.stroke();

  // Récupérer les données du ticket généré
  const tickets = JSON.parse(localStorage.getItem('wum_tickets')) || [];
  if (tickets.length === 0) return;
  const ticket = tickets[tickets.length - 1]; // Dernier réservé

  // Contenu textuel
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6C757D';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Événement :', 40, 120);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px Outfit, sans-serif';
  ctx.fillText(ticket.eventTitle, 40, 140);

  ctx.fillStyle = '#6C757D';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Participant :', 40, 175);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '14px Inter, sans-serif';
  ctx.fillText(ticket.nom, 40, 195);

  ctx.fillStyle = '#6C757D';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Date & Heure :', 40, 230);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText(ticket.eventDate, 40, 250);

  ctx.fillStyle = '#6C757D';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Lieu :', 40, 285);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '13px Inter, sans-serif';
  // Couper l'adresse si trop longue
  let loc = ticket.eventLocation;
  if (loc.length > 40) loc = loc.substring(0, 37) + '...';
  ctx.fillText(loc, 40, 305);

  // Copier le QR code du canvas original
  const qrCanvasOriginal = document.getElementById('qr-canvas');
  if (qrCanvasOriginal) {
    ctx.drawImage(qrCanvasOriginal, (canvas.width / 2) - 60, 330, 120, 120);
  }

  // ID du ticket
  ctx.textAlign = 'center';
  ctx.fillStyle = '#5CFFB0';
  ctx.font = 'bold 16px Courier New, monospace';
  ctx.fillText(ticket.id, canvas.width / 2, 480);

  ctx.fillStyle = '#6C757D';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText(`Généré le ${ticket.dateGenerated} - WUM Portal`, canvas.width / 2, 510);

  // Création du lien de téléchargement
  const link = document.createElement('a');
  link.download = `ticket-${ticket.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
