// Définition des URLs pour les endpoints de l'API
const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

// Fonction asynchrone pour effectuer des requêtes fetch et récupérer des données
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur de requête réseau`);
    }

    return response.json();
}

// Fonction principale pour afficher les projets dans la galerie
async function main() {
    // Récupération des données depuis l'API
    const data = await fetchData(urlWorks);

    try {
        // Sélection de l'élément HTML avec la classe "gallery"
        const gallery = document.querySelector(".gallery");

        // Parcours des données et création d'éléments HTML pour chaque projet
        data.forEach((elements) => {
            const project = createProject(elements);
            gallery.appendChild(project);
        });
    } catch (error) {
        console.error(error);
    }

    // Appel de la fonction pour initialiser les filtres après avoir chargé les projets
    initCategories();
}

// Fonction pour créer un élément HTML représentant un projet dans la galerie
function createProject(elements) {
    // Création des éléments HTML (figure, img, figcaption)
    const project = document.createElement("figure");
    const img = document.createElement("img");
    const imgTitle = document.createElement("figcaption");

    // Attribution des attributs et du contenu
    img.src = elements.imageUrl;
    imgTitle.innerText = elements.title;

    // Attachement des éléments au projet
    project.appendChild(img);
    project.appendChild(imgTitle);

    // Ajout de classe et attribut pour la catégorie
    project.classList.add("project");
    project.setAttribute("data-category", elements.category.name);

    return project; // Retour du projet créé
}

// Fonction pour initialiser les filtres
function initCategories() {
    const filterSet = new Set(); // Utilisation d'un objet Set pour stocker les filtres uniques
    const filters = document.querySelectorAll(".filtres .filter");

    function setActiveFilter(filter) {
        // Fonction pour activer le filtre
        filters.forEach((f) => f.classList.remove("active"));
        filter.classList.add("active");
    }

    filters.forEach((filter) => {
        // Écoute des clics sur les boutons de filtre
        filter.addEventListener("click", () => {
            // Récupération du nom de la catégorie du filtre cliqué
            const filterName = filter.textContent.trim();

            // Filtrage des projets en fonction du nom de la catégorie
            const projects = document.querySelectorAll(".gallery .project");

            projects.forEach((project) => {
                const projectCategory = project.getAttribute("data-category");
                project.style.display =
                    filterName === "Tous" || filterName === projectCategory ? "block" : "none";
            });

            setActiveFilter(filter); // Mise en surbrillance du filtre actif
        });

        if (filter.classList.contains("tous")) {
            // Mettez en surbrillance le filtre par défaut (ici, le premier filtre)
            setActiveFilter(filter);
        }

        filterSet.add(filter.textContent.trim()); // Ajout du filtre à l'objet Set pour s'assurer qu'il est unique
    });

    console.log("Liste unique des filtres:", filterSet);
}

// Appel de la fonction initiale
main();
