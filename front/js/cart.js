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
      suppressionProduit()
      modificationQuantite()
      
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
      calculPrixQuantite ()
    })
  })
}

function modificationQuantite() {
  let modifyQuantity = document.querySelectorAll(".itemQuantity")
  modifyQuantity.forEach(modify => {
    modify.addEventListener("change", function (e) {
      // Selection de l'élement à modifier en fonction de la valeur en chiffres de son input.
      let inputQuantityDom = e.target.closest("input").valueAsNumber
      console.log(inputQuantityDom)
      // Je rentre une condition pour que la quantité soit comprise entre 0 et 100 articles
      if (inputQuantityDom > 0 || inputQuantityDom < 100){
        // Je cible l'element data-id du DOM.
        let dataIdDom = e.target.closest("article").getAttribute("data-id")
        // Je cible l'élement data-color du DOM.
        let dataColorDom = e.target.closest("article").getAttribute("data-color")
        // Je fais un recherche d'index si l'id du localStorage est égale à l'id du DOM et pareil pour la couleur.
        const rechercheIndex = productsFromLs.findIndex((element) => element.id == dataIdDom && element.couleur == dataColorDom)
        // Je lui dis que la quantité du localStorage doit être égale celle du DOM et je supprime.
        productsFromLs[rechercheIndex].quantite = inputQuantityDom
        // Qu'il mette à jour le localStorage
        localStorage.setItem("tickets", JSON.stringify(productsFromLs))
        calculPrixQuantite ()     
      }
      
    })
  })
}


function validation (){
  let formulaires = document.querySelector(".cart__order__form")
  let nameRegex = /^[a-zA-Z\- ]{3,20}$/
  let addressRegex = /^[a-zA-Z\- 0-9]{3,100}$/
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  
  // je crée un tableau formulaires avec une ligne pour chaque input
  Array.from(formulaires).forEach((formulaire) => {
    
    //j'écoute les changement de chaque input au relachement de touches
    formulaire.addEventListener("keydown", () => {
      
      // Ecoute de la modification du prénom
      let firstName = document.getElementById("firstName")
      let firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
      let validFirstName = nameRegex.test(firstName.value) 
      console.log(validFirstName)
      if (validFirstName == true) {
        firstNameErrorMsg.style.color = "white"
        firstNameErrorMsg.innerHTML = "Prénom valide"
      } else {
      firstNameErrorMsg.style.color = "red"
      firstNameErrorMsg.innerHTML = "Prénom invalide."
      }

      // Ecoute de la modification du nom  
      let lastName = document.getElementById("lastName")
        let lastNameErrorMsg = document.getElementById("lastNameErrorMsg") 
        let validLastName = nameRegex.test(lastName.value)
      if (validLastName == true) {
        lastNameErrorMsg.style.color = "white"
        lastNameErrorMsg.innerHTML = "Nom valide"
      } else {
        lastNameErrorMsg.style.color = "red"
        lastNameErrorMsg.innerHTML = "Nom invalide."
      }

      // Ecoute de la modification de l'adresse
      let address = document.getElementById("address")
      let addressErrorMsg = document.getElementById("addressErrorMsg")
      let validAddress = addressRegex.test(address.value)
      if (validAddress == true) {
        addressErrorMsg.style.color = "white"
        addressErrorMsg.innerHTML = "Adresse valide"
      } else {
        addressErrorMsg.style.color = "red"
        addressErrorMsg.innerHTML = "Adresse invalide."
      }

      // Ecoute de la modification de la ville  
      let cityErrorMsg = document.getElementById("cityErrorMsg") 
      let city = document.getElementById ("city")
      let validCity = nameRegex.test(city.value)
      if (validCity == true) {
        cityErrorMsg.style.color = "white"
        cityErrorMsg.innerHTML = "ville valide"
      } else {
        cityErrorMsg.style.color = "red"
        cityErrorMsg.innerHTML = "Ville invalide ."
      }
  
      // Ecoute de la modification de l'email
      let emailErrorMsg = document.getElementById("emailErrorMsg")
      let email = document.getElementById("email")
      let validEmail = emailRegex.test(email.value)
      if (validEmail == true) {
        emailErrorMsg.style.color = "white"
        emailErrorMsg.innerHTML = "Email valide"
      } else {
        emailErrorMsg.style.color = "red"
        emailErrorMsg.innerHTML = "Email invalide."
      }
      console.log(validFirstName && validLastName && validAddress && validCity && validEmail )
      if (validFirstName && validLastName && validAddress && validCity && validEmail == true) {
        commander()
        console.log(contact)
      }
    })
    
  })
}
validation()

function commander() {
  const order = document.getElementById('order')
  order.addEventListener('click', () => {
    console.log(firstName)

   // je récupère les données du formulaire dans un objet
    const contact = {
      firstName : document.getElementById("firstName").value,
      lastName : document.getElementById("lastName").value,
      address : document.getElementById("address").value,
      city : document.getElementById("city").value,
      email : document.getElementById("email").value
    }
    console.log(contact)
   //Construction d'un array d'id depuis le local storage
    let products = [];
   
    productsFromLs.forEach(product => {
      products.push(product.id)
    })
    console.log(products);

    // je mets les données du formulaire et les produits sélectionnés dans le panier dans un objet...
    const sendFormData = {
      contact,
      products,
    }
    console.log(sendFormData)
    
    // j'envoie le formulaire + localStorage (sendFormData) 
    // ... que j'envoie au serveur
    const options = {
      method: 'POST',
      body: JSON.stringify(sendFormData),
      headers: { 
        'Content-Type': 'application/json',
      }
    }

    fetch("http://localhost:3000/api/products/order", options)
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('orderId', data.orderId)
      // définit l'URL actuelle de la page Web sur une nouvelle URL, qui est la page de confirmation (confirmation.html) avec une chaîne de requête en annexe. 
      // la chaîne de requête contient l'ID de clé et la valeur data.orderId. 
      // data.orderId est une variable qui contient l'ID de commande provenant du localStorage.
      // L'opérateur + est utilisé pour concaténer la chaîne confirmation.html?id= avec la valeur de la variable data.orderId du localStorage
      document.location.href = 'confirmation.html?id='+ data.orderId
      
    })

  }) // fin eventListener postForm
  
} /// fin envoi du formulaire postForm
  


