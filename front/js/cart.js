const titleCart = document.querySelector("h1")
const sectionCart = document.querySelector(".cart")
let productsFromLs = JSON.parse(localStorage.getItem("tickets"))
let productsFromApi = []

if (!productsFromLs){
  titleCart.innerHTML = "Votre panier est vide !"
  sectionCart.style.display = "none"
}

else {
  Panier()
}

function Panier() {
  let cartDom = document.getElementById("cart__items")
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((api) => {
      productsFromApi = api
      console.log(productsFromLs)
      productsFromLs.forEach((tickets) => {
        let produitsApi = api.find((produits) => produits._id === tickets.id)
        let article = document.createElement("article")
        article.className = "cart__item"
        article.setAttribute("data-id", tickets.id)
        article.setAttribute("data-color", tickets.couleur)

        let imgDiv = document.createElement("div")
        imgDiv.className = "cart__item__img"
        article.appendChild(imgDiv)

        let img = document.createElement("img")
        img.src = produitsApi.imageUrl
        img.alt = produitsApi.altTxt
        imgDiv.appendChild(img)

        let contentDiv = document.createElement("div")
        contentDiv.className = "cart__item__content"
        article.appendChild(contentDiv)
        
        
        let descriptionDiv = document.createElement("div")
        descriptionDiv.className = "cart__item__content__description"
        contentDiv.appendChild(descriptionDiv)

        let h2 = document.createElement("h2")
        h2.textContent = produitsApi.name
        descriptionDiv.appendChild(h2)
        

        let p1 = document.createElement("p")
        p1.textContent = tickets.couleur
        descriptionDiv.appendChild(p1)

        let p2 = document.createElement("p")
        p2.textContent = produitsApi.price + " €"
        descriptionDiv.appendChild(p2)

        let settingsDiv = document.createElement("div")
        settingsDiv.className = "cart__item__content__settings"
        contentDiv.appendChild(settingsDiv)

        let quantityDiv = document.createElement("div")
        quantityDiv.className = "cart__item__content__settings__quantity"
        settingsDiv.appendChild(quantityDiv)

        let p3 = document.createElement("p")
        p3.textContent = "Qté : "
        quantityDiv.appendChild(p3)

        let input = document.createElement("input")
        input.type = "number"
        input.className = "itemQuantity"
        input.name = "itemQuantity"
        input.min = "1"
        input.max = "100"
        input.value = tickets.quantite
        quantityDiv.appendChild(input)

        settingsDiv.appendChild(quantityDiv)

        let deleteDiv = document.createElement("div")
        deleteDiv.className = "cart__item__content__settings__delete"

        let deleteP = document.createElement("p")
        deleteP.className = "deleteItem"
        deleteP.textContent = "Supprimer"
        deleteDiv.appendChild(deleteP)

        settingsDiv.appendChild(deleteDiv)
        contentDiv.appendChild(settingsDiv)
        cartDom.appendChild(article)
      })
      
      // Je lance la fonction calcul dans les produits insérés dans le localStorage.
      calculPrixQuantite()
      suppressionProduit()
      modificationQuantite()
    })
}

function calculPrixQuantite () {
  let totalPrice = 0
  let totalQuantity = 0
  // Je vais chercher les éléments dans le tableau de l'api dont j'ai besoin.
  productsFromApi.forEach(productApi => {
    // Je vais chercher les éléments dans le tableau du localStorage dont j'ai besoin.
    productsFromLs.forEach(productLs => {
      // Si l'id du produit du tableau local storage [productsFromLs] corresponds à l'id du produit de l'Api. 
      if(productLs.id == productApi._id) {
      // Calcule le prix total en multipliant le prix d'un produit par sa quantité et en ajoutant les produits
      // à chaque itération au prix total.
      totalPrice += productApi.price * productLs.quantite
      console.log(totalPrice)
      // Je met le total des quantités en chiffres entiers et l'ajoute à chaque itération.
      totalQuantity += parseInt(productLs.quantite)
      console.log(totalQuantity)
      }
    })
  })
  document.getElementById("totalPrice").innerText = totalPrice
  document.getElementById("totalQuantity").innerText = totalQuantity
}

function suppressionProduit() {
  let boutonSupprimer = document.querySelectorAll(".deleteItem")
  boutonSupprimer.forEach(bouton => {
    bouton.addEventListener("click", function(e) {
      // Selection de l'élément à supprimer en fonction de son id dans le DOM. 
      let dataIdDom = e.target.closest("article").getAttribute("data-id")
      // Selection de l'élément à supprimer en fonction de sa couleur dans le DOM.
      let dataColorDom = e.target.closest("article").getAttribute("data-color")
      // Si l'id du localStorage est différent de l'id du du DOM ou que la couleur est différente.
      productsFromLs = productsFromLs.filter( element => element.id !== dataIdDom || element.couleur !== dataColorDom )
      // Met à jour le localStorage.
      localStorage.setItem("tickets", JSON.stringify(productsFromLs))
      // Supprime l'article.
      e.target.closest("article").remove()
      // Alerte produit supprimé.
      alert("Ce produit a bien été supprimé du panier")
      // Recalcul de la quantité
      calculPrixQuantite ()
      if (productsFromLs == productsFromLs.length){
        titleCart.innerHTML = "Votre panier est vide !"
        sectionCart.style.display = "none"
      }
    })
  })
}

