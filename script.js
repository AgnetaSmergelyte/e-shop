const topNav = document.querySelectorAll('.top-nav > div');
const homeDiv = document.querySelector('.home');
const cartDiv = document.querySelector('.cart');
const cartWrapDiv = document.querySelector('.cart-wrap');
const allProductsDiv = document.querySelector('.products');
const cartCounterSpan = document.querySelector('#cart-items-count');
const totalPriceDiv = document.querySelector('.total-price');
const btnDeleteSelected = document.querySelector('.delete-selected');
const selectAll = document.querySelector('.check-all');
let checkboxesCart = [];

let productCardsDivs = [];

let allProducts = [];
let cartProducts = [];
let cartCounter = 0;
let totalPrice = 0;

topNav[0].onclick = () => {
    homeDiv.style.display = "block";
    cartWrapDiv.style.display = "none";
}
topNav[1].onclick = () => {
    homeDiv.style.display = "none";
    cartWrapDiv.style.display = "block";
}
const counter = (num) => {
    cartCounter += num;
    cartCounterSpan.textContent = cartCounter;
}
const updateTotal = (eur) => {
    eur = Number(eur);
    totalPrice += eur;
    totalPriceDiv.textContent = `Total price: ${totalPrice} Eur`
}
selectAll.onchange = () => {
    checkboxesCart = document.querySelectorAll('.check-product');
    if (selectAll.checked) {
        checkboxesCart.forEach(box => box.checked = true);
    } else checkboxesCart.forEach(box => box.checked = false);
}
btnDeleteSelected.onclick = () => {
    checkboxesCart = document.querySelectorAll('.check-product');
    productCardsDivs = document.querySelectorAll('.cart-item');
    let ID ="";
    let price = 0;
    checkboxesCart.forEach(box => {
        if (box.checked) {
            ID = box.id.toString();
            cartProducts.map(product => {
                if (product.id.toString() === ID) {
                    price = product.price * product.quantity;
                    updateTotal(-price);
                    counter(-product.quantity);
                }
            })
            cartProducts = cartProducts.filter(product => product.id.toString() !== ID);
            box.parentElement.remove();
        }
    })
    selectAll.checked = false;
}

const newProductCard = (item) => {
    const ID = item.id.toString()

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.id = ID;
    const productCheckbox = document.createElement('input');
    productCheckbox.type = "checkbox";
    productCheckbox.classList.add('check-product');
    productCheckbox.id = ID;

    const imgWrap = document.createElement('div');
    imgWrap.classList.add('img-wrap');
    imgWrap.style.backgroundImage = `url("${item.thumbnail}")`
    const productTexts = document.createElement('div');
    productTexts.classList.add('product-texts');
    const productNameP = document.createElement('p');
    productNameP.textContent = item.title;
    const productPriceP = document.createElement('p');
    productPriceP.textContent = item.price + " Eur";
    productTexts.append(productNameP, productPriceP);
    const middleDiv = document.createElement('div');
    middleDiv.classList.add('flex1');
    const cartCount = document.createElement('div');
    cartCount.classList.add('cart-count');
    const amountDiv = document.createElement('p');
    amountDiv.textContent = "Amount: " + item.quantity;
    const addRemoveBtns = document.createElement('div');
    addRemoveBtns.classList.add('add-or-remove');
    //add button
    const btnAdd = document.createElement('button');
    const addIcon = document.createElement('i');
    addIcon.classList.add("fas", "fa-arrow-up");
    btnAdd.appendChild(addIcon);
    btnAdd.onclick = () => {
        counter(1);
        updateTotal(item.price);
        cartProducts.map(x => {
            if (x.id.toString() === ID) x.quantity++;
            amountDiv.textContent = "Amount: " + item.quantity;
            priceDiv.textContent = item.price*item.quantity + " Eur";
        });
    };
    //remove button
    const btnRemove = document.createElement('button');
    const removeIcon = document.createElement('i');
    removeIcon.classList.add("fas", "fa-arrow-down");
    btnRemove.appendChild(removeIcon);
    btnRemove.onclick = () => {
        counter(-1);
        updateTotal(-item.price);
        cartProducts.map(x => {
            if (x.id.toString() === ID) x.quantity--;
            if (Number(x.quantity) === 0) {
                cartItem.remove();
                cartProducts= cartProducts.filter(y => y.id.toString() !== ID);
                return;
            }
            amountDiv.textContent = "Amount: " + item.quantity;
            priceDiv.textContent = item.price*item.quantity + " Eur";
        })
    };

    addRemoveBtns.append(btnAdd, btnRemove);
    cartCount.append(amountDiv, addRemoveBtns)

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('price');
    priceDiv.textContent = item.price + " Eur";
    // totalPrice += item.price;
    updateTotal(item.price);
    cartItem.append(productCheckbox, imgWrap, productTexts, middleDiv, cartCount, priceDiv);
    cartDiv.appendChild(cartItem);
}
const addToCart = (e) => {
    counter(1);
    const selectedID =e.target.id;

    //check if it is already in cart
    let isInCart = false;
    cartProducts.map(product => {
        if (product.id.toString() === selectedID) {
            isInCart = true;
            product.quantity ++;
            productCardsDivs = document.querySelectorAll('.cart-item');
            productCardsDivs.forEach(div => {
                if (div.id.toString() === selectedID) {
                    let howMany = div.children[4].children[0].textContent;
                    howMany = howMany[howMany.length-1];
                    howMany = Number(howMany) + 1;
                    div.children[4].children[0].textContent = "Amount: " + howMany;
                    div.children[5].textContent = product.price*product.quantity + " Eur";
                    updateTotal(product.price);
                }
            })
        }
    })
    if (!isInCart) {
        const newProductObject = allProducts.find(product => product.id.toString() === selectedID);
        newProductObject.quantity = 1;
        cartProducts.push(newProductObject);
        newProductCard(newProductObject);
    }
}

const displayProducts = (products) => {
    console.log(products);
    products.map(x => {
        const card = document.createElement('div');
        const productImg = document.createElement('div');
        productImg.classList.add('img-wrap');
        productImg.style.backgroundImage = `url("${x.thumbnail}")`
        const title = document.createElement('h3');
        title.textContent = x.title;
        const price = document.createElement('p');
        price.textContent = x.price + " €";
        const btnAddToCart = document.createElement('button');
        btnAddToCart.textContent = "Add To Cart"
        btnAddToCart.id = x.id;
        btnAddToCart.onclick = (e) => addToCart(e);
        card.append(productImg, title, price, btnAddToCart);
        allProductsDiv.appendChild(card);
    })
}

fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        displayProducts(allProducts);
    });