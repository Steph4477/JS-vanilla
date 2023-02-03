const id = new URL(window.location.href).searchParams.get("id")
console.log(id)
// Je place le numèro de commande sur le ticket commande validée !
const orderId = document.getElementById('orderId')
orderId.innerHTML = id 
localStorage.clear()
