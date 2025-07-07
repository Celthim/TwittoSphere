const form : HTMLFormElement = document.getElementById('joinForm') as HTMLFormElement;
const pseudoInput : HTMLInputElement = document.getElementById('pseudo') as HTMLInputElement;
const joinButton : HTMLButtonElement = document.getElementById('joinButton') as HTMLButtonElement;
const errorMessage : HTMLDivElement = document.getElementById('errorMessage') as HTMLDivElement;

// Validation en temps réel
pseudoInput.addEventListener('input', function() {
    const pseudo = this.value.trim();
    const isValid = validateUsername(pseudo);
    
    if (pseudo.length > 0 && !isValid) {
        errorMessage.style.display = 'block';
        joinButton.disabled = true;
    } else {
        errorMessage.style.display = 'none';
        joinButton.disabled = false;
    }
});

// Validation du pseudo à l'aide d'une Expression Régulière
function validateUsername(pseudo : string) : boolean {
    const regex : RegExp = /^[a-zA-Z0-9_]{3,20}$/; // Entre 3 et 20 caractères alphanumériques
    return regex.test(pseudo);
}

// Soumission du formulaire
form.addEventListener('submit', function(e) {
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
window.addEventListener('load', function() {
    const savedPseudo = localStorage.getItem('username');
    if (savedPseudo) {
        window.location.href = 'home.html';
    }
    else{
        const container : HTMLDivElement = document.getElementById('welcomeContainer') as HTMLDivElement;
        container.style.opacity = '0';
        container.style.transform = 'translateY(1000px)';
        container.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
});