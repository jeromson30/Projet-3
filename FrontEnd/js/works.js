import { verifySession } from './session.js'

let works = {}
let workscat = {}
let inputsModale2 = []

const modalePopup = document.querySelector(".modalePopup")

// Fonction afin de limiter la propagation de certains évenements
const StopPropaga = function(e){
    e.stopPropagation()
}

// Fonction asynchrone d'initialisation pour recuperer les projets dans la BDD via l'API et fonction fetch et en stockant les resultats dans un objet JSON : works, creer les boutons pour les filtres (Fonction Filters()), charger les projets dans la page.
// Vérification de l'existence d'un element token dans le sessionStorage avec la fontion asynchrone verifySession() si une session est trouvé => création des boutons vers la modale et masquage des boutons des filtres.
const initialisation = async function() {
    try {
        // Récupère les projets depuis l'API
        const result = await fetch(`http://localhost:5678/api/works`)
        //Si pas d'erreur, on stock le résultat dans l'objet works au format JSON
        works = await result.json()

        // Fonction pour la création des boutons pour filtrer en asynchrone car on attend le résultat de la fonction fetch qui va récuperer le nom des catégories des projets dans la BDD.
        await Filters()
        //Chargement des projets dans la page web.
        LoadingProjects(0)

        //vérification de la présence d'un token dans le storage location
        if(await verifySession() == true){
            const elFilters = document.getElementById('filters')
            const elLogin = document.getElementById('login')

            elFilters.style.visibility = 'hidden'
            //Si un token est détecté création des boutons modales et changement du texte de login à logout
            createModalButtons()
            elLogin.innerText = "logout"
        }

        // Si le pop up de la modale existe de bien, ajout de l'évenement click sur la div pour stopper la propagation de l'évènement de click de la div parente.
        if(modalePopup != null){modalePopup.addEventListener("click", function(e){StopPropaga(e)})}

    } catch(error) {
        // Si la fonction fetch retourne une erreur on l'affiche
        console.error("Oups, il y a une erreur : " + error.message)
    }
}

// Fonction qui a pour but de charger tous les projets trouvé dans la BDD : http://localhost:5678/api/works
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

// Fonction asynchrone qui récupère le nom des catégories et leurs ID dans la BDD via la fonction fetch, on les stock dans l'objet workscat
// Création tableau appelé LabelCategorie, création de l'ID 0 pour afficher toutes les catégories des projets puis une boucle ajoute les autres catégories enregistrées dans l'objet workscat (fetch)
const Filters = async function(){
    const contentBouton = document.getElementById("filters")
    const LabelCategorie = []
    // ajout de l'ID 0 dans le tableau LabelCategorie pour creer le bouton qui servira à afficher toutes les catégories.
    LabelCategorie.push({id: 0, name: 'Tous'})

        try {
            const result = await fetch(`http://localhost:5678/api/categories`)
            workscat = await result.json()
            // Boucle For pour inserer les catégories dans le tableau LabelCategorie (au passage on vérifie que l'ID n'existe pas dans LabelCategorie afin d'éviter les doublons)
            for (let i = 0; i < workscat.length; i++) {
                if (!(workscat[i]['id'] in LabelCategorie)) {
                    LabelCategorie.push({id: workscat[i]['id'], name: workscat[i]['name']})
                }
            }
        } catch(error) {
            console.error("Oups, il y a une erreur : " + error.message)
        }

        // Boucle à partir de LabelCategorie afin de creer les boutons des filtres
        for (let i = 0; i < LabelCategorie.length; i++) {
            const boutonFilter = document.createElement("button")
            boutonFilter.classList.add('button_filters')
            boutonFilter.setAttribute("id", "FiltreCat")
            boutonFilter.setAttribute("data-id", LabelCategorie[i].id)
            boutonFilter.innerText = LabelCategorie[i].name
            contentBouton.appendChild(boutonFilter)
        }

        // Cible tous les boutons des filtres afin d'écouter les évènements click et filtrer sur les projets si l'évènement est déclenché par l'utilisateur.
        const bouton = document.querySelectorAll("#FiltreCat")
        for (let i = 0; i < bouton.length; i++) {
            bouton[i].addEventListener("click", function() {
            LoadingProjects(bouton[i].dataset.id)
            document.querySelectorAll('.selected').forEach((el => el.classList.remove('selected')))
            bouton[i].classList.add('selected')
            })
        }
}

//Fonction pour creer le bandeau modale au dessus du header et pour modifier le texte à coté du titre "Mes projets".
const createModalButtons = function(){
    const elHeaderMod = document.createElement('div')
    elHeaderMod.classList.add('headermodale')
    elHeaderMod.innerHTML = '<a href="#"><i class="fa-solid fa-pen-to-square"></i> mode édition</a>'
    document.body.prepend(elHeaderMod)
    const TitreProjets = document.querySelector('#TitreProjets')
    TitreProjets.innerHTML += '<span class="modaleProjets"><a href="#"><i class="fa-solid fa-pen-to-square"></i> modifier</a></span>'
}

