// Définition des URLs d'API
const urlWorks = "http://localhost:5678/api/works";
const urlCategories = "http://localhost:5678/api/categories";

// Fonction asynchrone pour récupérer des données depuis une URL
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur de requête réseau`);
  }
  return response.json();
}

// Fonction principale pour afficher les données dans la galerie et la modale
async function main() {
  try {
    // Récupération des données pour la galerie
    const data = await fetchData(urlWorks);
    const gallery = document.querySelector(".gallery");

    // Création des éléments de la galerie
    data.forEach((element) => {
      const project = createProject(element);
      gallery.appendChild(project);
    });
  } catch (error) {
    console.error(error);
  }

  try {
    // Récupération des données pour la modale
    const data = await fetchData(urlWorks);
    const galleryModale = document.querySelector(".project-modale");

    // Création des éléments de la modale
    data
      .map(createProjectElement)
      .forEach((projectModale) => galleryModale.appendChild(projectModale));
  } catch (error) {
    console.error(error);
  }
}

// Fonction pour créer un élément de projet dans la galerie
function createProject(element) {
  const project = document.createElement("figure");
  project.setAttribute("id", `gallery_${element.id}`);
  const img = document.createElement("img");
  img.setAttribute("alt", element.title);
  const imgTitle = document.createElement("figcaption");

  img.src = element.imageUrl;
  imgTitle.innerText = element.title;

  project.appendChild(img);
  project.appendChild(imgTitle);
  project.classList.add("project");

  if (element.category && element.category.name) {
    project.setAttribute("data-category", element.category.name);
  }
  return project;
}

// Fonction pour initialiser les filtres des catégories
function initCategories() {
  const filterSet = new Set();
  const filters = document.querySelectorAll(".filtres div");

  function setActiveFilter(filter) {
    filters.forEach((f) => f.classList.remove("active"));
    filter.classList.add("active");
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const filterName = filter.textContent.trim().toLowerCase();
      const projects = document.querySelectorAll(".project");

      projects.forEach((project) => {
        const projectCategory = project
          .getAttribute("data-category")
          .toLowerCase();
        project.style.display =
          filterName === "tous" || filterName === projectCategory
            ? "block"
            : "none";
      });

      setActiveFilter(filter);
    });

    if (filter.classList.contains("tous")) {
      setActiveFilter(filter);
    }

    filterSet.add(filter.textContent.trim());
  });
}

// Fonction pour vérifier si un utilisateur est connecté
function isConnected() {
  return !!sessionStorage.getItem("token");
}

// Configuration de la page en fonction de la connexion de l'utilisateur
function setupPage() {
  if (isConnected()) {
    const ModeEdition = document.querySelector(".ModeEdition");
    const loginLogoutButton = document.querySelector(".login_logout");
    const buttonModif = document.querySelector(".js-modal");
    const filters = document.querySelector(".filtres");

    ModeEdition.style.display = "flex";
    loginLogoutButton.innerText = "Logout";
    buttonModif.style.display = "flex";
    filters.style.display = "none";

    loginLogoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      window.location.replace("index.html");
    });
  }
}

// Fonction principale pour initialiser les différentes parties de la page
async function init() {
  await Promise.all([main(), initCategories(), setupPage()]);
}

// Appel de la fonction d'initialisation
init();

// Gestion de l'ouverture et de la fermeture de la fenêtre modale
const modalElements = document.querySelectorAll(".js-modal");
let activeModal = null;
const modal = document.querySelector(".modal");

function openModal(event) {
  event.preventDefault();
  const targetModalId = event.currentTarget.getAttribute("href").substring(1);
  const modalElement = document.getElementById(targetModalId);

  if (modalElement) {
    activeModal = modalElement;
    modalElement.style.display = "flex";
    modalElement.removeAttribute("aria-hidden");
    activeModal.addEventListener("click", closeModal);
    modalElement
      .querySelector(".fa-xmark")
      .addEventListener("click", closeModal);
    modalElement
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
  }
}

function closeModal() {
  if (!activeModal) return;
  activeModal.style.display = "none";
  activeModal.setAttribute("aria-hidden", true);
  activeModal.removeAttribute("aria-modal");
  activeModal.removeEventListener("click", closeModal);
  activeModal
    .querySelector(".fa-xmark")
    .removeEventListener("click", closeModal);
  activeModal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  activeModal = null;
}

function stopPropagation(event) {
  event.stopPropagation();
}

modalElements.forEach((element) => {
  element.addEventListener("click", openModal);
});

// Fonction pour créer un élément de projet dans la modale
function createProjectElement(element) {
  const projectModale = document.createElement("figure");
  projectModale.classList.add("project");
  projectModale.id = `project-${element.id}`;

  if (element.category && element.category.name) {
    projectModale.setAttribute("data-category", element.category.name);
  }

  const img = document.createElement("img");
  img.src = element.imageUrl;
  projectModale.appendChild(img);

  const corbeille = document.createElement("i");
  corbeille.classList.add("fa-solid", "fa-trash-can");
  const contentCorbeille = document.createElement("div");
  contentCorbeille.classList.add("trash");
  contentCorbeille.appendChild(corbeille);
  projectModale.appendChild(contentCorbeille);

  contentCorbeille.addEventListener("click", (event) => {
    handleTrashClick(element.id, event);
    event.preventDefault();
  });

  return projectModale;
}

// Fonction pour gérer le clic sur la corbeille
async function handleTrashClick(projectId, event) {
  event.preventDefault();
  const token = sessionStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch(
        `http://localhost:5678/api/works/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          accept: "application/json",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur de requête réseau");
      }

      const projectElement = document.getElementById(`project-${projectId}`);
      if (projectElement) {
        projectElement.remove();
      }

      const projectElementGallery = document.getElementById(
        `gallery_${projectId}`
      );
      if (projectElementGallery) {
        projectElementGallery.remove();
      }

      closeModal();
    } catch (error) {
      console.error(error);
    }
  }
}

