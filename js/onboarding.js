// Logique du tunnel d'onboarding et test de personnalité

document.addEventListener('DOMContentLoaded', () => {
  const wizard = document.getElementById('onboarding-wizard');
  if (!wizard) return;

  const steps = wizard.querySelectorAll('.question-step');
  const progressBar = wizard.querySelector('.wizard-progress-bar');
  const btnPrev = document.getElementById('wizard-prev');
  const btnNext = document.getElementById('wizard-next');
  
  let currentStep = 0;
  const totalSteps = steps.length;
  
  // Tableau de réponses sélectionnées
  const answers = {};

  // Mettre à jour l'affichage des étapes
  function updateWizard() {
    steps.forEach((step, idx) => {
      if (idx === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Progression
    const progress = ((currentStep) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // Visibilité des boutons
    if (currentStep === 0) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = 'block';
    }

    if (currentStep === totalSteps - 1) {
      btnNext.textContent = "Calculer mon profil";
    } else {
      btnNext.textContent = "Suivant";
    }
  }

  // Événements boutons de navigation
  btnPrev.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateWizard();
    }
  });

  btnNext.addEventListener('click', () => {
    // Vérifier si une option est sélectionnée pour l'étape en cours
    const activeStep = steps[currentStep];
    const selectedBtn = activeStep.querySelector('.option-btn.selected');
    
    if (!selectedBtn) {
      window.showNotification("Veuillez sélectionner une réponse pour continuer.", "error");
      return;
    }

    // Sauvegarder la réponse
    const dimension = activeStep.dataset.dimension;
    const value = selectedBtn.dataset.value;
    const weight = JSON.parse(selectedBtn.dataset.weight || '{}');
    
    answers[dimension] = { value, weight };

    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateWizard();
    } else {
      // Fin du test, calcul des résultats
      calculateAndShowProfile(answers);
    }
  });

  // Sélection des options de réponse
  wizard.addEventListener('click', (e) => {
    if (e.target.classList.contains('option-btn')) {
      const activeStep = steps[currentStep];
      const buttons = activeStep.querySelectorAll('.option-btn');
      
      buttons.forEach(btn => btn.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  });

  // Initialiser
  updateWizard();
});

// Calcul du profil à partir des réponses
function calculateAndShowProfile(answers) {
  // Scores par compétence
  const scores = {
    spirituel: 0,
    technique: 0,
    logistique: 0,
    coordination: 0
  };

  // Cumul des poids
  for (let key in answers) {
    const weight = answers[key].weight;
    for (let comp in weight) {
      scores[comp] += weight[comp];
    }
  }

  // Normalisation des scores à 100% (échelle indicative)
  const maxScorePerCategory = 25; // Hypothèse sur le max de poids cumulables
  const pctScores = {};
  for (let comp in scores) {
    pctScores[comp] = Math.min(Math.round((scores[comp] / maxScorePerCategory) * 100), 100);
  }

  // Calcul du niveau d'organisateur de N3 à N5
  let level = "Organisateur N5 : Spontaneous";
  let title = "Volontaire Spontané";
  let desc = "Vous êtes impliqué de manière réactive sur les actions terrain de WUM. Vos compétences sont mobilisées au besoin lors des événements.";

  // Si score spirituel élevé et coordination élevée -> N3
  if (scores.spirituel >= 15 && scores.coordination >= 15) {
    level = "Organisateur N3 : Responsable SB (Spiritual Bridge)";
    title = "Candidat Staff & Spiritual Bridge";
    desc = "Votre maturité spirituelle et vos capacités de leadership vous prédisposent à coordonner des projets au sein de l'organe de planification stratégique.";
  } else if (scores.spirituel >= 12) {
    level = "Organisateur N4 : Membre de la PB (Prayer Band)";
    title = "Ouvrier Permanent / Intercesseur";
    desc = "Vous êtes au cœur permanent du déploiement opérationnel et de l'intercession de Wake Up Mission. Un pilier pour soutenir les actions.";
  }

  // Récupération des informations de l'utilisateur (nom et email) s'ils se sont inscrits avant
  // Sinon on demande ou on utilise un profil générique
  const userName = localStorage.getItem('wum_candidate_name') || "Nouveau Membre";
  
  const userProfile = {
    nom: userName,
    level: level,
    title: title,
    description: desc,
    scores: pctScores,
    timestamp: new Date().toISOString()
  };

  // Enregistrer le profil
  localStorage.setItem('wum_user_profile', JSON.stringify(userProfile));

  // Afficher la zone de résultat
  displayProfileResult(userProfile);
}

// Rendu HTML du résultat
function displayProfileResult(profile) {
  const wizard = document.getElementById('onboarding-wizard');
  const resultDiv = document.getElementById('profile-result-container');
  
  if (!wizard || !resultDiv) return;

  wizard.style.display = 'none';
  resultDiv.style.display = 'block';

  // Remplissage du résultat
  document.getElementById('res-title').textContent = profile.title;
  document.getElementById('res-level').textContent = profile.level;
  document.getElementById('res-desc').textContent = profile.description;

  // Remplissage des barres de compétence
  const barSpirituel = document.getElementById('bar-spirituel');
  const barTechnique = document.getElementById('bar-technique');
  const barLogistique = document.getElementById('bar-logistique');
  const barCoordination = document.getElementById('bar-coordination');

  const valSpirituel = document.getElementById('val-spirituel');
  const valTechnique = document.getElementById('val-technique');
  const valLogistique = document.getElementById('val-logistique');
  const valCoordination = document.getElementById('val-coordination');

  if (barSpirituel) {
    // Petit delai pour trigger la transition CSS
    setTimeout(() => {
      barSpirituel.style.width = `${profile.scores.spirituel}%`;
      barTechnique.style.width = `${profile.scores.technique}%`;
      barLogistique.style.width = `${profile.scores.logistique}%`;
      barCoordination.style.width = `${profile.scores.coordination}%`;

      valSpirituel.textContent = `${profile.scores.spirituel}%`;
      valTechnique.textContent = `${profile.scores.technique}%`;
      valLogistique.textContent = `${profile.scores.logistique}%`;
      valCoordination.textContent = `${profile.scores.coordination}%`;
    }, 100);
  }

  // Notifier l'utilisateur
  window.showNotification("Votre test de personnalité est terminé. Profil créé !");

  // Déclencher un événement global pour recharger le dashboard s'il est affiché
  const event = new CustomEvent('profileUpdated', { detail: profile });
  window.dispatchEvent(event);
}

// Fonction globale pour réinitialiser le test
window.resetOnboardingTest = function() {
  const wizard = document.getElementById('onboarding-wizard');
  const resultDiv = document.getElementById('profile-result-container');
  if (wizard && resultDiv) {
    localStorage.removeItem('wum_user_profile');
    resultDiv.style.display = 'none';
    wizard.style.display = 'block';
    
    // Réinitialiser les boutons de sélection
    const selectedButtons = wizard.querySelectorAll('.option-btn.selected');
    selectedButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Rediriger vers l'étape 0
    const nextBtn = document.getElementById('wizard-next');
    nextBtn.click(); // Hack rapide pour forcer le recalcul
    
    // Recharge de la page rejoindre.html pour plus de simplicité
    window.location.reload();
  }
};
