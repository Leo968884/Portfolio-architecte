// Fonction asynchrone pour récupérer les projets depuis l'API
async function getProject() {
    // Fetch les données depuis l'URL spécifiée
    const works = await fetch("http://localhost:5678/api/works");
    // Convertit la réponse en JSON
    const worksJson = await works.json();
    // Retourne les données JSON
    return worksJson;
}

// Fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
    // Fetch les données depuis l'URL spécifiée
    const categories = await fetch("http://localhost:5678/api/categories");
    // Convertit la réponse en JSON
    const categoriesJson = await categories.json();
    // Retourne les données JSON
    return categoriesJson;
}

// Fonction asynchrone pour afficher les projets dans la galerie
async function displayProject() {
    // Récupère les projets depuis l'API
    const portfolioItems = await getProject();
    // Sélectionne l'élément de la galerie dans le DOM
    const baliseGallery = document.querySelector(".gallery");

    // Pour chaque projet, crée et ajoute les éléments correspondants dans la galerie
    portfolioItems.forEach((portfolioItem) => {
        const baliseFigure = document.createElement("figure");
        const baliseImg = document.createElement("img");
        const baliseFigcaption = document.createElement("figcaption");

        // Définit les attributs de l'image
        baliseImg.src = portfolioItem.imageUrl;
        baliseImg.alt = portfolioItem.title;
        // Définit le contenu de la légende
        baliseFigcaption.textContent = portfolioItem.title;
        // Définit les attributs de données pour la figure
        baliseFigure.dataset.id = portfolioItem.categoryId;
        baliseFigure.dataset.projectId = portfolioItem.id;

        // Ajoute les éléments à la figure
        baliseFigure.appendChild(baliseImg);
        baliseFigure.appendChild(baliseFigcaption);
        // Ajoute la figure à la galerie
        baliseGallery.appendChild(baliseFigure);
    });
}

// Fonction asynchrone pour afficher les catégories
async function displayCategories() {
    // Récupère les catégories depuis l'API
    const categories = await getCategories();
    // Ajoute une catégorie "Tous" au début de la liste
    categories.unshift({ id: 0, name: "Tous" });
    // Sélectionne l'élément des catégories dans le DOM
    const baliseCategories = document.querySelector(".categories");

    // Pour chaque catégorie, crée et ajoute les éléments correspondants
    categories.forEach((categorie) => {
        const baliseCategorie = document.createElement("a");
        baliseCategorie.id = categorie.id;
        baliseCategorie.classList.add("categorie");
        // Si la catégorie est "Tous", ajoute la classe "categorieSelected"
        if (baliseCategorie.id == 0) {
            baliseCategorie.classList.add("categorieSelected");
        }
        // Définit le contenu de la catégorie
        baliseCategorie.textContent = categorie.name;

        // Ajoute un écouteur d'événement pour le clic sur la catégorie
        baliseCategorie.addEventListener("click", function () {
            // Sélectionne la catégorie actuellement sélectionnée et retire la classe "categorieSelected"
            let categorieSelected = document.querySelector(".categorieSelected");
            categorieSelected.classList.remove("categorieSelected");
            // Sélectionne la catégorie cliquée et ajoute la classe "categorieSelected"
            let currentCategorie = document.getElementById(baliseCategorie.id);
            currentCategorie.classList.add("categorieSelected");
            // Sélectionne toutes les figures dans la galerie
            const baliseFigures = document.querySelectorAll(".gallery figure");
            // Pour chaque figure, affiche ou masque en fonction de la catégorie sélectionnée
            baliseFigures.forEach((figure) => {
                if (baliseCategorie.id == figure.dataset.id || baliseCategorie.id == 0) {
                    figure.style.display = "block";
                } else {
                    figure.style.display = "none";
                }
            });
        });
        // Ajoute la catégorie à l'élément des catégories
        baliseCategories.appendChild(baliseCategorie);
    });
}

// Sélectionne l'élément de connexion dans le DOM
const baliseLogin = document.getElementById("login");

// Ajoute un écouteur d'événement pour le clic sur l'élément de connexion
baliseLogin.addEventListener("click", function () {
    // Redirige l'utilisateur vers la page de connexion
    location.assign("./login.html");
});

// Appelle les fonctions pour afficher les catégories et les projets
displayCategories();
displayProject();
