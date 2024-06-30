// Página inicial de Login
import { AUTHORS_ENDPOINT, MANAGERS_ENDPOINT } from '../utils/constants.js';
import { displayMessage } from '../utils/elements.js';
import { decrypt, encrypt } from '../utils/encryption.js';

async function isUserValid({ email, password }) {
    try {
        const authorsResponse = await fetch(`${AUTHORS_ENDPOINT}?email=${email}`);
        const authors = await authorsResponse.json();

        if (await checkUserPassword(authors, password)) return true;

        const managersResponse = await fetch(`${MANAGERS_ENDPOINT}?email=${email}`);
        const managers = await managersResponse.json();

        if (await checkUserPassword(managers, password)) return true;
        else return false;
    } catch (error) {
        console.error('Email ou senha incorreto(s):', error);
        displayMessage('Email ou senha incorreto(s):');
    }
}

async function checkUserPassword(users, password) {
    for (let i = 0; i < users.length; ++i) {
        const decryptedPassword = await decrypt(JSON.parse(users[i].password))

        if (decryptedPassword === password) {
            delete users[i].password;
            sessionStorage.setItem('user', JSON.stringify(await encrypt(JSON.stringify(users[i]))));
            return true;
        }
    }
}

async function login(event) {
    // Cancela a submissão do formulário para tratar sem fazer refresh da tela
    event.preventDefault();
    const userCredentials = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };

    if (await isUserValid(userCredentials)) {
        window.location = "news.html";
    } else {
        // Se login falhou, avisa ao usuário
        alert("Usuário ou senha incorretos");
    }
}

export function logoutUser() {
    sessionStorage.setItem('user', JSON.stringify({}));
    window.location = "index.html";
}

export async function redirectUnauthorized(minimumAccessLevel) {
    const hasEncryptedUser = JSON.parse(sessionStorage.getItem('user')) ?? {};

    if (Object.keys(hasEncryptedUser).length === 0) {
        window.location = "login.html";
        return;
    }

    const user = JSON.parse(await decrypt(hasEncryptedUser));

    if (minimumAccessLevel < user.accessLevel) {
        window.location = "login.html";
        return;
    }

    return user;
}

// Associa a funçao processaFormLogin  formulário adicionado um manipulador do evento submit
window.onload = () => {
    document.getElementById("login-form")
            .addEventListener("submit", login);
}
