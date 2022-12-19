//La constante id récupère l'id grace à la page de l'url !!!! >>>>> Explication à voir ??? <<<<< 
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
    console.table(article);
    construction(article); 
    
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
bouton.addEventListener("click", function () {
    // Je crée des variables variable qui récupère les valeurs sélectionné par le visiteur. 
    let couleur = document.getElementById("colors").value;
    let quantite = document.getElementById("quantity").value;
    // Je crée des alertes si les valeurs sont mal ou pas remplis.
    if (couleur === "") {
        alert("--SVP, choisissez une couleur --");
        return;
    }
    if (quantite === "0") {
        alert("--SVP, choisissez une quantité --");
        return;
    }
    // Je crée une instance de type classe pour crée un objet du ticket.
    let prix = document.getElementById("price").textContent;
    let nom = document.getElementById("title").textContent;
    class myticket {
        constructor (nom, couleur, quantite, prix){
            this.nom = nom;
            this.couleur = couleur;
            this.quantite = quantite;
            this.prix = prix*quantite;
        }
    }
    let ticket = new myticket(nom, couleur, quantite, prix);
    console.log(ticket);
    // Le ticket sera envoyé au stockage local et exploité au format JSON.
    let newTicket = localStorage.getItem(ticket);
    newTicket = JSON.parse(newTicket);
    function tickets(){ 
        console.table(newTicket);
    }
    tickets();
    console.log(tickets)

});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Ya t-il un moyen pour voir les elements crées en JS dans le html sans passer par console.log ????? //////////////