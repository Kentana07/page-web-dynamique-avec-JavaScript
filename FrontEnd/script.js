// Définition des URLs pour les endpoints de l'API
const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

// Fonction asynchrone pour effectuer des requêtes fetch et récupérer des données
async function fetchData(url) {
  console.log("Fetching data from:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur de requête réseau`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagation de l'erreur pour une gestion ultérieure si nécessaire
  }
}

// Fonction pour créer un élément HTML représentant un projet dans la galerie
function createProject(elements) {
  console.log("Creating project for elements:", elements);

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

  // Retour du projet créé
  return project;
}

// Fonction pour initialiser les filtres
function initCategories() {
  console.log("Initializing categories");

  // Utilisation d'un objet Set pour stocker les filtres uniques
  const filterSet = new Set();
  const filters = document.querySelectorAll(".filtres .filter");

  // Fonction pour activer le filtre
  function setActiveFilter(filter) {
    console.log("Setting active filter:", filter);

    // Supprime la classe "active" de tous les filtres
    filters.forEach((f) => f.classList.remove("active"));
    // Ajoute la classe "active" et "selected" au filtre actif
    filter.classList.add("active", "selected");
  }

  // Écoute des clics sur les boutons de filtre
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      // Récupération du nom de la catégorie du filtre cliqué
      const filterName = filter.textContent.trim();
      console.log("Filter clicked:", filterName);

      // Filtrage des projets en fonction du nom de la catégorie
      const projects = document.querySelectorAll(".gallery .project");

      projects.forEach((project) => {
        const projectCategory = project.getAttribute("data-category");
        project.style.display =
          filterName === "Tous" || filterName === projectCategory
            ? "block"
            : "none";
      });

      // Mise en surbrillance du filtre actif
      setActiveFilter(filter);
    });

    // Mettez en surbrillance le filtre par défaut (ici, le premier filtre)
    if (filter.classList.contains("tous")) {
      setActiveFilter(filter);
    }

    // Ajout du filtre à l'objet Set pour s'assurer qu'il est unique
    filterSet.add(filter.textContent.trim());
  });

  // Affiche la liste unique des filtres dans la console
  console.log("Liste unique des filtres:", filterSet);
}

// Fonction principale pour afficher les projets dans la galerie
async function main() {
  console.log("Main function started");

  try {
    // Récupération des données depuis l'API
    const data = await fetchData(urlWorks);
    console.log("Data fetched:", data);

    // Sélection de l'élément HTML avec la classe "gallery"
    const gallery = document.querySelector(".gallery");
    console.log("Gallery selected:", gallery);

    // Parcours des données et création d'éléments HTML pour chaque projet
    data.forEach((elements) => {
      const project = createProject(elements);
      gallery.appendChild(project);
      console.log("Project added to gallery:", project);
    });
  } catch (error) {
    console.error("Error during main function:", error);
    // Gérer l'erreur de manière conviviale pour l'utilisateur si nécessaire
  }

  // Appel de la fonction pour initialiser les filtres après avoir chargé les projets
  initCategories();
}

// Appel de la fonction initiale
main();