import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signOut } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore, setDoc, doc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBPTiuiW9Os0ocIApZnTzxwGc_LLKgoQ3U",
    authDomain: "frontend-prova-utfpr.firebaseapp.com",
    projectId: "frontend-prova-utfpr",
    storageBucket: "frontend-prova-utfpr.appspot.com",
    messagingSenderId: "722609539660",
    appId: "1:722609539660:web:c5d0caf847f2caf98f82e9",
    measurementId: "G-1G4V2NFVTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//criar usuario, salvando nome, email, sexo e data de nascimento no firestore
function criarConta(event) {
    event.preventDefault()
    var email = document.getElementById("email").value
    var senha = document.getElementById("senha").value
    var sexo = document.querySelector('input[name="sexo"]:checked') ? document.querySelector('input[name="sexo"]:checked').value : null;
    var dataNascimento = document.getElementById("nascimento").value
    var nome = document.getElementById("nome-completo").value
    var senhaRepete = document.getElementById("confirmar-senha").value

    if (senha != senhaRepete) {
        var p = document.createElement("p");
        p.innerHTML = "Senha não confere";
        p.classList.add('erro')
        document.getElementById("poss-erro").appendChild(p)
        return
    } else if (sexo == null || dataNascimento == null || senha == null || email == null) {
        var p = document.createElement("p");
        p.innerHTML = "Preencher todas os campos!";
        p.classList.add('erro')
        document.getElementById("poss-erro").appendChild(p)
        return
    }

    createUserWithEmailAndPassword(auth, email, senha)
        .then(async userCredential => {
            const user = userCredential.user;
            const userData = {
                nome,
                data_nascimento: dataNascimento,
                sexo,
                uid: user.uid
            };
            const userRef = doc(db, "user-data", user.uid);
            setDoc(userRef, userData);
        })
        .then(() => {
            window.location.href = '/vacinas.html';
        })
        .catch((error) => {
            var p = document.createElement("p");
            p.innerHTML = error;
            p.classList.add('erro')
            document.getElementById("poss-erro").appendChild(p)
            return
        });

}

function logar(e) {
    e.preventDefault();
    var email = document.getElementById("email").value
    var senha = document.getElementById("senha").value
    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            window.location.href = '/vacinas.html';
        })
        .catch((error) => {
            var p = document.createElement("p");
            p.innerHTML = "Email e/ou senha não conferem!"
            p.classList.add('erro')
            document.getElementById("pass").appendChild(p)
        });

}

function logado() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            return uid;
        } else {
            return null;
        }
    });
}


function resetaSenha(event) {
    event.preventDefault();
    email = document.getElementById("email").value
    if (email == null) {
        var p = document.createElement("p");
        p.innerHTML = "Preencher o e-mail corretamente!"
        p.classList.add('erro')
        document.getElementById("pass").appendChild(p)
        return
    }
    sendPasswordResetEmail(auth, email)
        .then(() => {
            window.location.href = 'login.html'
        })
        .catch((error) => {
            var p = document.createElement("p");
            p.innerHTML = "Preencher o e-mail corretamente!"
            p.classList.add('erro')
            document.getElementById("pass").appendChild(p)
            return
        });
}

function home() {
    if (logado) {
        window.location.href = '/vacinas.html';
    } else {
        window.location.href = '/index.html';
    }
}

if (document.title === "MyHealth - Cadastro") {
    document.getElementById("form").addEventListener('submit', event => {
        criarConta(event);
    });
}

if (document.title == "MyHealth - Login") {
    document.getElementById("form-login").addEventListener('submit', event => {
        logar(event);
    });
}


if (document.title == "MyHealth - Vacinas") {

}

if (document.title == "MyHealth - Recuperar Conta") {
    document.getElementById("form-recover").addEventListener('submit', event => {
        resetaSenha(event);
    });
}

if (document.title == "MyHealth - Vacinas" || document.title == "MyHealth - Adicionando vacina" || document.title == "MyHealth - Editando vacina") {
    document.getElementById("logout").addEventListener('click', logout)
}


function logout() {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        return
    });
}