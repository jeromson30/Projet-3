import { verifySession } from './session.js'

const loginform = document.getElementById("login")
const textError = document.querySelector(".textError")
const mainContent = document.querySelector("main")

// Fonction async pour se connecter
const login = async function(loginemail, loginpassword){
    let UserLogin = {}
    UserLogin.email = loginemail
    UserLogin.password = loginpassword
    UserLogin = JSON.stringify(UserLogin)
    try {
        let results = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: UserLogin
        })
        results = await results.json()
    
    // Si l'API ne retourne pas d'erreur et qu'elle retourne des valeurs contenant un userID & un token
    if(results.userId && results.token){
        textError.style.display = "none"
        window.sessionStorage.setItem("userId", results.userId)
        window.sessionStorage.setItem("token", results.token)
        return true

    } else {
        // Suppression des valeurs des champs suite à une erreur de saisie
        loginform.querySelectorAll("input[type=email], input[type=password]").forEach(function(Elinput){
            Elinput.value = ""
        })
        textError.innerText = "Mauvais mot de passe ou email !"
        textError.style.display = "flex"
        return false
    }

// Retourne l'erreur si l'API en renvoie une
 } catch(err){
    console.error(error.message)
 }
}

// Fonction qui vérifie si on est deja connecté
const alreadyLogged = function(){
    if(verifySession() == true){
        loginform.remove()
        TextInfo.innerText = "Vous êtes déja connecté !"

        mainContent.appendChild(TextInfo)
    } else {
        console.log("Pas connecté")
    }
}


loginform.addEventListener("submit", function(event){
    event.preventDefault()

    console.log("Click sur le bouton connexion!")
    const InputEmail = loginform.querySelector(".loginEmail")
    const InputPasssword = loginform.querySelector(".loginPassword")

    login(InputEmail.value, InputPasssword.value)
    .then((result) => {
        if(result === true){
            console.log("Authentification réussie !")
            window.location = "./index.html"
        }
    })

})


alreadyLogged()
