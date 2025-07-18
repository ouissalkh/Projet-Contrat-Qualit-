//Fonction pour calculer le bonus
function calculerBonus() {
  //pour selectionner tout les lignes tr de body
  const rows = document.querySelectorAll('tbody tr');
  //initialise une variable totalBonus pour calculer le bonus
  let totalBonus = 0;

  //parcourir chaque ligne du tableau par index
  rows.forEach((row, index) => {
    // Ignore les lignes qui ne contiennent pas de 'points-max'
    const pointsMaxSpan = row.querySelector('.points-max');
    if (!pointsMaxSpan) {
      //si l'element qui correspond n'existe pas affiche ce messg
      console.log(`Ligne ${index} ignorée (pas de points-max)`);
      return;
    }

    //selectionner la 2eme cellule de la ligne 
    const resultatCell = row.cells[1];
    //selectionne l'element qui contient le id kpi-min
    const kpiMinSpan = row.querySelector('.kpi-min');
    //selectionne l'element qui contient le id kpi-min
    const kpiMaxSpan = row.querySelector('.kpi-max');
    // 7e colonne = bonus
    const bonusCell = row.cells[6]; 

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
    // Limite le bonus à la plage [0, pointsMax].
    bonus = Math.max(0, Math.min(bonus, pointsMax));

    bonusCell.textContent = bonus.toFixed(2);
    totalBonus += bonus;

    console.log(`Ligne ${index} - Bonus calculé: ${bonus.toFixed(2)}`);
  });

  return totalBonus;
}

function calculerTotalPointsMax() {
  let total = 0;
  document.querySelectorAll('.points-max').forEach(cell => {
    let val = parseFloat(cell.textContent.replace(',', '.'));
    if (!isNaN(val)) total += val;
  });
  return total;
}

function mettreAJourTotaux() {
  const totalPointsMax = calculerTotalPointsMax();
  const totalCell = document.getElementById('total-points-max');

  if (!totalCell) {
    console.error("⚠️ Élément #total-points-max introuvable !");
    return;
  }

  totalCell.textContent = totalPointsMax.toFixed(2);

  calculerBonus();

}

document.addEventListener("DOMContentLoaded", () => {
  mettreAJourTotaux();
});

console.log("SAV.js chargé et script exécuté");

/*function calculerBonus() {
  const rows = document.querySelectorAll('tbody tr');
  let totalBonus = 0;

  rows.forEach(row => {
    const resultatCell = row.cells[1];
    const kpiMinSpan = row.querySelector('.kpi-min');
    const kpiMaxSpan = row.querySelector('.kpi-max');
    const pointsMaxSpan = row.querySelector('.points-max');
    const bonusCell = row.cells[6];

    if (!resultatCell || !kpiMinSpan || !kpiMaxSpan || !pointsMaxSpan || !bonusCell) return;

    let resultat = parseFloat(resultatCell.textContent.replace('%', '').replace(',', '.')) || 0;
    let kpiMin = parseFloat(kpiMinSpan.textContent.replace('%', '').replace(',', '.'));
    let kpiMax = parseFloat(kpiMaxSpan.textContent.replace('%', '').replace(',', '.'));
    let pointsMax = parseFloat(pointsMaxSpan.textContent.replace(',', '.'));

    let bonus = 0;

    if (kpiMax > kpiMin) {
      // Plus c'est haut, mieux c'est
      bonus = ((resultat - kpiMin) / (kpiMax - kpiMin)) * pointsMax;
    } else if (kpiMax < kpiMin) {
      // Plus c'est bas, mieux c'est
      bonus = ((kpiMin - resultat) / (kpiMin - kpiMax)) * pointsMax;
    }

    // Bornes entre 0 et pointsMax
    bonus = Math.max(0, Math.min(bonus, pointsMax));

    bonusCell.textContent = bonus.toFixed(2);

    totalBonus += bonus;
  });

  return totalBonus;
}

function calculerTotalPointsMax() {
  let total = 0;
  document.querySelectorAll('.points-max').forEach(cell => {
    let val = parseFloat(cell.textContent.replace(',', '.'));
    if (!isNaN(val)) {
      total += val;
    }
  });
  return total;
}

function mettreAJourTotaux() {
  const totalPointsMax = calculerTotalPointsMax();
  const totalBonus = calculerBonus();

  document.getElementById('total-points-max').textContent = totalPointsMax.toFixed(2);
  //document.getElementById('total-bonus').textContent = totalBonus.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  mettreAJourTotaux();
});

function exporterPDF() {
  const element = document.getElementById("contrat");

  const options = {
    margin: 0.5,
    filename: 'contrat_qualite.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(options).from(element).save();
}
*/