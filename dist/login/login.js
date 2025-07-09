import { load_theme, toggle_theme } from "../utils/theme.js";
const form = document.getElementById('joinForm');
const pseudoInput = document.getElementById('pseudo');
const joinButton = document.getElementById('joinButton');
const errorMessage = document.getElementById('errorMessage');
const toggle_button = document.getElementById("themeToggleBtn");
// Validation en temps réel
pseudoInput.addEventListener('input', function () {
    const pseudo = this.value.trim();
    const isValid = validateUsername(pseudo);
    if (pseudo.length > 0 && !isValid) {
        errorMessage.style.display = 'block';
        joinButton.disabled = true;
    }
    else {
        errorMessage.style.display = 'none';
        joinButton.disabled = false;
    }
});
// Validation du pseudo à l'aide d'une Expression Régulière
function validateUsername(pseudo) {
    const regex = /^[a-zA-Z0-9_]{3,20}$/; // Entre 3 et 20 caractères alphanumériques
    return regex.test(pseudo);
}
// Soumission du formulaire
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const pseudo = pseudoInput.value.trim(); // Retire les espaces avant et après le pseudo
    if (!validateUsername(pseudo)) {
        errorMessage.style.display = 'block';
        return;
    }
    // Sauvegarder le pseudo
    localStorage.setItem('username', pseudo);
    // Animation de chargement
    joinButton.innerHTML = '⏳ Connexion en cours...';
    joinButton.disabled = true;
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1500);
});
// Vérifier si l'utilisateur est déjà connecté
window.addEventListener('load', function () {
    const savedPseudo = localStorage.getItem('username');
    if (savedPseudo) {
        window.location.href = 'home.html';
    }
    else {
        const container = document.getElementById('welcomeContainer');
        container.style.opacity = '0';
        container.style.transform = 'translateY(1000px)';
        setTimeout(() => {
            container.style.transition = 'all 0.5s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
});
toggle_button.addEventListener("click", () => {
    toggle_theme(toggle_button);
});
load_theme(toggle_button);
