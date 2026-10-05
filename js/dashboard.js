// Logique du tableau de bord de mobilisation et de l'assignation des compétences sans favoritisme

// Pool initial de talents de démonstration (pour peupler le dashboard)
const MOCK_TALENTS = [
  {
    id: 'tl-01',
    nom: 'Déborah Mpiana',
    level: 'Organisateur N4 : Membre de la PB',
    title: 'Intercesseur',
    scores: { spirituel: 90, technique: 30, logistique: 40, coordination: 50 }
  },
  {
    id: 'tl-02',
    nom: 'Caleb Tshilombo',
    level: 'Organisateur N5 : Spontaneous',
    title: 'Volontaire Logistique',
    scores: { spirituel: 65, technique: 45, logistique: 85, coordination: 60 }
  },
  {
    id: 'tl-03',
    nom: 'Esther Kabeya',
    level: 'Organisateur N5 : Spontaneous',
    title: 'Créative & Tech',
    scores: { spirituel: 70, technique: 80, logistique: 30, coordination: 55 }
  },
  {
    id: 'tl-04',
    nom: 'Alpha Mukendi',
    level: 'Organisateur N3 : Responsable SB',
    title: 'Coordonnateur Projets',
    scores: { spirituel: 80, technique: 75, logistique: 70, coordination: 85 }
  }
];

// Pool initial de tâches opérationnelles à accomplir
let WUM_TASKS = [
  {
    id: 'tsk-01',
    title: 'Intercession intensive : Préparation Conférence',
    description: 'Campagne de prière et de soutien psycho-spirituel en amont de la réunion.',
    requiredComp: 'spirituel',
    minScore: 75,
    status: 'Non assignée',
    assignee: null
  },
  {
    id: 'tsk-02',
    title: 'Gestion de flux et accueil : Retraite Limete',
    description: 'Organisation logistique des arrivées et de l\'installation des participants.',
    requiredComp: 'logistique',
    minScore: 70,
    status: 'Non assignée',
    assignee: null
  },
  {
    id: 'tsk-03',
    title: 'Création des visuels & support vidéo PWA',
    description: 'Design graphique des cartes d\'engagement et intégration de la boucle média.',
    requiredComp: 'technique',
    minScore: 65,
    status: 'Non assignée',
    assignee: null
  },
  {
    id: 'tsk-04',
    title: 'Coordination du programme Mentorat nouveaux contacts',
    description: 'Suivi et planification des sessions d\'accompagnement initial des contacts.',
    requiredComp: 'coordination',
    minScore: 70,
    status: 'Non assignée',
    assignee: null
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // Charger les talents (mock + utilisateur connecté)
  loadTalentPool();
  renderTasks();

  // Écouter les mises à jour de profil et de candidature
  window.addEventListener('profileUpdated', () => {
    loadTalentPool();
  });

  window.addEventListener('candidateSubmitted', () => {
    loadTalentPool();
  });
});

// Charger la liste complète des talents (mock + local)
function loadTalentPool() {
  const container = document.getElementById('talents-pool-list');
  if (!container) return;

  container.innerHTML = '';
  
  // Fusionner les mocks avec les profils générés en local
  let allTalents = [...MOCK_TALENTS];

  // 1. Ajouter le profil de l'utilisateur s'il existe
  const localProfile = JSON.parse(localStorage.getItem('wum_user_profile'));
  if (localProfile) {
    allTalents.unshift({
      id: 'tl-user',
      nom: localProfile.nom + ' (Vous)',
      level: localProfile.level,
      title: localProfile.title,
      scores: localProfile.scores
    });
  }

  // 2. Ajouter les candidats ambassadeurs inscrits via formulaire
  const candidates = JSON.parse(localStorage.getItem('wum_candidates')) || [];
  candidates.forEach(cand => {
    if (cand.type === 'Ambassadeur') {
      // Vérifier s'il n'est pas déjà présent
      if (!allTalents.some(t => t.nom.startsWith(cand.nom))) {
        allTalents.push({
          id: cand.id,
          nom: cand.nom,
          level: 'Organisateur N5 : Spontaneous',
          title: 'Candidat Ambassadeur',
          scores: { spirituel: 70, technique: 50, logistique: 50, coordination: 60 } // Valeurs moyennes par défaut
        });
      }
    }
  });

  // Sauvegarder dans window pour accès rapide lors de l'attribution
  window.currentTalentPool = allTalents;

  // Rendu de la liste dans la barre latérale
  allTalents.forEach(talent => {
    const item = document.createElement('div');
    item.className = 'talent-item';
    item.innerHTML = `
      <div class="assignee-avatar">${talent.nom.charAt(0)}</div>
      <div class="talent-info">
        <h5>${talent.nom}</h5>
        <p>${talent.title}</p>
        <p style="font-size: 0.7rem; color: var(--color-accent-mint);">
          S:${talent.scores.spirituel}% | T:${talent.scores.technique}% | L:${talent.scores.logistique}% | C:${talent.scores.coordination}%
        </p>
      </div>
    `;
    container.appendChild(item);
  });
}

