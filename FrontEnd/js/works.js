import { verifySession } from './session.js'

let works = {}
let workscat = {}
let inputsModale2 = [];

const modalePopup = document.querySelector(".modalePopup")

const StopPropaga = function(e){
    e.stopPropagation()
}

const initialisation = async function() {
    try {
        const result = await fetch(`http://localhost:5678/api/works`)
        works = await result.json()
        await Filters()
        LoadingProjects(0)

        if(await verifySession() == true){
            const elFilters = document.getElementById('filters')
            const elLogin = document.getElementById('login')

            elFilters.style.visibility = 'hidden'
            createModalButtons()
            elLogin.innerText = "logout"
        }

        if(modalePopup != null){modalePopup.addEventListener("click", function(e){StopPropaga(e)})}

    } catch(error) {
        throw("Oups, il y a une erreur : " + error.message)
    }
}

// Fonction qui a pour but de charger tous les projets trouvé dans l'API : http://localhost:5678/api/works
// @params Projects = l'ID des catégories à afficher, ID: 0 affiche tous les projets.
const LoadingProjects = function(Projects){
    let Fworks = works.filter(function(item){
        if(Projects == 0){
            return item.categoryId > Projects 
        } else {
            return item.categoryId == Projects
        }
    })

    const content = document.getElementById("allworks")
    while (content.firstChild) {content.firstChild.remove()}
    for (let i = 0; i < Fworks.length; i++) {            
        const workf = document.createElement("figure")
        const workimg = document.createElement("img")
        const workdesc = document.createElement("figcaption")
        
        workf.appendChild(workimg)
        workf.appendChild(workdesc)

        workimg.setAttribute("src", Fworks[i].imageUrl)
        workimg.setAttribute("alt", Fworks[i].title)
        workdesc.innerText = Fworks[i].title

        const content = document.getElementById("allworks")
        content.appendChild(workf)
    }
}

// A partir de l'objet works contenant tous les projets et leurs catégories, récuperé grace à la fonction fetch au chargement de la page.
// La fonction Filter vient isoler dans un Array chaque catégorie pour ensuite générer les boutons avec leurs eventlisteners respectifs.
// Je ne fais appel à la fonction fetch qu'une seule fois au chargement de la page mais j'aurai très bien pu utilisé une nouvelle fois fetch sur l'url : http://localhost:5678/api/categories
const Filters = async function(){
    const contentBouton = document.getElementById("filters")
    const LabelCategorie = []
    LabelCategorie.push({id: 0, name: 'Tous'})

        try {
            const result = await fetch(`http://localhost:5678/api/categories`)
            workscat = await result.json()
            for (let i = 0; i < workscat.length; i++) {
                if (!(workscat[i]['id'] in LabelCategorie)) {
                    LabelCategorie.push({id: workscat[i]['id'], name: workscat[i]['name']})
                }
            }
        } catch(error) {
            console.error("Oups, il y a une erreur : " + error.message)
        }

        for (let i = 0; i < LabelCategorie.length; i++) {
            const boutonFilter = document.createElement("button")
            boutonFilter.classList.add('button_filters')
            boutonFilter.setAttribute("id", "FiltreCat")
            boutonFilter.setAttribute("data-id", LabelCategorie[i].id)
            boutonFilter.innerText = LabelCategorie[i].name
            contentBouton.appendChild(boutonFilter)
        }

        const bouton = document.querySelectorAll("#FiltreCat")
        for (let i = 0; i < bouton.length; i++) {
            bouton[i].addEventListener("click", function() {
            LoadingProjects(bouton[i].dataset.id)
            document.querySelectorAll('.selected').forEach((el => el.classList.remove('selected')))
            bouton[i].classList.add('selected')
            })
        }
}

const createModalButtons = function(){
    console.log('CREATION BOUTON MODALE')
    const elHeaderMod = document.createElement('div')
    elHeaderMod.classList.add('headermodale')
    elHeaderMod.innerHTML = '<a href="#"><i class="fa-solid fa-pen-to-square"></i> mode édition</a>'
    document.body.prepend(elHeaderMod)
    //<span class="modaleProjets"><a href="#"><i class="fa-solid fa-pen-to-square"></i> modifier</a></span>
    const TitreProjets = document.querySelector('#TitreProjets')
    TitreProjets.innerHTML += '<span class="modaleProjets"><a href="#"><i class="fa-solid fa-pen-to-square"></i> modifier</a></span>'
}