const loadProjectInModal = function(){
    const content = document.getElementById("modaleProjets")
        
    //réinitialisation des projets en les supprimant
    while (content.firstChild) {
            content.firstChild.remove()
    }
    //Chargement des projets via la boucle For à partir de l'objet JSON works
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
    }

    //Selection de tous les boutons supprimer de chaque projet
    document.querySelectorAll(".modaleProjetsIcons").forEach(workicon => {
        // Création de l'event click sur chaque projet qui a pour fonction de supprimer un projet de la base de donnée
         workicon.addEventListener("click", async function(){
            try {
                await fetch("http://localhost:5678/api/works/" + workicon.dataset.id, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + window.sessionStorage.getItem("token")}
                })
                    // Lorsque nous avons le callback de l'API, 1 - suppression de tous les projets affichés dans le DOM, 2 - on supprime l'ID du projet dans l'objet JSON works puis on réaffiche le tout.
                    // Ca permet de ne pas faire à nouveau un fetch sur tous les projets.
                .then(function(){
                        //suppression du projet supprimé et on réaffiche la modale.
                        let RemWorks = works.filter(function(projet){return projet.id != workicon.dataset.id})

                        works = RemWorks
                        showModal(true)
                })
                    // si une erreur se présent on l'affiche
                } catch(error){console.error(error.message)}
        })
    })
}

//Fonction pour afficher la modale
//@params show: Boolean - si True alors on affiche la modale sinon pour toutes autres valeurs on cache tous les élements liés à la modale et on recharge les projets sur la page d'accueil.
const showModal = function(show){
    const elShowModal = document.querySelector(".modale_container")
    const checkModalButton = document.querySelector(".headermodale")

    //Si le bandeau modale existe (créér à partir de la fonction createModalButtons) et si le paramètre show = true alors on affiche la modale.
    if(checkModalButton !== null & show === true){

        elShowModal.style.display = null
        elShowModal.style.display = "flex"
        document.querySelector('#displayModale1').style.display = null
        document.querySelector('#returnModale1').style.display = 'none'
        document.querySelector('#displayModale2').style.display = 'none'


        loadProjectInModal()

    } else {
        LoadingProjects(0)
        elShowModal.style.display = 'none'
    }
}

// Initialisation des fonctions vitales de la page web.
await initialisation()


// Fermeture de la modale lorsque qu'un click se fait à l'extérieur de la fenêtre, avec l'utilisation de la fonction StopPropaga qui a pour but de ne pas propager l'event click sur les elements enfants de modale_container
const elShowModal = document.querySelector(".modale_container")
if(elShowModal != null){
    elShowModal.addEventListener("click", function(e){
        StopPropaga(e)
        showModal()
        LoadingProjects(0)
    })
}

// Ouverture de la modale lorsque l'event click est déclenché sur le bandeau supérieur modale et le texte "modifier"
document.querySelectorAll(".headermodale, .modaleProjets").forEach(function(element){
    element.addEventListener("click", function(){
        showModal(true)
    })
})

// Fermeture de la modale lors du click sur la croix
const hidemodale = document.querySelector("#hideModale")
if(hidemodale != null){
    hidemodale.addEventListener("click", function(){
        showModal()
        LoadingProjects(0)
    })
}

// Lors du click sur Logout, suppression de l'UserID et du Token du sessionStorage.
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

    while (CatPhoto.firstChild) {
        CatPhoto.firstChild.remove()
    }

    const Eloption = document.createElement("option")
    Eloption.value = ""
    Eloption.text = ""
    CatPhoto.append(Eloption)

    for(let i = 0; i < workscat.length; i++){
        const Eloption = document.createElement("option")
        Eloption.value = workscat[i].id
        Eloption.text = workscat[i].name
        CatPhoto.append(Eloption)
    }
})

const returnModale1 = document.querySelector('#returnModale1')
returnModale1.addEventListener("click", function(){
    loadProjectInModal()
    document.querySelector('#displayModale1').style.display = null
    document.querySelector('#displayModale2').style.display = 'none'
    document.querySelector('#returnModale1').style.display = 'none'
})

document.querySelectorAll('#displayModale2 input, #displayModale2 select').forEach(e => {
    if(e.value === "" || e.value === null){
        inputsModale2.push(e.id)
    }
    e.addEventListener("change", function(){
        if(e.id === "images" && e.value !== ""){

            if (e.files[0].size > 4 * 1024 * 1024) {
                alert("La taille de l'image ne doit pas dépasser 4Mo.")
                return
            }

            var oFReader = new FileReader();
            oFReader.readAsDataURL(e.files[0]);

            document.querySelectorAll('#labelUploadPhoto svg, #labelUploadPhoto span').forEach(el => el.style.display = "none")
            const labelUpPhoto = document.querySelector('#labelUploadPhoto')
            const labelUpPhotoImg = document.createElement('img')

            oFReader.onload = function (ReaderEvent) {
                labelUpPhotoImg.src = ReaderEvent.target.result
            }
            labelUpPhotoImg.style = "box-sizing:border-box;height:100%;object-fit:contain;"

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
    const title = document.getElementById('TitrePhoto')
    const category = document.getElementById('CategoriePhoto')
    const file = document.getElementById('images').files[0]

    if(inputsModale2.length === 0){
        let formData = new FormData();

        formData.append("title", title.value)
        formData.append("category", category.value)
        formData.append("image", file)

        //console.log("FormData before validation:", Array.from(formData.entries()));
  
        try {
            let results = await fetch("http://localhost:5678/api/works", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${window.sessionStorage.getItem("token")}`
                },
                body: formData
            });

            results = await results.json()
            
            title.value = ""
            category.value = ""

            document.querySelectorAll('#labelUploadPhoto svg, #labelUploadPhoto span').forEach(el => el.style.display = 'flex')
            document.querySelector('#labelUploadPhoto img').remove()
            //document.querySelector('#btnValidUpload').setAttribute('disabled')

            try {
                // Récupère les projets depuis l'API
                const result = await fetch(`http://localhost:5678/api/works`)
                //Si pas d'erreur, on stock le résultat dans l'objet works au format JSON
                works = await result.json()
            } catch(err){
                console.error(err.message)
            }

            alert("Projet ajouté avec succès!")

        } catch(error){
            output.innerHTML = error.message
            console.log(error.message)
        }
    }
})

