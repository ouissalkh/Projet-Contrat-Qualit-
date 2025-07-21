// variable labels pour les etiquetes des graphes
const labels = ['OK', 'NOK', 'OK', 'OK'];
// les valeurs des etiquètes
const dataValues = [75, 60, 80, 30];
const colors = dataValues.map(val => {
  if (val >= 85) return '#229351ff';
  if (val >= 40) return '#229351ff';
  return '#e74c3c';
});

// creation des graphes

// Bar Chart
const barCtx = document.getElementById('barChart').getContext('2d');
new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: labels,
    // les donnnes du tableau sont stocker dans datasets
    datasets: [{
      label: 'Valeur (%)', // le titre afficher dans la legende
      data: dataValues, //les valeurs a afficher 
      backgroundColor: colors // la couleur de chaque valeur
    }]
  },
  options: {
    // les plugens : title ,legend, tooltip
    plugins: {
      title: {
        display: true,
        text: 'Graphique en Barres'
      }
    }
  }
});

// Pie Chart
const pieCtx = document.getElementById('pieChart').getContext('2d');
new Chart(pieCtx, {
  type: 'pie',
  data: {
    labels: labels,
    datasets: [{
      data: dataValues,
      backgroundColor: colors
    }]
  },
  options: {
    plugins: {
      title: { 
        display: true, //le titre sera afficher
        text: 'Graphique en Camembert'
      }
    }
  }
});

// Recherche / filtre des cartes
function filtrerCartes() {
  const filtre = document.getElementById('searchInput').value.toLowerCase();
  const cartes = document.querySelectorAll('.indicateur-cards .card');

  cartes.forEach(carte => {
    const titre = carte.querySelector('h3').textContent.toLowerCase();
    carte.style.display = titre.includes(filtre) ? 'block' : 'none';
  });
}
