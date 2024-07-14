async function Filters() {
    FiltersLabels = ["Tous", "Objets", "Appartements", "Hotels & restaurants"]
    for (let i = 0; i < FiltersLabels.length; i++) {
        const boutonFilter = document.createElement("button");
        boutonFilter.innerText = FiltersLabels[i];
        console.log(FiltersLabels[i]);
        const contentBouton = document.getElementById("filters");
        contentBouton.appendChild(boutonFilter);
    }

}



async function RecupInfoAPI() {
    const result = await fetch(`http://localhost:5678/api/works`);
           
    works = await result.json();
    console.log("Résultats API reçu");	
    // console.log(Results);

        for (let i = 0; i < works.length; i++) {
                console.log(works[i]);

                const work = document.createElement("figure");
                const workimg = document.createElement("img");
                const workdesc = document.createElement("figcaption");
                work.appendChild(workimg);
                work.appendChild(workdesc);

                workimg.setAttribute("src", works[i].imageUrl);
                workimg.setAttribute("alt", works[i].title);
                workdesc.innerText = works[i].title;

                const content = document.getElementById("allworks");
                content.appendChild(work);
        }
}

RecupInfoAPI();
Filters();

// function genererProjets(works){
// 	for (let i = 0; i < works.length; i++) {
// 		return works(i);
// 	}
// }
// genererProjets(works);