function modificationQuantite() {
  const modifyQuantity = document.querySelectorAll(".itemQuantity")
  modifyQuantity.forEach(modify => {
    modify.addEventListener("change", function (e) {
      // Selection de l'élément à modifier en fonction de la valeur en chiffres de son input.
      const inputQuantityDom = e.target.closest("input").valueAsNumber
      // Je rentre une condition pour que la quantité soit un entier compris entre 1 et 100.
      if (!Number.isInteger(inputQuantityDom) || inputQuantityDom <= 0 || inputQuantityDom >= 100) {
        alert("-- Entrez une quantité entière --")
        return
      }
      // Je cible l'élément data-id du DOM.
      const dataIdDom = e.target.closest("article").getAttribute("data-id")
      // Je cible l'élément data-color du DOM.
      const dataColorDom = e.target.closest("article").getAttribute("data-color")
      // Je fais un recherche d'index si l'id du localStorage est égale à l'id du DOM et pareil pour la couleur.
      const rechercheIndex = productsFromLs.findIndex((element) => element.id == dataIdDom && element.couleur == dataColorDom)
      // Je lui dis que la quantité du localStorage doit être égale à celle du DOM et je supprime.
      productsFromLs[rechercheIndex].quantite = inputQuantityDom
      // Qu'il mette à jour le localStorage.
      localStorage.setItem("tickets", JSON.stringify(productsFromLs))
      calculPrixQuantite()
    })
  })
}

// Fonction de verification des regex, elle renvoie un booléan "true" écriture "Valide blanc" ou
// "false" écriture "Invalide rouge" si regex valide ou invalide.
function checkInput(input, msgError, msgOk, regex, idNode) {
  const errorMessage = document.getElementById(`${idNode}ErrorMsg`)
  const isValid = regex.test(input.value)
  if (isValid) {
    errorMessage.style.color = "white"
    errorMessage.innerHTML = msgOk
    return true
  } else {
    errorMessage.style.color = "red"
    errorMessage.innerHTML = msgError
    return false
  }
}

const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const address = document.getElementById("address")
const city = document.getElementById("city")
const email = document.getElementById("email")
const order = document.getElementById("order")

const nameRegex = /^[A-ZÀ-ÿ][A-Za-zÀ-ÿ'-]+$/
const addressRegex = /^[a-zA-Z\- 0-9]{3,100}$/
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

firstName.addEventListener("input", function() {
  checkInput(firstName, "Prénom invalide", "Prénom valide", nameRegex, "firstName")
})
lastName.addEventListener("input", function() {
  checkInput(lastName, "Nom invalide", "Nom valide", nameRegex, "lastName")
})
address.addEventListener("input", function() {
  checkInput(address, "Adresse invalide", "Adresse valide", addressRegex, "address")
})
city.addEventListener("input", function() {
  checkInput(city, "Ville invalide", "Ville valide", nameRegex, "city")
})
email.addEventListener("input", function() {
  checkInput(email, "Email invalide", "Email valide", emailRegex, "email")
})

order.addEventListener("click", (e) => {
  e.preventDefault()
  // Je verifie quand on clique sur le bouton commander que mes "inputs" soient bien renseignées par le
  // visiteur("true") si tout est bon, on commande !
  if (checkInput(firstName, "Prénom invalide", "Prénom valide", nameRegex, "firstName") &&
      checkInput(lastName, "Nom invalide", "Nom valide", nameRegex, "lastName") &&
      checkInput(address, "Adresse invalide", "Adresse valide", addressRegex, "address") &&
      checkInput(city, "Ville invalide", "Ville valide", nameRegex, "city") &&
      checkInput(email, "Email invalide", "Email valide", emailRegex, "email")) {
    commander()
  }else {
    titleCart.style.color = "red"
    titleCart.innerHTML = "Formulaire invalide"
    // Permet de remonter le scroll en haut à gauche de la fenêtre.
    window.scrollTo(0, 0);

  }
})

function commander() {
  // Je récupère les données du formulaire dans un objet.
  const contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  }
  console.log(contact)
 
  // Construction d'un array d"id depuis le local storage.
  let products = []
  // Dans mon tableau j'insère les id des produits du localStorage ligne par ligne.
  productsFromLs.forEach(product => {
    products.push(product.id)
  })
  console.log(products)
  
  // je mets les données du formulaire rempli et les produits sélectionnés dans le panier, dans un objet...
  const sendFormData = {
    contact,
    products,
  }
  console.log(sendFormData)
  
  // j"envoie le formulaire + localStorage (sendFormData) 
  // ... que j"envoie au serveur avec la methode "POST"
  const options = {
    method: "POST",
    body: JSON.stringify(sendFormData),
    headers: { 
      "Content-Type": "application/json",
    }
  }

  fetch("http://localhost:3000/api/products/order", options)
  .then(response => response.json())
  .then(data => {
    // Définis l'URL actuelle de la page Web sur une nouvelle URL, qui est la page de confirmation 
    // (confirmation.html) avec une chaîne de requêtes en annexe. 
    // La chaîne de requêtes contient l'ID et la valeur data.orderId. 
    // Data.orderId est une variable qui contient l'ID de commande.
    // L'opérateur + est utilisé pour concaténer (mettre en une seule chaine de caractére) 
    // La chaîne confirmation.html?id= 
    document.location.href = "confirmation.html?id="+ data.orderId 
  })
} /// fin envoi du formulaire, commande effectuée

