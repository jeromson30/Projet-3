let works = {};


async function RecupInfoAPI() {
    try {
        const result = await fetch(`http://localhost:5678/api/works`);

        works = await result.json();
        console.log("Données reçu de l\'API");	
        Filters();
        LoadingProjects(0);
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


// Fonction qui a pour but récuperer toutes les catégories existantes dans les projets, puis de generer les boutons et leurs événements click.
function Filters() {
    const contentBouton = document.getElementById("filters");
    const FiltersLabels = works;
    const LabelCategorie = [];
    //LabelCategorie.add(0);
    LabelCategorie.push({id: 0, name: 'Tous'});

    for (let i = 0; i < FiltersLabels.length; i++) {
        if (!(FiltersLabels[i]['category']['id'] in LabelCategorie)) {
            LabelCategorie.push({id: FiltersLabels[i]['category']['id'], name: FiltersLabels[i]['category']['name']});
        };
    };

    for (let i = 0; i < LabelCategorie.length; i++) {
        boutonFilter = document.createElement("button");
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


RecupInfoAPI();