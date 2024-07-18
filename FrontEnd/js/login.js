const loginform = document.getElementById("login");

loginform.addEventListener("submit", function(event){
    event.preventDefault();

    console.log("Click sur le bouton connexion!");
    const InputEmail = loginform.querySelector('input[id="email"]');
    const InputPasssword = loginform.querySelector('input[id="password"]');
    console.log(InputEmail);
    console.log(InputPasssword);

    verifyUser(InputEmail.value, InputPasssword.value);

});

async function verifyUser(email, password){
    
    results = await fetch('http://localhost:5678/api/users', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"email": ${email}, "password": ${password}}`
    });
    Users = await results.json();
    console.log(Users);
}