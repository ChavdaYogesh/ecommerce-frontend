// Import Firebase SDK
import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- 1. Define Functions First ---

function showSignup() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
    // clear error if it exists
    const err = document.getElementById('signup-error');
    if(err) err.style.display = 'none';
}

function showLogin() {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    const icon = input.parentElement.querySelector('.toggle-pass');
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// --- 2. Attach to Window (So HTML can see them) ---
window.showSignup = showSignup;
window.showLogin = showLogin;
window.togglePassword = togglePassword;

// --- 3. Event Listeners for Forms ---
const loginFormTag = document.querySelector('#login-form-element');
const signupFormTag = document.querySelector('#signup-form-element');

if (loginFormTag) {
    loginFormTag.addEventListener('submit', handleLogin);
}
if (signupFormTag) {
    signupFormTag.addEventListener('submit', handleSignup);
}

// --- 4. Auth Logic ---

async function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;
    const confirmPass = document.getElementById('signup-confirm').value;

    if (pass !== confirmPass) {
        alert("Passwords do not match.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("Account Created!");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        alert("Login Failed: " + error.message);
    }
}

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) console.log("User is signed in:", user.email);
});