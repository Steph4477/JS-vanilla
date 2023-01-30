// Création d'une requête GET(méthode par défault) pour récupérer les données.
fetch("http://localhost:3000/api/products")

// Nous appelons la fonction then() pour récupérer le résultat de la requête au format json en verifiant si elle
// est ok avec (res.ok).
.then(function(res) {
    if (res.ok) {
        return res.json()
    }
})

// Ce résultat json nous le retournons et récupérons sous forme de tableau pour pouvoir l'exploiter et l'afficher.
.then(function(listeObjets) {
    console.table(listeObjets)
    // Je crée la variable du nombre de canapés du tableau.
    const nombreCanape = listeObjets.length
    // Je crée la boucle (i= nombre de ligne) tant qu'il reste des lignes continue la boucle.
    for ( let i = 0; i <= nombreCanape -1; i++ ){
    //Je lance la fonction construction sur la liste objets et j'incrémente i(nombre de ligne du tableau).      
        construction(listeObjets[i])
    }
})

// Erreur si pas connecté à l'api !
.catch(function(err){
    const titleCart = document.querySelector("h1")
    const sousTitleCart = document.querySelector("h2") 
    titleCart.innerHTML = "Produits indisponibles"
    titleCart.style.color = "red"
    sousTitleCart.innerHTML =""
    console.log("Erreur survenue // Produits indisponibles")
})

// Construction de l'affichage des produits.
function construction(canape) {
    // Création de l'élément "a"
    let objetLien = document.createElement("a")
    // Je donne la référence du lien en l'interpolant.
    objetLien.href = `./product.html?id=${canape._id}`  
    // Création de l'élément "article"
    let objetArticle = document.createElement("article")
    // Création de l'élément "image"
    let objetImage = document.createElement("img")
    // Je lui donne sa source.
    objetImage.src = canape.imageUrl
    // je lui donne son texte alternatif.
    objetImage.alt = canape.altTxt
    // Création du titre
    let productName = document.createElement("h3")
    // Je lui donne sa classe.
    productName.classList.add("productName")
    // Je donne le texte du titre.
    productName.textContent = canape.name
    // Création de la déscription.
    let productDescription = document.createElement("p")
    // Je lui donne sa classe.
    productDescription.classList.add("productDescription")
    // Je lui donne le texte de la description en allant le chercher dans l'api.
    productDescription.textContent = canape.description
    
    // Ajout des éléments à la page.
    // Je place les enfants de "article".
    objetArticle.appendChild(objetImage)
    objetArticle.appendChild(productName)
    objetArticle.appendChild(productDescription)
    // Je le place en enfant de "a".
    objetLien.appendChild(objetArticle)
    // Je selectionne l'id et je place le lien en enfant.
    document.querySelector("#items").appendChild(objetLien)
}
console.log("Tous les produits ont été chargés !")
