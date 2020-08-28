var modal = document.getElementById("myModal");
var btn = document.getElementById("modal-button");
var span = document.getElementsByClassName("close")[0];

var roadContainer = document.getElementById("road-container");
var cartPoint = document.getElementById("cart-point");
var dataPoint = document.getElementById("data-point");
var deliveryPoint = document.getElementById("delivery-point");
var paymentPoint = document.getElementById("payment-point");

var cartLabel = document.getElementById("cart-label");
var dataLabel = document.getElementById("data-label");
var deliveryLabel = document.getElementById("delivery-label");
var paymentLabel = document.getElementById("payment-label");
var progressLine = document.getElementById("progress-line");

var cartContainer = document.getElementById("cart-container");

var cartSum = document.getElementById("cart-sum");
var discount = document.getElementById("discount");
var promoCode = document.getElementById("promo-code");
var promoCheck = document.getElementById("promo-check");
var overallPrice = document.getElementById("overall-price");

var shoppingCart = [
  {
    id: 0,
    name: "Футболка",
    variant: "Черный",
    image: "shirt.png",
    price: 490,
    quantity: 2
  },
  {
    id: 1,
    name: "Толстовка",
    variant: "Желтый",
    image: "hoodie.png",
    price: 1990,
    quantity: 1
  }
]

var promoCodes = [
  {
    name: 'TILDA',
    amount: 0.1
  },
  {
    name: 'CART',
    amount: 0.05
  }
]

var promoDiscount = 0;

var currentTab;

function updateCart() {
  var overallSum = 0;
  cartContainer.innerHTML = '';
  for (item of shoppingCart) {
    const sum = item.price*item.quantity;
    const markup = `
      <div class="shopping-item">
        <div class="img-container">
            <img src="img/${item.image}" width=70 height=70></img>
        </div>
        <div class="name-container">
            <span class="name-primary">${item.name}</span><br>
            <span class="name-secondary">${item.variant}</span>
        </div>
        <div class="q-container">
            <button class="q-button" onclick="decQuantity(${item.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
                    <g id="Group_21" data-name="Group 21" transform="translate(-1028 -396)">
                      <line id="Line_6" data-name="Line 6" x2="8" transform="translate(1033 397) rotate(90)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2"/>
                      <line class="q-icon" id="Line_5" data-name="Line 5" x2="8" transform="translate(1029 401)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
                    </g>
                </svg>                              
            </button>
            <span class="q">${item.quantity}</span>
            <button class="q-button" onclick="incQuantity(${item.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
                    <g id="Group_2" data-name="Group 2" transform="translate(-1028 -396)">
                      <line class="q-icon" id="Line_5" data-name="Line 5" x2="8" transform="translate(1029 401)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
                      <line class="q-icon" id="Line_6" data-name="Line 6" x2="8" transform="translate(1033 397) rotate(90)" fill="none" stroke="#000" stroke-linecap="round" stroke-width="2"/>
                    </g>
                  </svg>                              
            </button>
        </div>

        <div class="price">
            ${sum}₽
        </div>
    
        <button class="close-button" onclick="deleteItem(${item.id})">
            &times;
        </button>
      </div>
    `;

    cartContainer.innerHTML += markup;
    overallSum += sum;
  }
  cartSum.textContent = overallSum + "₽";
  discount.textContent = promoDiscount*overallSum + "₽";
  overallPrice.textContent = overallSum - promoDiscount*overallSum + "₽";
}

function onChangeDiscount(event) {
  var code = promoCodes.find(item => item.name.toUpperCase() === event.target.value.toUpperCase());
  if (code) {
    promoDiscount = code.amount;
    promoCheck.style.opacity = 1;
    updateCart();
  } else {
    promoCheck.style.opacity = 0;
    promoDiscount = 0;
    updateCart();
  }
}

function deleteItem(id) {
  shoppingCart = shoppingCart.filter(item => item.id !== id);
  updateCart();
}

function incQuantity(id) {
  shoppingCart.find(item => item.id === id).quantity++;
  updateCart();
}

function decQuantity(id) {
  const res = shoppingCart.find(item => item.id === id).quantity--;
  if (res <= 1) {
    deleteItem(id);
  }
  updateCart();
}

function setPointsPositions(cartP, dataP, deliP, paymP) {
  cartPoint.style.left = cartP + 'px';
  dataPoint.style.left = dataP + 'px';
  deliveryPoint.style.left = deliP + 'px';
  paymentPoint.style.left = paymP + 'px';
}

function setLabelsPositions(cartL, dataL, deliL, paymL) {
  cartLabel.style.left = cartL + 'px';
  dataLabel.style.left = dataL + 'px';
  deliveryLabel.style.left = deliL + 'px';
  paymentLabel.style.left = paymL + 'px';
}

function setPointsFinished(n) {
  const points = [cartPoint, dataPoint, deliveryPoint, paymentPoint];

  for (let i = 0; i < n; i++) {
    points[i].classList.add('road-point-finished');
    points[i].innerHTML = "&check;";
  }
  for (let i = n; i < 4; i++) {
    points[i].classList.remove('road-point-finished');
    points[i].textContent = String(i+1);
  }
}

function setLabelsFinished(n) {
  console.log(n);
  const labels = [cartLabel, dataLabel, deliveryLabel, paymentLabel];
  const all = ["road-label", "road-label-finished", "road-label-active"];

  for (let i = 0; i < n; i++) {
    labels[i].classList.remove(...all);
    labels[i].classList.add("road-label-finished");
  }

  labels[n].classList.remove(...all);
  labels[n].classList.add("road-label-active");

  for (let i = n+1; i < 4; i++) {
    labels[i].classList.remove(...all);
    labels[i].classList.add("road-label");
  }
}


function updateMap(state) {
  setPointsFinished(state);
  setLabelsFinished(state);

  switch(state) {
    case 0:
        setPointsPositions(0, 460, 550, 640);
        setLabelsPositions(5,425,510,610);

        progressLine.style.width = '0px';
        break;
    case 1:
        setPointsPositions(0, 90, 550, 640);
        setLabelsPositions(5,5,510,610);

        progressLine.style.width = '90px';
        break;
    case 2:
        setPointsPositions(0, 90, 180, 640);
        setLabelsPositions(5,95,90,610);

        progressLine.style.width = '180px';
        break;
    case 3:
        setPointsPositions(0,90,180,640);
        setLabelsPositions(5,95,180,515);

        progressLine.style.width = '640px';
        break;
    default:
        break;
    }
}

btn.onclick = function() {
  modal.style.display = "block";
  if (currentTab !== 4) {
    currentTab = -1;
    moveForward();
  }
}

span.onclick = closeModal();

window.onclick = function() {
  if (event.target == modal) {
    closeModal();
  }
}

function closeModal() {
  modal.style.display = "none";
}

function moveForward() {
  updateCart();
  var tabcontent;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
    
  currentTab++;
  updateMap(currentTab);
  document.getElementById("tab" + currentTab).style.display = "block";
}

function moveBackward() {
  var tabcontent;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
    
  currentTab--;
  updateMap(currentTab);
  document.getElementById("tab" + currentTab).style.display = "block";
}

function toFinish() {
  var i, tabcontent;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  roadContainer.style.display = "none";

  document.getElementById("tab4").style.display = "block";
  currentTab = 4;
}