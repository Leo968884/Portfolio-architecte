async function postLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = JSON.stringify({ email, password });

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
    });
    const user = await response.json();

    if (!response.ok) {
        snackbarError('E-mail ou Mot de passe incorrect');
    } else {
        localStorage.setItem('token', user.token);
        location.assign("./index.html");
    }
}

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");

// Créer les éléments pour les messages d"erreur
const emailError = document.createElement("p");
emailError.className = "error-message";
emailInput.insertAdjacentElement("afterend", emailError);
const passwordError = document.createElement("p");
passwordError.className = "error-message";
passwordInput.insertAdjacentElement("afterend", passwordError);

function validateEmail() {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailInput.value === "") {
        emailError.textContent = "Le champ E-mail est vide";
        emailInput.classList.add("error-field");
        return true;
    }
    else if (!emailRegEx.test(emailInput.value)) {
        emailError.textContent = 'Le format de l\'adresse e-mail est invalide';
        emailInput.classList.add("error-field");
        return true;
    }
    else {
        emailError.textContent = "";
        emailInput.classList.remove("error-field");
        return false;
    }
}

function validatePassword() {
    if (passwordInput.value === "") {
        passwordError.textContent = "Le champ Mot de passe est vide";
        passwordInput.classList.add("error-field");
        return true;
    }
    else {
        passwordError.textContent = "";
        passwordInput.classList.remove("error-field");
        return false;
    }
}

function validateForm() {
    let hasError = false;

    hasError = validateEmail() || hasError;
    hasError = validatePassword() || hasError;

    return hasError;
}

function snackbarError(message) {
    const snackbar = document.createElement('div');
    snackbar.className = 'snackbar';
    snackbar.textContent = message;
    document.body.appendChild(snackbar);
    setTimeout(() => {
        document.body.removeChild(snackbar);
    }, 3000);
}

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (!validateForm()) {
        postLogin()
    }
});