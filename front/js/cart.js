let productsFromLs = JSON.parse(localStorage.getItem("tickets"))
let productsFromApi = []
const titleCart = document.querySelector("h1")
const sectionCart = document.querySelector(".cart")

if (!productsFromLs){
  titleCart.innerHTML = "Votre panier est vide !"
  sectionCart.style.display = "none"
}

else {
  Panier();
}

function Panier() {
  document
    .getElementById("cart__items")
    .innerHTML = ``
  fetch("http://localhost:3000/api/products")
  //Récupère les valeurs de l'API et les retournent en json
  .then((res) => res.json())
  //Retourne les produits de l'api
  .then(function(api) {
    productsFromApi = api
    console.log(productsFromLs)
    productsFromLs.forEach(function(tickets) {
      // Je rentre une variable qui va chercher un produit(objet) dans l'api si son ._id coresspond à un .id du panier.
      let produitsApi = api.find((produits) => {
        return produits._id === tickets.id       
      })   
      document.getElementById("cart__items")
      // Je remplie le panier avec le locale storage si je n'ai pas l'info je cherche dans l'api.
      .innerHTML += `<article class="cart__item" data-id="${tickets.id}" data-color="${tickets.couleur}">
                      <div class="cart__item__img">
                        <img src="${produitsApi.imageUrl}" alt="${produitsApi.altTxt}">
                      </div>
                      <div class="cart__item__content">
                        <div class="cart__item__content__description">
                          <h2>${produitsApi.name}</h2>
                          <p>${tickets.couleur}</p>
                          <p>${produitsApi.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                          <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tickets.quantite}">
                          </div>
                          <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                          </div>
                        </div>
                      </div>
                    </article>`
      // Je lance la fonction calcul dans les produits inséré dans le local storage.
      calculPrixQuantite()
      suppressionProduit();
      modificationQuantite();
    })  
  })
  //Retourne une erreur dans la console
  .catch((error) => {
    console.log(error)
  })
}

function calculPrixQuantite () {
  let totalPrice = 0
  let totalQuantity = 0
  // Je vais chercher les elements dans le tableau de l'api que j'ai besoin.
  productsFromApi.forEach(productApi => {
    // Je vais chercher les elements dans le tableau du localStorage que j'ai besoin.
    productsFromLs.forEach(productLs => {
      // Si l'id du produit du tableau local storage [productsFromLs] correspond à l'id du produit de l'Api. 
      if(productLs.id == productApi._id) {
      // Calcule le prix total en multipliant le prix d'un produit par sa quantités et en ajoutant les produits à chaque itération au prix total.
      totalPrice += productApi.price * productLs.quantite
      console.log(totalPrice)
      // Je met le total des quantités en chiffre entier et je l'ajoute à chaque itération.
      totalQuantity += parseInt(productLs.quantite)
      console.log(totalQuantity)
      }
    })
  })
  document.getElementById("totalPrice")
  .innerText = totalPrice
  document.getElementById("totalQuantity")
  .innerText = totalQuantity
}

function suppressionProduit() {
  let boutonSupprimer = document.querySelectorAll(".deleteItem")
  boutonSupprimer.forEach(bouton => {
    bouton.addEventListener("click", function(e) {
      //Selection de l'element à supprimer en fonction de son id dans le DOM. 
      let dataIdDom = e.target.closest("article").getAttribute("data-id")
      //Selection de l'element à supprimer en fonction de sa couleur dans le DOM.
      let dataColorDom = e.target.closest("article").getAttribute("data-color")
      // Si l'id du localStorage et different de l'id du du DOM ou que la couleur et differente.
      productsFromLs = productsFromLs.filter( element => element.id !== dataIdDom || element.couleur !== dataColorDom )
      // Met à jour le localStorage.
      localStorage.setItem("tickets", JSON.stringify(productsFromLs))
      // Supprime l'article.
      e.target.closest("article").remove()
      //Alerte produit supprimé.
      alert("Ce produit a bien été supprimé du panier")
      // Recalcul de la quantité
      calculPrixQuantite (productsFromLs)
    })
  })
}

function modificationQuantite() {
  let modifyQuantity = document.querySelectorAll(".itemQuantity")
  modifyQuantity.forEach(modify => {
    modify.addEventListener("change", function (e) {
      //Selection de l'élement à modifier en fonction de la valeur de son input.
      let inputQuantityDom = e.target.closest("input").value
      console.log(inputQuantityDom)
      // Je cible l'element data-id du DOM.
      let dataIdDom = e.target.closest("article").getAttribute("data-id")
      // Je cible l'élement data-color du DOM.
      let dataColorDom = e.target.closest("article").getAttribute("data-color")
      // Je fais un recherche d'index si l'id du localStorage est égale à l'id du DOM et pareil pour la couleur.
      const rechercheIndex = productsFromLs.findIndex((element) => element.id == dataIdDom && element.couleur == dataColorDom)
      // Je lui dis que la quantité du localStorage doit être égale celle du DOM
      productsFromLs[rechercheIndex].quantite = inputQuantityDom
      // Qu'il mette à jour le localStorage
      localStorage.setItem("tickets", JSON.stringify(productsFromLs))
      alert("Quantité modifié")
      calculPrixQuantite (productsFromLs)
      // Article supprimé si quantité un 0
      if (productsFromLs[rechercheIndex].quantite <= "0"){
        e.target.closest("article").remove()
      }
    })
  })
}


 

  


