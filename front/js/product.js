// La constante id récupère l'id grâce à la page de l'url 
const id = new URL(window.location.href).searchParams.get("id");

// J'affiche l'ID pour la contrôler.
console.log(id);
// Création d'une requête GET(méthode par défault) pour récupérer les données de la page d'un produit avec son ID.
let couleur = document.querySelector(".item__content__settings__color");
let alert = document.createElement("div");
let alertes = document.createElement("div");
couleur.appendChild(alert);
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
// Construction du detail du produit.
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
}
///////// EVENEMENT DU BOUTON ET VALIDATION DU TICKET ////////////////////////////////////////
// Je crée une constante du bouton qui cible l'ID.
const bouton = document.getElementById("addToCart");
bouton.addEventListener("click", function () {
    // Je crée des variables variable qui récupère les valeurs sélectionné par le visiteur. 
    let quantite = document.getElementById("quantity").value;
    ///////////////////////////    ALERTES   /////////////////////////////////////////////////
    // Je crée des alertes si les valeurs sont mal ou pas remplis.
    let color = document.getElementById("colors").value;
    let nom = document.getElementById("title").textContent;
    // je met les tickets dans le localStorage au format JSON.
    let local = JSON.parse(localStorage.getItem("tickets"));
    // Je crée le ticket qui sera un objet
    let ticket = {
        name : nom,
        id : id,
        quantite : Number(quantite),
        couleur : color 
    }
    
    function gestionLocalStorage (){
        if (local === null){
            local = [];
            local.push(ticket);
            localStorage.setItem("tickets", JSON.stringify(local));
        }
        else{
            // Si la variable recherche à le même id et la même couleur qu'un ticket présent.
            let recherche = local.find(element => element.id == ticket.id && element.couleur == ticket.couleur);
            // Si pas definit, crée un nouveau ticket.
            if (recherche == undefined){
                local.push(ticket);
                localStorage.setItem("tickets", JSON.stringify(local));
            }
            // Sinon rajoute la quantité.
            else { 
                recherche.quantite += ticket.quantite;
                localStorage.setItem("tickets", JSON.stringify(local));
            }
        }
    }
    function alerte (message) {
        alert.textContent = message; 
    }
    function gestionAlertes () {  
        if (color !== "" ) {
           alerte("")

        }
        if (quantite !== "0") {
            alerte("")      
        }
        
        if (color === ""){
            alerte("-- Choisissez une couleur --")
        }
        if (quantite <= "0" || quantite > "100"){
            
            alerte("-- Choisissez une quantité comprise entre 1 et 100 articles maximum --")    
        }
        if (color === "" && quantite === "0"){
            alerte("-- Choisissez une couleur et choisissez une quantité comprise entre 1 et 100 articles maximum --")
        } 
        if (quantite > "0" && quantite < "100" && color !== ""){
            gestionLocalStorage()
        }     
    }
    gestionAlertes ();
    console.log(local);
});