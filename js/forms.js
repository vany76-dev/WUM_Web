// Gestion des formulaires de rejoindre.html (Ambassadeur et Partenaire)

document.addEventListener('DOMContentLoaded', () => {
  const formAmbassadeur = document.getElementById('form-ambassadeur');
  const formPartenaire = document.getElementById('form-partenaire');

  // Soumission Formulaire Ambassadeur
  if (formAmbassadeur) {
    formAmbassadeur.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nom = document.getElementById('amb-nom').value.trim();
      const email = document.getElementById('amb-email').value.trim();
      const whatsapp = document.getElementById('amb-whatsapp').value.trim();
      const ville = document.getElementById('amb-ville').value.trim();
      const pays = document.getElementById('amb-pays').value.trim();
      const motivation = document.getElementById('amb-motivation').value.trim();
      
      const engageVoix = document.getElementById('amb-engage-voix').checked;
      const coordonneActions = document.getElementById('amb-coordonne-actions').checked;

      // Validation basique
      if (!nom || !email || !whatsapp || !ville || !pays) {
        window.showNotification("Veuillez remplir tous les champs obligatoires.", "error");
        return;
      }

      // Structure candidat
      const ambassadeurCandidate = {
        id: 'amb-' + Date.now(),
        type: 'Ambassadeur',
        nom,
        email,
        whatsapp,
        ville,
        pays,
        motivation,
        preferences: {
          engageVoix,
          coordonneActions
        },
        date: new Date().toLocaleDateString()
      };

      // Sauvegarde locale
      saveCandidate(ambassadeurCandidate);
      
      window.showNotification("Votre candidature d'Ambassadeur a été soumise avec succès !");
      formAmbassadeur.reset();
    });
  }

  // Soumission Formulaire Partenaire
  if (formPartenaire) {
    formPartenaire.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nom = document.getElementById('part-nom').value.trim();
      const contact = document.getElementById('part-contact').value.trim();
      
      // Récupération des types d'implication
      const implications = [];
      const checkboxes = document.querySelectorAll('input[name="part-implication"]:checked');
      checkboxes.forEach(cb => {
        implications.push(cb.value);
      });

      if (!nom || !contact) {
        window.showNotification("Veuillez remplir tous les champs obligatoires.", "error");
        return;
      }

      if (implications.length === 0) {
        window.showNotification("Veuillez choisir au moins un type d'implication.", "error");
        return;
      }

      // Structure candidat
      const partenaireCandidate = {
        id: 'part-' + Date.now(),
        type: 'Partenaire',
        nom,
        contact,
        implications,
        date: new Date().toLocaleDateString()
      };

      // Sauvegarde locale
      saveCandidate(partenaireCandidate);

      window.showNotification("Votre engagement de Partenaire a été enregistré ! Merci pour votre soutien.");
      formPartenaire.reset();
    });
  }
});

// Helper pour enregistrer dans le localStorage
function saveCandidate(candidate) {
  let candidates = JSON.parse(localStorage.getItem('wum_candidates')) || [];
  candidates.push(candidate);
  localStorage.setItem('wum_candidates', JSON.stringify(candidates));

  // Événement personnalisé pour avertir le tableau de bord
  const event = new CustomEvent('candidateSubmitted', { detail: candidate });
  window.dispatchEvent(event);
}
