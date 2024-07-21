import { verifySession } from './session.js';

let works = {};


async function initialisation() {
    try {
        const result = await fetch(`http://localhost:5678/api/works`);
        works = await result.json();
        await Filters();
        LoadingProjects(0);
        if(await verifySession() == true){
            const el = document.getElementById('filters');
            el.style.visibility = 'hidden';
            createModalButtons();
        }
    } catch(error) {
        console.error("Oups, il y a une erreur : " + error.message);
    };
};


// Fonction qui a pour but de charger tous les projets trouvé dans l'API : http://localhost:5678/api/works
// @params Projects = l'ID des catégories à afficher, ID: 0 affiche tous les projets.

function LoadingProjects(Projects){
    //console.log(works);

    let Fworks = works.filter(function(item){
        if(Projects == 0){
            return item.categoryId > Projects; 
        } else {
            return item.categoryId == Projects;
        };
    });

    const content = document.getElementById("allworks");
    while (content.firstChild) {
            content.firstChild.remove()
    };

    for (let i = 0; i < Fworks.length; i++) {            
        const workf = document.createElement("figure");
        const workimg = document.createElement("img");
        const workdesc = document.createElement("figcaption");
        workf.appendChild(workimg);
        workf.appendChild(workdesc);

        workimg.setAttribute("src", Fworks[i].imageUrl);
        workimg.setAttribute("alt", Fworks[i].title);
        workdesc.innerText = Fworks[i].title;

        const content = document.getElementById("allworks");
        content.appendChild(workf);
    };
};

// A partir de l'objet works contenant tous les projets et leurs catégories, récuperé grace à la fonction fetch au chargement de la page.
// La fonction Filter vient isoler dans un Array chaque catégorie pour ensuite générer les boutons avec leurs eventlisteners respectifs.
// Je ne fais appel à la fonction fetch qu'une seule fois au chargement de la page mais j'aurai très bien pu utilisé une nouvelle fois fetch sur l'url : http://localhost:5678/api/categories

async function Filters() {
    const contentBouton = document.getElementById("filters");
    //const FiltersLabels = works;
    const LabelCategorie = [];
    //LabelCategorie.add(0);
    LabelCategorie.push({id: 0, name: 'Tous'});

        try {
            const result = await fetch(`http://localhost:5678/api/categories`);
            let workscat = await result.json();
            for (let i = 0; i < workscat.length; i++) {
                if (!(workscat[i]['id'] in LabelCategorie)) {
                    LabelCategorie.push({id: workscat[i]['id'], name: workscat[i]['name']});
                };
            };
        } catch(error) {
            console.error("Oups, il y a une erreur : " + error.message);
        };



        for (let i = 0; i < LabelCategorie.length; i++) {
            const boutonFilter = document.createElement("button");
            boutonFilter.classList.add('button_filters');
            boutonFilter.setAttribute("id", "FiltreCat");
            boutonFilter.setAttribute("data-id", LabelCategorie[i].id);
            boutonFilter.innerText = LabelCategorie[i].name;
            contentBouton.appendChild(boutonFilter);
        };


        const bouton = document.querySelectorAll("#FiltreCat");

        for (let i = 0; i < bouton.length; i++) {
            bouton[i].addEventListener("click", function() {
            LoadingProjects(bouton[i].dataset.id);
            document.querySelectorAll('.selected').forEach((el => el.classList.remove('selected')));
            bouton[i].classList.add('selected');
                    //console.log("click sur : " + bouton[i].dataset.id);
            });
        }
};


function createModalButtons() {
    const elBody = document.querySelector('body');
    const elHeaderMod = document.createElement('div');
    elHeaderMod.classList.add('headermodale');
    elHeaderMod.innerHTML = '<a href="#"><i class="fa-solid fa-pen-to-square"></i> mode édition</a>';
    elBody.prepend(elHeaderMod);
    //<span class="modaleProjets"><a href="#"><i class="fa-solid fa-pen-to-square"></i> modifier</a></span>
    const TitreProjets = document.querySelector('#TitreProjets');
    TitreProjets.innerHTML += '<span class="modaleProjets"><a href="#"><i class="fa-solid fa-pen-to-square"></i> modifier</a></span>';
};

function showModal(show) {
    const checkModalButton = document.querySelector(".headermodale");
    const elShowModal = document.querySelector(".modale_container");

    if(checkModalButton !== null & show == true){
        elShowModal.style.visibility = "visible";

        for (let i = 0; i < works.length; i++) {            
            const workf = document.createElement("figure");
            const workimg = document.createElement("img");
            workf.appendChild(workimg);
    
            workimg.setAttribute("src", works[i].imageUrl);
            workimg.setAttribute("alt", works[i].title);
    
            const content = document.getElementById("modaleProjets");
            content.appendChild(workf);
        };

    } else {
        elShowModal.style.visibility = "hidden";
    }
};

await initialisation();

const checkModalButton = document.querySelector(".headermodale");
if(checkModalButton != null){
    checkModalButton.addEventListener("click", function(){
        showModal(true);
    });
};

const hidemodale = document.querySelector("#hideModale");
if(hidemodale != null){
    hidemodale.addEventListener("click", function(){
        console.log('click');
        showModal();
    });
};