const showModal = function(show){
    const elShowModal = document.querySelector(".modale_container")
    const checkModalButton = document.querySelector(".headermodale")

    if(checkModalButton !== null & show === true){
        console.log("Exécution fonction modale")
        elShowModal.style.display = null
        elShowModal.style.display = "flex"
        document.querySelector('#displayModale1').style.display = null
        document.querySelector('#returnModale1').style.display = 'none'
        document.querySelector('#displayModale2').style.display = 'none'

        const content = document.getElementById("modaleProjets")
        
        while (content.firstChild) {
                content.firstChild.remove()
        }

        for (let i = 0; i < works.length; i++) {            
            const workf = document.createElement("figure")
            const workicon = document.createElement("i")
            workicon.classList.add("fa-solid", "fa-trash-can", "modaleProjetsIcons")
            workicon.setAttribute("data-id", works[i].id)
            workf.appendChild(workicon)
            const workimg = document.createElement("img")
            workf.appendChild(workimg)
    
            workimg.setAttribute("src", works[i].imageUrl)
            workimg.setAttribute("alt", works[i].title)
            
            content.appendChild(workf)

            workicon.addEventListener("click", async function(){
            try {
                await fetch("http://localhost:5678/api/works/" + workicon.dataset.id, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + window.sessionStorage.getItem("token")}
                }).then((retValue) => {
                    console.log(retValue)
                    while(content.firstChild) {
                            content.firstChild.remove()
                    }
                    let RemWorks = works.filter(function(projet){return projet.id != workicon.dataset.id})
                        works = RemWorks
                        showModal(true)
                    })
                } catch(error){throw(error.message)}
            })
        }
    } else {
        LoadingProjects(0)
        elShowModal.style.display = 'none'
    }
}

await initialisation()

const elShowModal = document.querySelector(".modale_container")
if(elShowModal != null){
    elShowModal.addEventListener("click", function(e){
        StopPropaga(e)
        showModal()
    })
}

const checkModalButton = document.querySelector(".headermodale")
if(checkModalButton != null){
    checkModalButton.addEventListener("click", function(e){
        showModal(true)
    })
}

const hidemodale = document.querySelector("#hideModale")
if(hidemodale != null){
    hidemodale.addEventListener("click", function(){
        showModal()
        LoadingProjects(0)
    })
}

const elLogin = document.getElementById('login')
elLogin.addEventListener("click", async function(event){
    if(await verifySession() == true){
        window.sessionStorage.removeItem("userId")
        window.sessionStorage.removeItem("token")
        window.location = "./index.html"
    } else {
        window.location = "./login.html"
    }
})

const addPhoto = document.querySelector('#addPhoto')
addPhoto.addEventListener("click", function(){
    document.querySelector('#displayModale1').style.display = 'none'
    document.querySelector('#displayModale2').style.display = null
    document.querySelector('#returnModale1').style.display = null

    const CatPhoto = document.querySelector('#CategoriePhoto')

    for(let i = 0; i < workscat.length; i++){
        let Eloption = document.createElement("option")
        Eloption.value = workscat[i].id
        Eloption.text = workscat[i].name
        CatPhoto.append(Eloption)
    }
})

const returnModale1 = document.querySelector('#returnModale1')
returnModale1.addEventListener("click", function(){
    document.querySelector('#displayModale1').style.display = null
    document.querySelector('#displayModale2').style.display = 'none'
    document.querySelector('#returnModale1').style.display = 'none'
})

const inputModal2 = document.querySelectorAll('#displayModale2 input, #displayModale2 select').forEach(e => {
    if(e.value === ""){
        inputsModale2.push(e.id)
    }
    // e.addEventListener("cancel", function(){
    //     document.querySelector('#btnValidUpload').setAttribute('disabled', true)
    //     inputsModale2.push(e.id)
    // })

    e.addEventListener("change", function(){
        if(e.id === "images" && e.value !== ""){
            var oFReader = new FileReader();
            oFReader.readAsDataURL(e.files[0]);

            document.querySelectorAll('#labelUploadPhoto svg, #labelUploadPhoto span').forEach(el => el.remove())
            const labelUpPhoto = document.querySelector('#labelUploadPhoto')
            const labelUpPhotoImg = document.createElement('img')

            oFReader.onload = function (ReaderEvent) {
                labelUpPhotoImg.src = ReaderEvent.target.result
            }
            labelUpPhotoImg.style = "box-sizing:border-box;height:100%;object-fit:contain;"
            while (labelUpPhoto.firstChild) {
                labelUpPhoto.firstChild.remove()
            }
            labelUpPhoto.appendChild(labelUpPhotoImg)
        }
        if(e.value !== null || e.value !== ""){
            inputsModale2 = inputsModale2.filter(el => el !== e.id)
            if(inputsModale2.length === 0){
                document.querySelector('#btnValidUpload').removeAttribute('disabled')
            } else {
                if(e.value === ""){
                    inputsModale2.push(e.id)
                }
            }
        } else {
            inputsModale2.push(e.id)
        }
    })
})

const output = document.querySelector("#output")
const uploadform = document.querySelector('#uploadProject')
uploadform.addEventListener("submit", async function(event){
    event.preventDefault()
    const title = document.getElementById('TitrePhoto').value
    const category = document.getElementById('CategoriePhoto').value
    const file = document.getElementById('images').files[0]

    if(inputsModale2.length === 0){
        let formData = new FormData();

        formData.append("title", title)
        formData.append("category", category)
        formData.append("image", file)

        console.log("FormData before validation:", Array.from(formData.entries()));

        // l'envoyer au serveur
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${window.sessionStorage.getItem('token')}`
            },
            body: formData
        })
        .then ((res) => {
            if (res.ok) {
                return res.json()
            } else {
                alert("Erreur lors de l'ajout du projet")
            }
        })






        try {
            let results = await fetch("http://localhost:5678/api/works", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("token")}`
                },
                body: formData
            });

            results = await results.json();
            console.log(results)
        } catch(error){
            output.innerHTML = error.message
            console.log(error)
        }}
})
