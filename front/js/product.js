// La constante id récupère l'id grâce à l'url de la page. 
const id = new URL(window.location.href).searchParams.get("id")
// J'affiche l'ID pour la contrôler.
console.log(id)
// Création d'une requête GET(méthode par défault) pour récupérer les données de la page d'un produit avec son ID.
let couleur = document.querySelector(".item__content__settings__color")
let alert = document.createElement("div")
let alertes = document.createElement("div")

// Création alerte couleur en enfant de couleur.
couleur.appendChild(alert)
fetch("http://localhost:3000/api/products/" + id)
// Récupération du résultat de la requête au format json en verifiant si elle est ok avec (res.ok).
.then(function(res) {
    if (res.ok) {
        return res.json()
    }
})

// Ce résultat json nous le retournons et récupérons sous forme de tableau pour pouvoir l'exploiter et l'afficher.
.then(function(article) {
    construction(article)  
    console.table(article)
})

// Construction du detail du produit.
// Fonction de création du html, j'aurais pu le faire par interpolation. 
function construction(article){
    ///////////////////// IMAGE //////////////////////////////////////
    // Je crée une variable qui sélectionne l'emplacement de l'image dans la classe...
    let imgArticle = document.querySelector(".item__img")
    // Je crée une variable qui crée l'élément image.
    let image = document.createElement("img")
    // Je le place à l'emplacement selectionné en enfant.
    imgArticle.appendChild(image)
    // Je lui donne sa source.
    image.src = article.imageUrl
    /////////////////// ALT ////////////////////////////////////////
    // Je lui donne son texte alternatif.
    image.alt = article.altTxt
    //////////////////// TITRE ////////////////////////////////////////
    /// je crée une variable qui sélectionne l'emplacement de l'ID.
    let nomArticle = document.getElementById("title")
    // Je lui donne son texte.
    nomArticle.textContent = article.name
    //////////////////// PRIX ////////////////////////////////////////
    // Je crée une variable qui sélectionne l'emplacement de l'ID.
    let price = document.getElementById("price")
    // Je lui donne son texte.
    price.textContent = article.price
    //////////////////// DESCRIPTION ////////////////////////////////////////
    /// Je crée une variable qui sélectionne l'emplacement de l'ID.
    let description = document.getElementById("description")
    // Je lui donne son texte.
    description.textContent = article.description
    //////////////////// COULEURS ////////////////////////////////////////
    // je crée une variable qui sélectionne l'emplacement de l'ID.
    let couleurs = document.getElementById("colors")
    // Je crée une boucle pour chaques couleurs.
    for (let i=0; i < article.colors.length; i++) {
        // Je crée une variable qui crée l'élément option.
        let option = document.createElement("option")
        // j'y attribue la valeur [i].
        option.value = article.colors[i]
        // j'y donne son texte.
        option.textContent = article.colors[i]
        // je le met en enfant de l'ID.
        couleurs.appendChild(option)
    }
}
///////// EVENEMENT DU BOUTON ET VALIDATION DU TICKET ////////////////////////////////////////
// Je crée une constante du bouton qui cible l'ID.
const bouton = document.getElementById("addToCart")

bouton.addEventListener("click", function () {
    let quantite = document.getElementById("quantity").value;
    let color = document.getElementById("colors").value;
    let local = JSON.parse(localStorage.getItem("tickets")) || [];
    let ticket = {
        id : id,
        quantite : Number(quantite),
        couleur : color
    };
    
    function gestionLocalStorage () {
        let existingTicket = local.find(t => t.id === ticket.id && t.couleur === ticket.couleur);
        if (existingTicket) {
            existingTicket.quantite += ticket.quantite;
            if (existingTicket.quantite > 100) {
                alerte("-- Pas plus de 100 articles par produit --");
                return;
            }
        } else {
            local.push(ticket);
        }
        localStorage.setItem("tickets", JSON.stringify(local));
    }

    function alerte (message) {
        alert.textContent = message;
        setTimeout(alerte, 3000);
    }

    function gestionAlertes () {
        if (color === "") {
            alerte("-- Choisissez une couleur --")
        }
        if (quantite <= "0") {
            alerte("-- Choisissez une quantité comprise entre 1 et 100 articles maximum --")
        }
        if (color === "" && quantite === "0") {
            alerte("-- Choisissez une couleur et choisissez une quantité comprise entre 1 et 100 articles maximum --");
        } 
        if (quantite >= 100) {
            alerte("-- Choisissez une quantité comprise entre 1 et 100 articles maximum --")
        }
        if (quantite > "0" && quantite < 100 && color !== "") {
            gestionLocalStorage()
            alerte("-- Kanap ajouté au panier --")
        }
    }
    if (Number.isInteger(ticket.quantite)) {
        gestionAlertes()
    // Sinon, je bloque les chiffres décimaux.
    } else {
        alerte("-- Entrez une quantité entière --")
    }
})
