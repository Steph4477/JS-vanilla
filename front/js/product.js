// La constante id récupère l'id grace à la page de l'url !!!! 
const id = new URL(window.location.href).searchParams.get("id");
// J'affiche l'ID pour la contrôler.
console.log(id);
// Création d'une requête GET(méthode par défault) pour récupérer les données de la page d'un produit avec son ID.
fetch("http://localhost:3000/api/products/" + id)
// Récupération du résultat de la requête au format json en verifiant si elle est ok avec (res.ok).
.then(function(res) {
    if (res.ok) {
        return res.json();
    }
})
// Ce résultat json nous le retournons et récupérons sous forme de tableau pour pouvoir l'exploiter et l'afficher.
.then(function(article) {
    construction(article);  
    console.table(article);
})

function construction(article){
    ///////////////////// IMAGE //////////////////////////////////////
    // Je crée une variable qui sélectionne l'emplacement de l'image dans la classe...
    let imgArticle = document.querySelector(".item__img");
    // Je crée une variable qui crée l'élément image.
    let image = document.createElement("img");
    // Je le place à l'emplacement selectionné en enfant.
    imgArticle.appendChild(image);
    // Je lui donne sa source.
    image.src = article.imageUrl;
    /////////////////// ALT ////////////////////////////////////////
    // Je lui donne son texte alternatif.
    image.alt = article.altTxt;
    //////////////////// TITRE ////////////////////////////////////////
    /// je crée une variable qui sélectionne l'emplacement de l'ID.
    let nomArticle = document.getElementById("title");
    // Je lui donne son texte.
    nomArticle.textContent = article.name;
    //////////////////// PRIX ////////////////////////////////////////
    // Je crée une variable qui sélectionne l'emplacement de l'ID.
    let price = document.getElementById("price");
    // Je lui donne son texte.
    price.textContent = article.price;
    //////////////////// DESCRIPTION ////////////////////////////////////////
    /// Je crée une variable qui sélectionne l'emplacement de l'ID.
    let description = document.getElementById("description");
    // Je lui donne son texte.
    description.textContent = article.description;
    //////////////////// COULEURS ////////////////////////////////////////
    // je crée une variable qui sélectionne l'emplacement de l'ID.
    let couleurs = document.getElementById("colors");
    // Je crée une boucle pour chaques couleurs.
    for (let i=0; i < article.colors.length; i++) {
        // Je crée une variable qui crée l'élément option.
        let option = document.createElement("option");
        // j'y attribut la valeur [i].
        option.value = article.colors[i];
        // j'y donne son texte.
        option.textContent = article.colors[i];
        // je le met en enfant de l'ID.
        couleurs.appendChild(option);
    }
    
};

///////// EVENEMENT DU BOUTON ET VALIDATION DU TICKET ////////////////////////////////////////
// Je crée une constante du bouton qui cible l'ID.
const bouton = document.getElementById("addToCart");
// Je crée une fonction qui écoute les evenements du bouton.
function alerteColor(){
    let couleur = document.querySelector(".item__content__settings__color");
    let alert = document.createElement("div")
    let alerte = document.createElement("h3");
    couleur.appendChild(alert);
    alert.appendChild(alerte);
    alerte.textContent = "-- Choisissez une couleur !!! --";
    alerte = true;
}

function alerteQuantite(){
    let couleur = document.querySelector(".item__content__settings__quantity");
    let alert = document.createElement("div")
    let alerte = document.createElement("h3"); 
    couleur.appendChild(alert);
    alert.appendChild(alerte);
    alerte.textContent = "-- Choisissez une quantité comprise entre 1 et 100 articles maximum !!! --";
    alerte = true;
}
bouton.addEventListener("click", function () {
    // Je crée des variables variable qui récupère les valeurs sélectionné par le visiteur. 
    let quantite = document.getElementById("quantity").value;
    // Je crée des alertes si les valeurs sont mal ou pas remplis.
    let color = document.querySelector("#colors").value;
    
    
    if ((color ==="") && (quantite === "0")){
        alerteColor();
        alerteQuantite();
    }
    else if (color === "") {
        alerteColor(); 
    }
    
    else if (quantite === "0") {
        alerteQuantite();
    }
   
    let prix = document.getElementById("price").textContent;
    let nom = document.getElementById("title").textContent;
    
    // Je crée le ticket qui sera un objet
    let ticket = {
        name : nom,
        id : id,
        quantite : quantite,
        couleur : color,
        alerte : false
    }
    console.log(ticket);
    // je met les tickets dans le localStorage au format JSON.
    let local = JSON.parse(localStorage.getItem("tickets"));
    console.log(local)
    // Je crée des exeptions et les rentrent dans une variable null.
    // Si le local est null ajoute le aux tickets
    if (local === null){
        local = [];
       
        local.push(ticket);
       
        localStorage.setItem("tickets", JSON.stringify(local));
    }
    // Si le locale est différent de null. 
    else if (local != null){
        
        local.push(ticket);
        localStorage.setItem("tickets", JSON.stringify(local));
        // findIndex
    }
    console.log(local);

});