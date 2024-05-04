import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

function criarConta() {
    var email = document.getElementById("email"); 
    var senha = document.getElementById("senha");
    var confirmar_senha = document.getElementById("confirmar-senha");
    // console.log(email, senha, confirmar_senha)
    // if(senha === confirmar_senha){
    //     createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         // Signed up 
    //         const user = userCredential.user;
    //         console.log(user);
    //         // ...
    //     })
    //     .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // ..
    //     });
    // }else{
    //     console.log("Senhas diferentes");
    // }
}

