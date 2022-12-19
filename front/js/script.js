// Création d'une requête GET(méthode par défault) pour récupérer les données.
fetch("http://localhost:3000/api/products")
// Nous appelons la fonction then() pour récupérer le résultat de la requête au format json en verifiant si elle est ok avec (res.ok).
.then(function(res) {
    if (res.ok) {
        return res.json()
    }
})
// Ce résultat json nous le retournons et récupérons sous forme de tableau pour pouvoir l'exploiter et l'afficher.
.then(function(listeObjets) {
    console.table(listeObjets);
    // je crée la variable du nombre de canapés du tableau
    const nombreCanape = listeObjets.length;
    // je crée la boucle (i= nombre de ligne) tant qu'il reste des lignes continue la boucle
    for ( let i = 0; i <= nombreCanape -1; i++ ){
    //je lance la fonction construction sur la liste objets et j'incrémente i(nombre de ligne du tableau).      
        construction(listeObjets[i])
    }
})

.catch(function(err){
    console.log("erreur survenue")
});

function construction(canape){
    // je crée l'élément "a".
    let objetLien = document.createElement("a");
    // je selectionne l'id et je place le lien en enfant.
    document.querySelector("#items").appendChild(objetLien);
    // je donne la référence du lien.
    objetLien.href = `./product.html?id=${canape._id}`;  
    // je crée l'élément "article".
    let objetArticle = document.createElement("article");
    // Je le place en enfant de "a".
    objetLien.appendChild(objetArticle);
    // je crée l'élément "image".
    let objetImage = document.createElement("img");
    // Je le place en enfant de "article".
    objetArticle.appendChild(objetImage);
    // je lui donne sa source.
    objetImage.src = canape.imageUrl;
    // je lui donne son texte alternatif.
    objetImage.alt = canape.altTxt;
    // je crée le titre.
    let productName = document.createElement("h3");
    objetArticle.appendChild(productName);
    // je lui donne sa classe.
    productName.classList.add("productName");
    // je donne le texte du titre.
    productName.textContent = canape.name;
    // je crée la déscription.
    let productDescription = document.createElement("p");
    // je la met en enfant de article.
    objetArticle.appendChild(productDescription);
    // je lui crée sa classe.
    productDescription.classList.add("productDescription");
    // je lui donne sa description en allant la chercher dans l'api.
    productDescription.textContent = canape.description;
    
};
console.log("Tous les produits ont été chargés !")

    
    
    

