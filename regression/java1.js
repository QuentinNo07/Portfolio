document.addEventListener("DOMContentLoaded", () => {
    const fileUpload = document.getElementById("file-upload");
    const addRowButton = document.getElementById("add-row");
    const calculateButton = document.getElementById("calculate");
    const dataTable = document.querySelector(".data-table tbody");
    const regressionButtons = document.querySelectorAll(".choix_regression button");
    const resultDiv = document.querySelector(".resultat.parties");
    const representation = document.getElementById("representation")
    const afficher_equation= document.getElementById("affichage_equa")
    const regenerateButton = document.getElementById("regenerer");

    let regressionType = "linéaire"; // Par défaut
    let data = []; // Stockage des données
    let chart; // Déclare la variable chart globalement

    // Gestion du téléchargement de fichier
    fileUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                parseCSV(content);
            };
            reader.readAsText(file, "UTF-8");
        }
    });

    function parseCSV(content) {
        data = []; // Réinitialisation des données
        const rows = content.split("\n");
        rows.forEach(row => {
            const [x, y] = row.split(";").map(value => {
                // Remplacer les virgules par des points
                return Number(value.replace(",", "."));
            });
            if (!isNaN(x) && !isNaN(y)) {
                data.push({ x, y });
            }
        });
        alert("Fichier chargé avec succès : " + data.length + " points importés.");
    }

    // Ajouter une ligne manuellement
    addRowButton.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="number" placeholder="Valeur X" /></td>
            <td><input type="number" placeholder="Valeur Y" /></td>
            <td><button class="delete-row">🗑️ Supprimer</button></td>
        `;
        dataTable.appendChild(newRow);

        // Ajouter un événement pour supprimer la ligne
        newRow.querySelector(".delete-row").addEventListener("click", () => {
            newRow.remove();
        });
    });

    // Choisir le type de régression
    regressionButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            regressionType = event.target.textContent.trim();
            if (regressionType === "régression degré") {
                // Afficher l'input pour saisir le degré
                degree = parseInt(document.getElementById("degre-input").value) || 2; // Valeur par défaut 2 si non spécifiée
            }
            calculateButton.textContent = `Calculer (choix : ${regressionType})`;
            representation.textContent = `Représentation : ${regressionType}`;
        });
    });

    // Calculer la régression
    calculateButton.addEventListener("click", () => {
        if (data.length == 0) {        
            const rows = dataTable.querySelectorAll("tr");
            rows.forEach(row => {
                const inputs = row.querySelectorAll("input");
                const x = parseFloat(inputs[0].value);
                const y = parseFloat(inputs[1].value);
                if (!isNaN(x) && !isNaN(y)) {
                    data.push({ x, y });
                }
            });
        }
    
        if (data.length < 2) {
            alert("Veuillez entrer au moins deux points.");
            return;
        }
    
        let result;
        if (regressionType.includes("linéaire")) {
            result = linearRegression(data);
        } else if (regressionType.includes("exponentielle")) {
            result = exponentialRegression(data);
        } else if (regressionType.includes("carré")) {
            result = quadraticRegression(data);
        } else if (regressionType.includes("degré")) {
            result = degreRegression(data, degree);
        }
    
        // Afficher les résultats
        displayResults(result);
    });

    
    function linearRegression(data) {
        const n = data.length;
        const sumX = data.reduce((sum, point) => sum + point.x, 0);
        const sumY = data.reduce((sum, point) => sum + point.y, 0);
        const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
        const sumX2 = data.reduce((sum, point) => sum + point.x ** 2, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
        const intercept = (sumY - slope * sumX) / n;

        // Prédictions de Y pour chaque X
        const predictions = data.map(point => ({ x: point.x, y: slope * point.x + intercept }));

        return {
            type: "linéaire",
            equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
            predictions: predictions // Ajouter les prédictions
        }; 
    }

   
    regenerateButton.addEventListener("click", () => {
    // Effacer le graphique existant
        if (chart) {
            chart.destroy();  // Détruire l'ancien graphique
        }
        data=[]
        afficher_equation.textContent = `Equation : `;
        calculateButton.textContent = `Calculer (choix : )`;
        representation.textContent = `Representation : `
    });
    


    const downloadButton = document.getElementById("telecharger");
        downloadButton.addEventListener("click", () => {
            const imageUrl = chart.toBase64Image();
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "graphique.png";
            link.click();
    });

    function displayResults(result) {
        if (!resultDiv) {
            alert("Section des résultats manquante.");
            return;
        }
    
        const ctx = document.getElementById("myChart").getContext("2d");
        const dataPoints = data.map(point => ({ x: point.x, y: point.y }));
        const regressionLine = result.predictions.map(point => ({ x: point.x, y: point.y }));
    
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Données',
                        data: dataPoints,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: `Régression ${result.type}`,
                        data: regressionLine,
                        type: 'line',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        });
    
        afficher_equation.textContent = `Équation : ${result.equation}`;
    } 
});