// Rendu des tâches à accomplir
function renderTasks() {
  const container = document.getElementById('tasks-container');
  if (!container) return;

  container.innerHTML = '';

  WUM_TASKS.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item';
    
    let actionBtnHTML = '';
    let assigneeHTML = '';

    if (task.assignee) {
      assigneeHTML = `
        <div class="task-assignee">
          <div class="assignee-avatar">${task.assignee.nom.charAt(0)}</div>
          <div style="text-align: left;">
            <p style="font-size: 0.85rem; color: white; font-weight: 600;">${task.assignee.nom}</p>
            <p style="font-size: 0.75rem; color: var(--color-accent-mint);">${task.assignee.title}</p>
          </div>
          <button class="btn-assign" onclick="deassignTask('${task.id}')" style="border-color: #cc3333; color: #cc3333; font-size: 0.75rem; padding: 0.2rem 0.5rem; margin-left: 0.5rem;">Libérer</button>
        </div>
      `;
    } else {
      actionBtnHTML = `<button class="btn btn-assign" onclick="openAssignModal('${task.id}')">Attribuer (Zéro Favoritisme)</button>`;
      assigneeHTML = `<span style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">En attente de compétences...</span>`;
    }

    item.innerHTML = `
      <div class="task-info">
        <h4>${task.title}</h4>
        <p style="margin-bottom: 0.5rem;">${task.description}</p>
        <div>
          <span class="task-badge tech">Requis : ${task.requiredComp.toUpperCase()} >= ${task.minScore}%</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 1rem;">Statut : <strong>${task.status}</strong></span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        ${assigneeHTML}
        ${actionBtnHTML}
      </div>
    `;
    container.appendChild(item);
  });
}

// Ouvrir la modale d'attribution sans favoritisme
window.openAssignModal = function(taskId) {
  const task = WUM_TASKS.find(t => t.id === taskId);
  if (!task) return;

  // Calcul du matching score sans favoritisme pour chaque talent
  const talents = window.currentTalentPool || MOCK_TALENTS;
  const matchedTalents = talents.map(t => {
    // Le score de matching est égal à la valeur de la compétence requise pour la tâche
    const matchScore = t.scores[task.requiredComp];
    return { ...t, matchScore };
  });

  // Trier par score décroissant (les meilleurs en premier)
  matchedTalents.sort((a, b) => b.matchScore - a.matchScore);

  // Création dynamique d'une boîte de dialogue modale d'attribution
  let modal = document.getElementById('assign-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'assign-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  modal.style.zIndex = '2000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.padding = '1rem';

  let listHTML = '';
  matchedTalents.forEach((t, idx) => {
    const isBest = idx === 0 ? '<span style="background: var(--color-accent-mint); color: black; font-size: 0.65rem; font-weight: bold; padding: 0.2rem 0.5rem; border-radius: 4px; margin-left: auto;">TOP RECOMMANDATION</span>' : '';
    const isQual = t.matchScore >= task.minScore ? 'color: var(--color-accent-mint);' : 'color: #cc3333;';
    
    listHTML += `
      <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 0.5rem; transition: var(--transition-fast);">
        <div class="assignee-avatar">${t.nom.charAt(0)}</div>
        <div style="flex: 1;">
          <h5 style="color: white; margin-bottom: 0.15rem;">${t.nom}</h5>
          <p style="font-size: 0.75rem; color: var(--text-muted);">${t.level}</p>
        </div>
        <div style="text-align: right; margin-right: 1rem;">
          <p style="font-size: 0.75rem; color: var(--text-muted);">Score ${task.requiredComp.toUpperCase()}</p>
          <p style="font-size: 1.1rem; font-weight: bold; ${isQual}">${t.matchScore}%</p>
        </div>
        ${isBest}
        <button class="btn-assign" onclick="assignTask('${task.id}', '${t.id}')" style="margin-left: 1rem;">Choisir</button>
      </div>
    `;
  });

  modal.innerHTML = `
    <div style="background: #121214; border: 1px solid var(--glass-border); max-width: 600px; width: 100%; border-radius: 16px; padding: 2rem; box-shadow: var(--glass-shadow); position: relative; max-height: 90vh; overflow-y: auto;">
      <h3 style="color: white; font-family: var(--font-title); margin-bottom: 0.5rem;">Algorithme d'Assignation</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Sélection méritocratique pour la tâche : <strong>${task.title}</strong></p>
      
      <div style="margin-bottom: 1.5rem;">
        ${listHTML}
      </div>
      
      <div style="text-align: right;">
        <button class="btn btn-secondary" onclick="closeAssignModal()" style="font-size: 0.8rem; padding: 0.5rem 1.2rem;">Fermer</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
};

// Fermer la modale
window.closeAssignModal = function() {
  const modal = document.getElementById('assign-modal');
  if (modal) modal.remove();
};

// Assigner la tâche à un talent
window.assignTask = function(taskId, talentId) {
  const task = WUM_TASKS.find(t => t.id === taskId);
  const talents = window.currentTalentPool || MOCK_TALENTS;
  const talent = talents.find(t => t.id === talentId);

  if (task && talent) {
    task.assignee = talent;
    task.status = 'Assignée';
    
    window.showNotification(`Tâche attribuée à ${talent.nom} sur la base de ses compétences.`);
    closeAssignModal();
    renderTasks();
  }
};

// Désassigner/Libérer la tâche
window.deassignTask = function(taskId) {
  const task = WUM_TASKS.find(t => t.id === taskId);
  if (task) {
    task.assignee = null;
    task.status = 'Non assignée';
    
    window.showNotification("Tâche libérée pour réassignation.");
    renderTasks();
  }
};