// Gestion du passage du modal 1 au modal 2
const modale1 = document.querySelector(".modal-1");
const modale2 = document.querySelector(".modal-2");
const boutonAjouter = document.querySelector(".button1");
const leftArrow = document.querySelector(".fa-arrow-left");

boutonAjouter.addEventListener("click", (event) => {
  modale1.style.display = "none";
  modale2.style.display = "block";

  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".modal-2.js-modal-stop > .fa-xmark")
    .addEventListener("click", closeModal);
  modal
    .querySelector(".modal-2.js-modal-stop")
    .addEventListener("click", stopPropagation);
});

leftArrow.addEventListener("click", () => {
  modale2.style.display = "none";
  modale1.style.display = "flex";
});

// Gestion de l'envoi d'un nouveau projet au back-end via le formulaire de la modale
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("categories");
const addButton = document.querySelector(".btn_validate");
const addPhoto = document.querySelector(".ajoutPhoto");
const fileInput = document.getElementById("file");
let previousImage = null;

// Fonction pour gérer le changement de fichier
const handleFileChange = () => {
  const btnAddPhoto = document.querySelector(".button3");
  const addPhotoIcon = document.querySelector(".fa-image");
  const addPhotoInstructions = document.querySelector(".instruction");

  if (previousImage) {
    previousImage.remove();
  }

  if (fileInput.files.length > 0) {
    const photo = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.classList.add("uploaded-photo");
      previousImage = img;
      addPhoto.appendChild(img);
    };

    reader.readAsDataURL(photo);
    addPhotoIcon.style.display = "none";
    btnAddPhoto.style.display = "none";
    addPhotoInstructions.style.display = "none";
  }
};

// Fonction pour mettre à jour l'état du bouton de validation
function updateValidateButtonState() {
  const isValidTitle = titleInput.validity.valid;
  const isValidFile = fileInput.validity.valid;
  const isValidCategory = categorySelect.value !== "";

  const isValid = isValidTitle && isValidFile && isValidCategory;

  addButton.classList.toggle("valid", isValid);
}

// Ajout des fonctions lors des changements dans le formulaire
titleInput.addEventListener("input", updateValidateButtonState);
fileInput.addEventListener("change", handleFileChange);
categorySelect.addEventListener("change", updateValidateButtonState);

// Fonction pour réinitialiser le bouton "validate"
function resetValidateButton() {
  addButton.classList.remove("valid");
}

// Gestion de l'événement de soumission du formulaire
const handleSubmit = async (event) => {
  event.preventDefault();
  const title = titleInput.value;
  const category = categorySelect.value;
  const imageFile = fileInput.files[0];
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", imageFile);

  const isValidTitle = titleInput.validity.valid;
  const isValidFile = fileInput.validity.valid;
  const isValidCategory = categorySelect.value !== "";

  if (!isValidTitle || !isValidFile || !isValidCategory) {
    addPhoto.classList.toggle("invalid", !isValidFile);
    titleInput.classList.toggle("invalid", !isValidTitle);
    categorySelect.classList.toggle("invalid", !isValidCategory);
    return;
  }

  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(urlWorks, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      accept: "application/json",
    });

    if (!response.ok) {
      throw new Error("Erreur de requête réseau");
    }

    const element = await response.json();
    element.category = {
      name: categorySelect.options[categorySelect.selectedIndex].text,
    };

    // Ajout à la galerie
    const gallery = document.querySelector(".gallery");
    const project = createProject(element);
    gallery.appendChild(project);

    // Ajout à la modale
    const galleryModale = document.querySelector(".project-modale");
    const projectModale = createProjectElement(element);
    galleryModale.appendChild(projectModale);

    // Effacer les valeurs du formulaire après l'ajout réussi
    titleInput.value = "";
    fileInput.value = null;
    categorySelect.value = "";

    document.querySelector(".uploaded-photo").remove();
    document.querySelector(".button3").style.display = "block";
    document.querySelector(".fa-image").style.display = "block";
    document.querySelector(".instruction").style.display = "block";
    document.querySelector(".modal-2").style.display = "none";
    document.querySelector(".modal-1").style.display = "flex";

    closeModal();
    // Réinitialiser le bouton "validate"
    resetValidateButton();
  } catch (error) {
    console.error(error);
  }
};
// Gestion de l'événement de clic sur le bouton de validation
addButton.addEventListener("click", handleSubmit);

