const loginform = document.getElementById("login");

loginform.addEventListener("submit", function(event){
    event.preventDefault();

    console.log("Click sur le bouton connexion!");
    const InputEmail = loginform.querySelector(".loginEmail");
    const InputPasssword = loginform.querySelector(".loginPassword");
    console.log(InputEmail);
    console.log(InputPasssword);

    verifyUser(InputEmail.value, InputPasssword.value).then((result) => {
        if(result === true){
            console.log("Authentification réussie !");
            window.location = "./index.html";
        }
    });

});

async function verifyUser(loginemail, loginpassword){
    
    let UserLogin = {};
    UserLogin.email = loginemail;
    UserLogin.password = loginpassword;
    UserLogin = JSON.stringify(UserLogin);

    results = await fetch("http://localhost:5678/api/users/login", {
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
        return false
    }
};

function authOK(){
    if(verifySession()){
        loginform.remove()
        const TextInfo = document.createElement("span");
        const mainContent = document.querySelector("main");
        TextInfo.classList.add("loginInfo");
        TextInfo.innerHTML = "Vous êtes déja connecté !";
        mainContent.appendChild(TextInfo);
    } else {
        console.log("Pas connecté");
    }
}

function verifySession(){
    validation = false
    if(window.sessionStorage.getItem("userId") !== null & window.sessionStorage.getItem("token") !== null){
        validation = true;
        console.log("Token détecté");
    }
    return validation;
};

authOK();