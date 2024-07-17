let works = {};


async function RecupInfoAPI() {
    try {
        const result = await fetch(`http://localhost:5678/api/works`);

        works = await result.json();
        console.log("Données reçu de l\'API");	
        Filters();
        LoadingProjects(0);
    } catch(error) {
        console.error("Oups, il y a une erreur : " + error);
    };
};



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
        contentBouton.appendChild(boutonFilter);
        boutonFilter.setAttribute("id", "FiltreCat");
        boutonFilter.setAttribute("data-id", LabelCategorie[i].id);
        boutonFilter.innerText = LabelCategorie[i].name;
    };


    const bouton = document.querySelectorAll("#FiltreCat");

    for (let i = 0; i < bouton.length; i++) {
        bouton[i].addEventListener("click", function() {
            LoadingProjects(bouton[i].dataset.id);
            //console.log("click sur : " + bouton[i].dataset.id);
        });
    }
    

};


RecupInfoAPI();