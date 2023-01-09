let produitsPanier = []
function Panier() {
  document
    .getElementById("cart__items")
    .innerHTML = ``
  fetch("http://localhost:3000/api/products")
  //Récupère les valeurs de l'API et les retournent en json
  .then((res) => res.json())
  //Retourne les canapés
  .then(function(api) {
    produitsPanier = api
    let tickets = localStorage.getItem("tickets")
    let ticketsParsed = JSON.parse(tickets)
    console.log(ticketsParsed)
    ticketsParsed.forEach(function(tickets) {
      let produitsApi = api.find((produits) => {
        return produits._id === tickets.id       
      })   
      document.getElementById("cart__items")
      .innerHTML += `<article class="cart__item" data-id="${tickets.id}" data-color="${tickets.couleur}">
                      <div class="cart__item__img">
                        <img src="${produitsApi.imageUrl}" alt="${produitsApi.altTxt}">
                      </div>
                      <div class="cart__item__content">
                        <div class="cart__item__content__description">
                          <h2>${tickets.name}</h2>
                          <p>${tickets.couleur}</p>
                          <p>${produitsApi.price}</p>
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
    })  
  })
  //Retourne une erreur dans la console
  .catch((error) => {
      console.log(error)
  })
}
Panier();


