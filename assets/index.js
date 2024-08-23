async function getProject() {
    const works = await fetch("http://localhost:5678/api/works");
    console.log(works);
    const worksJson = await works.json();
    console.log(worksJson);
    return worksJson;
}

async function getCategories() {
    const categories = await fetch("http://localhost:5678/api/categories");
    console.log(categories);
    const categoriesJson = await categories.json();
    console.log(categoriesJson);
    return categoriesJson;
}

const baliseLogin = document.getElementById("login");

baliseLogin.addEventListener("click", function () {
    location.assign("./login.html");
});

async function displayCategories() {
    const categories = await getCategories();
    categories.unshift({ id: 0, name: "Tous", class: "categorieSelected" });
    const baliseCategories = document.querySelector(".categories");

    categories.forEach((categorie) => {
        const baliseCategorie = document.createElement("a");
        baliseCategorie.id = categorie.id;
        baliseCategorie.classList.add("categorie");
        if (baliseCategorie.id == 0) {
            baliseCategorie.classList.add("categorieSelected");
        }
        baliseCategorie.textContent = categorie.name;

        baliseCategorie.addEventListener("click", function () {
            let categorieSelected = document.querySelector(".categorieSelected");
            categorieSelected.classList.remove("categorieSelected");
            let currentCategorie = document.getElementById(baliseCategorie.id);
            currentCategorie.classList.add("categorieSelected");
            const baliseFigures = document.querySelectorAll(".gallery figure");
            baliseFigures.forEach((figure) => {
                if (baliseCategorie.id == figure.dataset.id || baliseCategorie.id == 0) {
                    figure.style.display = "block";
                }
                else {
                    figure.style.display = "none";
                }
            })
        });
        baliseCategories.appendChild(baliseCategorie);
    });
}

async function displayProject() {
    const portfolioItems = await getProject();
    const baliseGallery = document.querySelector(".gallery");

    baliseGallery.innerHTML = ""
    portfolioItems.forEach((portfolioItem) => {
        const baliseFigure = document.createElement("figure");
        const baliseImg = document.createElement("img");
        const baliseFigcaption = document.createElement("figcaption");

        baliseImg.src = portfolioItem.imageUrl;
        baliseImg.alt = portfolioItem.title;
        baliseFigcaption.textContent = portfolioItem.title;
        baliseFigure.dataset.id = portfolioItem.categoryId;
        baliseFigure.dataset.projectId = portfolioItem.id;

        baliseFigure.appendChild(baliseImg);
        baliseFigure.appendChild(baliseFigcaption);
        baliseGallery.appendChild(baliseFigure);

    });
}

displayCategories()
displayProject()