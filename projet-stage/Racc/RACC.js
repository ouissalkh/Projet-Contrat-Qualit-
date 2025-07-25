 
 console.log("RACC.js chargé et exécuté");

 
 // ===== OPTIMISATIONS DE PERFORMANCE =====
        
        // Cache des éléments DOM pour éviter les recherches répétitives
        let elementsCache = {};
        let calculTimeout = null;
        let isCalculating = false;

        // Initialiser le cache des éléments
        function initializeCache() {
            elementsCache = {
                pointsMax: document.querySelectorAll(".pointsMax"),
                repartition: document.querySelectorAll(".repartition"),
                bonus: document.querySelectorAll(".Bonus"),
                reparHors: document.querySelectorAll(".repar_hors"),
                maxOKHORSRANG: document.querySelectorAll(".MaxOKHORSRANG"),
                resultatMax: document.querySelectorAll(".ResultatMax"),
                resultatBonus: document.querySelectorAll(".ResultatBonus"),
                performance: document.querySelectorAll(".performance"),
                
                // Éléments de total
                totalPointsMax: document.getElementById("totalPointsMax"),
                totalRepartition: document.getElementById("totalRepartition"),
                totalBonus: document.getElementById("TotalBonus"),
                totalrepHors: document.getElementById("totalrep_hors"),
                totalMaxHORSRANG: document.getElementById("totalMaxHORSRANG"),
                totalResultatMAX: document.getElementById("TotalResultatMAX"),
                totalResultatBonus: document.getElementById("TotalResultatBonus"),
                totalPerformance: document.getElementById("totalPerformance"),
                resultatContratQualite: document.getElementById("resultat_contrat_qualite")
            };
            console.log('Cache initialisé:', elementsCache);
        }

        // Debouncing pour éviter les calculs trop fréquents
        function calculerAvecDebounce() {
            if (calculTimeout) {
                clearTimeout(calculTimeout);
            }
            calculTimeout = setTimeout(() => {
                if (!isCalculating) {
                    isCalculating = true;
                    initialiserCalculs();
                    isCalculating = false;
                }
            }, 150); // Attendre 150ms après la dernière modification
        }

        // ===== FONCTIONS DE CHARGEMENT (INCHANGÉES) =====
        function chargerTousLesTaux() {
            let mois = document.getElementById("filterMonth").value;
            let annee = document.getElementById("filterYear").value;
            
            if (!mois || !annee) {
                alert("Merci de choisir un mois ET une année !");
                return;
            }
            fetch(`taux.php?mois=${mois}&annee=${annee}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "ok") {
                        // Mise à jour de tous les indicateurs
                        Object.entries(data.taux).forEach(([id, taux]) => {
                            const element = document.getElementById(id);
                            if (element) {
                                // Formatage spécifique pour les pourcentages
                                element.textContent = typeof taux === 'number' ? taux.toFixed(2) + '%' : taux;
                            }
                        });
                        
                        // Calcul automatique des bonus
                        initialiserCalculs();
                        
                        // Mise à jour spécifique des totaux
                        calculerTotalPointsMax();
                        calculerTotalRepartition();
                        calculerTotalBonus();
                        calculerTotalResultatMAX();
                        calculerTotalResultatBonus();
                        calculerTotalBONUSPERFORMANCE();
                        calculerTotalReparHors();
                        calculerTotalMAXHors();
                        calculerResultatContratQualite();
                        
                    } else {
                        // Gestion des erreurs
                        const ids = [
                            "taux_zone_a_plp", "taux_zone_b_plp", "taux_zone_c_plp",
                            "taux_zone_a_hotline", "taux_zone_b_hotline", "taux_zone_c_hotline",
                            "taux_zone_a_construction", "taux_zone_b_construction", "taux_zone_c_construction",
                            "taux_hors_rang_a", "taux_hors_rang_b", "taux_hors_rang_c",
                            "delai_prise_1er_rdv", "taux_report"
                        ];
                        
                        ids.forEach(id => {
                            const element = document.getElementById(id);
                            if (element) element.textContent = "N/A";
                        });
                    }
                })
                .catch(error => {
                    console.error("Erreur fetch:", error);
                    document.querySelectorAll("[id^='taux_'], #delai_prise_1er_rdv, #taux_report").forEach(el => {
                        el.textContent = "Erreur";
                    });
                });
        }
        
        // ===== FONCTIONS DE CALCUL OPTIMISÉES (LOGIQUE INCHANGÉE) =====
        
        function calculerTotalPointsMax() {
            let total = 0;
            elementsCache.pointsMax.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalPointsMax) {
                elementsCache.totalPointsMax.innerText = total.toFixed();
            }
        }

        function calculerTotalRepartition() {
            let total = 0;
            elementsCache.repartition.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalRepartition) {
                elementsCache.totalRepartition.innerText = total.toFixed()+"%";
            }
        }

        function calculerTotalBonus() {
            let total = 0;
            elementsCache.bonus.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalBonus) {
                elementsCache.totalBonus.innerText = total.toFixed(2);
            }
        }

        function calculerTotalReparHors() {
            let total = 0;
            elementsCache.reparHors.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalrepHors) {
                elementsCache.totalrepHors.innerText = total.toFixed()+"%";
            }
        }

        function calculerTotalMAXHors() {
            let total = 0;
            elementsCache.maxOKHORSRANG.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalMaxHORSRANG) {
                elementsCache.totalMaxHORSRANG.innerText = total.toFixed();
            }
        }

        function calculerTotalResultatMAX() {
            let total = 0;
            elementsCache.resultatMax.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalResultatMAX) {
                elementsCache.totalResultatMAX.innerText = total.toFixed(2);
            }
        }

        function calculerTotalResultatBonus() {
            let total = 0;
            elementsCache.resultatBonus.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalResultatBonus) {
                elementsCache.totalResultatBonus.innerText = total.toFixed(2);
            }
        }

        function calculerTotalBONUSPERFORMANCE() {
            let total = 0;
            elementsCache.performance.forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) {
                    total += val;
                }
            });
            if (elementsCache.totalPerformance) {
                elementsCache.totalPerformance.innerText = total.toFixed(2);
            }
        }

        function calculerResultatContratQualite() {
            let total = 0;
            // Utiliser le cache pour tous les éléments bonus
            [...elementsCache.bonus, ...elementsCache.performance, ...elementsCache.resultatBonus].forEach(cell => {
                const val = parseFloat(cell.innerText);
                if (!isNaN(val)) total += val;
            });
            total += 90; // ajout fixe
            if (elementsCache.resultatContratQualite) {
                elementsCache.resultatContratQualite.innerText = total.toFixed(2);
            }
        }

        // ===== FONCTIONS EXPORT (INCHANGÉES) =====
        
        function exportExcel() {
            var wb = XLSX.utils.table_to_book(document.getElementById('monTableau'), {sheet:"Feuille1"});
            XLSX.writeFile(wb, 'tableau.xlsx');
        }

        function exportPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.autoTable({ html: '#monTableau' });
            doc.save('tableau.pdf');
        }

        // ===== FONCTIONS UTILITAIRES (INCHANGÉES) =====
        
        function parsePercent(text) {
            if (!text) return NaN;
            return parseFloat(text.replace('%', '').trim());
        }

        function calculerBonusLigne(row) {
            const resultatCell = row.cells[2];   
            const pointMinCell = row.cells[4];   
            const pointMaxCell = row.cells[5];   
            const pointsMaxCell = row.cells[6];  
            const bonusCell = row.cells[7]; 
            
            

            if (!resultatCell || !pointMinCell || !pointMaxCell || !pointsMaxCell || !bonusCell) return;

            let resultat = parsePercent(resultatCell.textContent);
            let pointMin = parsePercent(pointMinCell.textContent);
            let pointMax = parsePercent(pointMaxCell.textContent);
            let pointsMax = parseFloat(pointsMaxCell.textContent.trim());

            // ++=
            console.log("Calcul bonus ligne", {
                            resultat,
                            pointMin,
                            pointMax,
                            pointsMax,
                            bonusCell
                            });

            if ([resultat, pointMin, pointMax, pointsMax].some(v => isNaN(v))) {
                bonusCell.textContent = '';
                return;
            }

            let bonus = 0;
            if (resultat <= pointMin) {
                bonus = 0;
            } else if (resultat >= pointMax) {
                bonus = pointsMax;
            } else {
                bonus = ((resultat - pointMin) / (pointMax - pointMin)) * pointsMax;
            }

            bonusCell.textContent = bonus.toFixed(2);
        }

        function calculerBonusSpecialLigne(row) {
            const cells = row.cells;
            if (cells.length < 8) return;

            const titre = cells[0].textContent.trim();
            
            const titresSpeciaux = [
                "Transformation des GEM",
                "Satcli (sur RDV NOK)",
                "Satcli (sur RDV OK)",
                "Taux de report",
                "Délai de prise du 1er RDV"
            ];

            if (!titresSpeciaux.includes(titre)) return;

            const resultat = parsePercent(cells[2].textContent);
            const pointMin = parsePercent(cells[4].textContent);
            const pointMax = parsePercent(cells[5].textContent);
            const pointsMax = parseFloat(cells[6].textContent);

            if ([resultat, pointMin, pointMax, pointsMax].some(isNaN)) {
                cells[7].textContent = '';
                return;
            }

            let bonus = 0;
            if (resultat <= pointMin) bonus = 0;
            else if (resultat >= pointMax) bonus = pointsMax;
            else bonus = ((resultat - pointMin) / (pointMax - pointMin)) * pointsMax;

            cells[7].textContent = bonus.toFixed(2);
        }

        // ===== INITIALISATION OPTIMISÉE =====
        
        function initialiserCalculs() {
            // Tous les calculs de totaux
            calculerTotalPointsMax();
            calculerTotalRepartition();
            calculerTotalBonus();
            calculerTotalReparHors();
            calculerTotalMAXHors();
            calculerTotalResultatMAX();
            calculerTotalResultatBonus();
            calculerTotalBONUSPERFORMANCE();

            // Calcul des bonus pour chaque ligne
            document.querySelectorAll("#monTableau tr").forEach(row => {
                if (row.querySelector('.Bonus') || row.querySelector('.performance')) {
                    calculerBonusLigne(row);
                }
            });

            // Calcul des bonus spéciaux
            const titresSpeciaux = [
                "Transformation des GEM",
                "Satcli (sur RDV NOK)",
                "Satcli (sur RDV OK)",
                "Taux de report",
                "Délai de prise du 1er RDV",
                "Contrat Qualité"
            ];

            document.querySelectorAll("#monTableau tr").forEach(row => {
                const titre = row.cells[0]?.textContent?.trim();
                if (titresSpeciaux.includes(titre)) {
                    calculerBonusSpecialLigne(row);
                }
            });

            calculerResultatContratQualite();
        }

        // ===== EVENT LISTENERS OPTIMISÉS =====
        
        function attacherEventListeners() {
            // Un seul event listener pour toute la table
            document.getElementById('monTableau').addEventListener('input', function(e) {
                const cell = e.target;
                const row = cell.closest('tr');
                
                if (!row) return;

                // Calculs ciblés selon la classe de la cellule modifiée
                if (cell.classList.contains('pointsMax')) {
                    calculerTotalPointsMax();
                } else if (cell.classList.contains('repartition')) {
                    calculerTotalRepartition();
                } else if (cell.classList.contains('Bonus')) {
                    calculerBonusLigne(row);
                    calculerTotalBonus();
                } else if (cell.classList.contains('repar_hors')) {
                    calculerTotalReparHors();
                } else if (cell.classList.contains('MaxOKHORSRANG')) {
                    calculerTotalMAXHors();
                } else if (cell.classList.contains('ResultatMax')) {
                    calculerTotalResultatMAX();
                } else if (cell.classList.contains('ResultatBonus')) {
                    calculerBonusSpecialLigne(row);
                    calculerTotalResultatBonus();
                } else if (cell.classList.contains('performance')) {
                    calculerBonusLigne(row);
                    calculerTotalBONUSPERFORMANCE();
                } else {
                    // Pour les autres cellules, recalculer les bonus de la ligne
                    if (row.querySelector('.Bonus') || row.querySelector('.performance') || row.querySelector('.ResultatBonus')) {
                        calculerBonusLigne(row);
                        calculerBonusSpecialLigne(row);
                    }
                }

                // Recalcul final avec debounce
                calculerAvecDebounce();
            });
            console.log("Event listener attaché à #monTableau");
        }

        // ===== TOGGLE BUTTONS (INCHANGÉ) =====
        
        function initialiserToggleButtons() {
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const parentRow = btn.closest('tr');
                    const parentId = parentRow.dataset.id;
                    const children = document.querySelectorAll(`.child-of-${parentId}`);
                    const isHidden = children[0].style.display === 'none' || children[0].style.display === '';
                    
                    children.forEach(row => {
                        row.style.display = isHidden ? 'table-row' : 'none';
                    });
                    
                    btn.textContent = isHidden ? '▼' : '►';
                });
            });
        }

        // ===== DROPDOWN EXPORT =====
        
        document.getElementById('exportBtn').addEventListener('click', function() {
            document.getElementById('exportMenu').classList.toggle('show');
        });

        // Fermer le dropdown si on clique ailleurs
        window.addEventListener('click', function(e) {
            if (!e.target.matches('.export-btn')) {
                const dropdown = document.getElementById('exportMenu');
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        });

        // ===== INITIALISATION GLOBALE =====
        
        window.addEventListener('load', () => {
            initializeCache(); // Initialiser le cache en premier
            initialiserCalculs();
            attacherEventListeners();
            initialiserToggleButtons();
        });

        // Réinitialiser le cache si la structure change
        window.addEventListener('resize', () => {
            initializeCache();
        });







        // ++++
        function chargerTousLesTaux(dataOrEvent) {
            if (dataOrEvent && dataOrEvent.status === "ok" && dataOrEvent.taux) {
                // Cas où on reçoit les données JSON à afficher
                mettreAJourTauxDansDOM(dataOrEvent.taux);
            } else {
                // Cas où on est appelé par un événement (changement filtre)
                const mois = document.getElementById('filterMonth').value;
                const annee = document.getElementById('filterYear').value;

                fetch(`Racc/taux.php?mois=${mois}&annee=${annee}`, {
                headers: { "X-Requested-With": "XMLHttpRequest" }
                })
                .then(response => {
                    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
                    return response.json();
                })
                .then(jsonData => {
                    if (jsonData.status === "ok") {
                    mettreAJourTauxDansDOM(jsonData.taux);
                    } else {
                    console.error("Données invalides reçues");
                    }
                })
                .catch(err => {
                    console.error("Erreur fetch filtres:", err);
                });
            }
            }

            function mettreAJourTauxDansDOM(taux) {
            for (const [id, val] of Object.entries(taux)) {
                const el = document.getElementById(id);
                if (el) {
                el.textContent = (typeof val === "number") ? val.toFixed(2) + "%" : val;
                }
            }
            }
//  ++++
        function mettreAJourBonus(data) {
            const listeBonus = [
                "bonus_zone_a_plp",
                "bonus_zone_b_plp",
                "bonus_zone_c_plp",
                "bonus_zone_a_hotline",
                "bonus_zone_b_hotline",
                "bonus_zone_c_hotline",
                "bonus_zone_a_construction",
                "bonus_zone_b_construction",
                "bonus_zone_c_construction",
                // ajoute ici d'autres ids bonus si besoin
            ];

            listeBonus.forEach(id => {
                const elem = document.getElementById(id);
                if (elem && data[id] !== undefined) {
                elem.textContent = data[id];  // ou formatte la valeur si nécessaire
                }
            });
            }
