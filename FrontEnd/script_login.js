// DOM
const mailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const sendInput = document.getElementById("send-input");
const errorDial = document.getElementById("error-message");
const loginUrl = "http://localhost:5678/api/users/login";

// Fonction asynchrone pour gérer l'authentification
async function logIn(data) {
  try {
    // Options de la requête POST
    const loginOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: data,
    };

    // Effectuer la requête POST avec fetch , attendre la réponse
    const response = await fetch(loginUrl, loginOptions);
    return await response.json(); // Parse la réponse en JSON
  } catch (err) {
    console.error("Erreur lors de la requête d'authentification :", err);
    throw err; // gérée dans le gestionnaire d'événements
  }
}
// Gestionnaire d'événements pour le clic
sendInput.addEventListener("click", async (event) => {
  try {
    event.preventDefault();

    // Vérification de la validité des champs
    const isValidEmail = mailInput.checkValidity();
    const isValidPassword = passwordInput.checkValidity();

    switch (true) {
      case !isValidEmail && !isValidPassword:
        errorDial.style.display = "block";
        break;
      case !isValidEmail:
        errorDial.innerText =
          "Adresse e-mail invalide ou Mot de passe invalide";
        break;
      case !isValidPassword:
        errorDial.innerText =
          "Adresse e-mail invalide ou Mot de passe invalide";
        break;
      default:
        errorDial.style.display = "none";
        break;
    }

    // Création d'un objet utilisateur au format JSON
    const user = JSON.stringify({
      email: mailInput.value,
      password: passwordInput.value,
    });
    console.log(user)
    // Appel de la fonction logIn avec les données utilisateur
    const response = await logIn(user);

    // Vérification de la réponse du serveur
    if (response.userId === 1) {
      // Stockage du token dans le sessionStorage
      sessionStorage.setItem("token", response.token);
      // Affichage du token 
      console.log("Token de connexion :", response.token);
      // Redirection vers la page index.html
      window.location.href = "index.html";
    } else {
      errorDial.style.display = "block";
    }
  } catch (err) {
    console.error(err);
  }
});

// Logs de test
console.log("Adresse e-mail de test : sophie.bluel@test.tld");
console.log("Mot de passe de test : S0phie");