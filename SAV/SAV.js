// script.js

function calculerTotalPointsMax() {
    let total = 0;
    document.querySelectorAll('.points-max').forEach(cell => {
        let val = parseFloat(cell.textContent.replace(',', '.'));
        if (!isNaN(val)) {
            total += val;
        }
    });
    document.getElementById('total-points-max').textContent = total.toFixed(2);
}

function calculerBonus() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const resultatCell = row.cells[1];
        const kpiMinSpan = row.querySelector('.kpi-min');
        const kpiMaxSpan = row.querySelector('.kpi-max');
        const pointsMaxSpan = row.querySelector('.points-max');
        const bonusCell = row.cells[6];

        if (!kpiMinSpan || !kpiMaxSpan || !pointsMaxSpan || !bonusCell) return;

        let resultatText = resultatCell.textContent.replace('%', '').trim();
        let resultat = parseFloat(resultatText.replace(',', '.')) || 0;
        let kpiMin = parseFloat(kpiMinSpan.textContent.replace(',', '.'));
        let kpiMax = parseFloat(kpiMaxSpan.textContent.replace(',', '.'));
        let pointsMax = parseFloat(pointsMaxSpan.textContent.replace(',', '.'));

        if (isNaN(resultat) || isNaN(kpiMin) || isNaN(kpiMax) || isNaN(pointsMax) || (kpiMax - kpiMin) === 0) {
            bonusCell.textContent = '';
            return;
        }

        let bonus = ((resultat - kpiMin) / (kpiMax - kpiMin)) * pointsMax;
        if (bonus < 0) bonus = 0;
        if (bonus > pointsMax) bonus = pointsMax;

        bonusCell.textContent = bonus.toFixed(2);
    });
}

// Exécuter au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    calculerBonus();
    calculerTotalPointsMax();
});

function exporterPDF() {
    const element = document.getElementById("contrat");
    const options = {
        margin:       0.5,
        filename:     'contrat_qualite.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
}
