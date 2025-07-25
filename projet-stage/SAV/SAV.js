// SAV.js - Calcul des bonus et totaux dans le tableau

// Fonction pour calculer le bonus de chaque ligne et retourner la somme totale des bonus
function calculerBonus() {
  const rows = document.querySelectorAll('tbody tr');
  let totalBonus = 0;

  rows.forEach((row, index) => {
    const pointsMaxSpan = row.querySelector('.points-max');
    if (!pointsMaxSpan) {
      console.log(`Ligne ${index} ignorée (pas de points-max)`);
      return;
    }

    const resultatCell = row.cells[1];           // 2ème cellule (index 1)
    const kpiMinSpan = row.querySelector('.kpi-min');
    const kpiMaxSpan = row.querySelector('.kpi-max');
    const bonusCell = row.querySelector('.bonus-cell');

    if (!resultatCell || !kpiMinSpan || !kpiMaxSpan || !bonusCell) {
      console.warn(`Ligne ${index} éléments manquants`);
      return;
    }

    let resultat = parseFloat(resultatCell.textContent.replace('%', '').replace(',', '.')) || 0;
    let kpiMin = parseFloat(kpiMinSpan.textContent.replace('%', '').replace(',', '.'));
    let kpiMax = parseFloat(kpiMaxSpan.textContent.replace('%', '').replace(',', '.'));
    let pointsMax = parseFloat(pointsMaxSpan.textContent.replace(',', '.'));

    let bonus = 0;

    if (kpiMax > kpiMin) {
      bonus = ((resultat - kpiMin) / (kpiMax - kpiMin)) * pointsMax;
    } else if (kpiMax < kpiMin) {
      bonus = ((kpiMin - resultat) / (kpiMin - kpiMax)) * pointsMax;
    }

    // Limiter le bonus entre 0 et pointsMax
    bonus = Math.max(0, Math.min(bonus, pointsMax));

    bonusCell.textContent = bonus.toFixed(2);
    totalBonus += bonus;
  });

  return totalBonus;
}

// Fonction pour calculer la somme totale des points max
function calculerTotalPointsMax() {
  let total = 0;
  document.querySelectorAll('.points-max').forEach(cell => {
    let val = parseFloat(cell.textContent.replace(',', '.'));
    if (!isNaN(val)) total += val;
  });
  return total;
}

// Met à jour les totaux affichés dans la page
function mettreAJourTotaux() {
  const totalPointsMax = calculerTotalPointsMax();
  const totalPointsMaxCell = document.getElementById('total-points-max');
  if (totalPointsMaxCell) {
    totalPointsMaxCell.textContent = totalPointsMax.toFixed(2);
  } else {
    console.warn("⚠️ Élément #total-points-max introuvable !");
  }

  const totalBonus = calculerBonus();
  const totalBonusCell = document.getElementById('total-bonus');
  if (totalBonusCell) {
    totalBonusCell.textContent = totalBonus.toFixed(2);
  } else {
    console.warn("⚠️ Élément #total-bonus introuvable !");
  }
}

// Déclenche la mise à jour des totaux au chargement complet du DOM
document.addEventListener("DOMContentLoaded", () => {
  mettreAJourTotaux();
});

console.log("SAV.js chargé et script exécuté");