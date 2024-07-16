let works = {};


async function RecupInfoAPI() {
    try {
    const result = await fetch(`http://localhost:5678/api/works`);

    works = await result.json();
    console.log("Données reçu de l\'API");	
    console.log(works[0].category);
    LoadingProjects("initial");

    } catch(error) {
        console.log("Erreur de connexion à l\'API : " + error);
    }
};

RecupInfoAPI();



async function Filters() {
    FiltersLabels = works.category.name
        for (let i = 0; i < FiltersLabels.length; i++) {
            const boutonFilter = document.createElement("button");
            boutonFilter.innerText = FiltersLabels[i];
            console.log(FiltersLabels[i]);
            const contentBouton = document.getElementById("filters");
            contentBouton.appendChild(boutonFilter);
        }

};

function LoadingProjects(Projects){
    if(Projects === "initial"){
        for (let i = 0; i < works.length; i++) {
            //console.log(works[i]);

            const workf = document.createElement("figure");
            const workimg = document.createElement("img");
            const workdesc = document.createElement("figcaption");
            workf.appendChild(workimg);
            workf.appendChild(workdesc);

            workimg.setAttribute("src", works[i].imageUrl);
            workimg.setAttribute("alt", works[i].title);
            workdesc.innerText = works[i].title;

            const content = document.getElementById("allworks");
            content.appendChild(workf);
        }
    } else {
        console.log("Nouvelle données : " + Projects);
        const content = document.getElementById("allworks");
        while (content.firstChild) {
            content.firstChild.remove()
        }

        for (let i = 0; i < Projects.length; i++) {
            //console.log(works[i]);

            const workf = document.createElement("figure");
            const workimg = document.createElement("img");
            const workdesc = document.createElement("figcaption");
            workf.appendChild(workimg);
            workf.appendChild(workdesc);

            workimg.setAttribute("src", Projects[i].imageUrl);
            workimg.setAttribute("alt", Projects[i].title);
            workdesc.innerText = Projects[i].title;

            const content = document.getElementById("allworks");
            content.appendChild(workf);
        }
    }
}

const boutonShowAll = document.querySelector("#Filter_ShowAll");
boutonShowAll.addEventListener("click", function () {
    //const AllWorks = Array.from(works);
    const AllWorks = works.filter(function(work) {
        return work.category.id > 0;
    });
    console.log(AllWorks);
    LoadingProjects(AllWorks);
});

const boutonShowObjects = document.querySelector("#Filter_ShowObjects");
boutonShowObjects.addEventListener("click", function () {
    //const AllWorks = Array.from(works);
    const AllObjects = works.filter(function(work) {
        return work.category.id === 1;
    });
    console.log(AllObjects);
    LoadingProjects(AllObjects);
});

const boutonShowApparts = document.querySelector("#Filter_ShowApparts");
boutonShowApparts.addEventListener("click", function () {
    //const AllWorks = Array.from(works);
const AllApparts = works.filter(function(work) {
        return work.category.id === 2;
    });
    console.log(AllApparts);
    LoadingProjects(AllApparts);
});

const boutonShowHotels = document.querySelector("#Filter_ShowHotel");
boutonShowHotels.addEventListener("click", function () {
    //const AllWorks = Array.from(works);
const AllHotels = works.filter(function(work) {
        return work.category.id === 3;
    });
    console.log(AllHotels);
    LoadingProjects(AllHotels);
});



//Filters();

// function genererProjets(works){
// 	for (let i = 0; i < works.length; i++) {
// 		return works(i);
// 	}
// }
// genererProjets(works);
