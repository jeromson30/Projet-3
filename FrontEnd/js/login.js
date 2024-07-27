import { verifySession } from './session.js';

const loginform = document.getElementById("login");
const TextInfo = document.createElement("span");
const mainContent = document.querySelector("main");
TextInfo.classList.add("loginInfo");

const login = async function(loginemail, loginpassword){
    let UserLogin = {};
    UserLogin.email = loginemail;
    UserLogin.password = loginpassword;
    UserLogin = JSON.stringify(UserLogin);

    let results = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: UserLogin
    });
    results = await results.json();
    
    if(results.userId && results.token){

        window.sessionStorage.setItem("userId", results.userId);
        window.sessionStorage.setItem("token", results.token);
        return true

    } else {
        
        TextInfo.innerText = "Mauvais mot de passe ou email !";
        loginform.prepend(TextInfo);
        return false
    }
};

const alreadyLogged = function(){
    if(verifySession() == true){
        loginform.remove();
        TextInfo.innerText = "Vous êtes déja connecté !";

        mainContent.appendChild(TextInfo);
    } else {
        console.log("Pas connecté");
    }
};

loginform.addEventListener("submit", function(event){
    event.preventDefault();

    console.log("Click sur le bouton connexion!");
    const InputEmail = loginform.querySelector(".loginEmail");
    const InputPasssword = loginform.querySelector(".loginPassword");
    console.log(InputEmail);
    console.log(InputPasssword);

    login(InputEmail.value, InputPasssword.value)
    .then((result) => {
        if(result === true){
            console.log("Authentification réussie !");
            window.location = "./index.html";
        }
    });

});


alreadyLogged();
