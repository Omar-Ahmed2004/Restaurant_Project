const menuContainer = document.querySelector("#menu-container");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


async function loadProducts() {
    try {
        const response = await fetch("/api/products");

        const products = await response.json();

        menuContainer.innerHTML = "";

        products.forEach((product) => {
            const card = document.createElement("div");

            card.classList.add("food-card");

            card.innerHTML = `
                <div class="food-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div class="food-info">
                    <h3>${product.name}</h3>

                    <p>
                        ${product.description}
                    </p>

                    <span class="price">
                        $${product.price}
                    </span>

                    <button
                        class="add-to-cart"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>
                </div>
            `;

            menuContainer.appendChild(card);
        });
        
        document
            .querySelectorAll(".add-to-cart")
            .forEach((button) => {

                button.addEventListener("click", () => {

                    const productId = Number(button.dataset.id);

                    addToCart(productId);

                    button.textContent = "Added ✓";
                    button.classList.add("added");

                    setTimeout(() => {
                        button.textContent = "Add to Cart";
                        button.classList.remove("added");
                    }, 1000);

                });

            });

    } catch (error) {
        console.error("Failed to load products:", error);
    }
}


function addToCart(productId) {

    const existingItem = cart.find(
        (item) => item.productId === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            productId: productId,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    console.log("Cart:", cart);
}


const loginLink = document.querySelector("#login-link");
const registerLink = document.querySelector("#register-link");
const logoutButton = document.querySelector("#logout-btn");

const customerToken = localStorage.getItem("customerToken");

if (customerToken) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutButton.style.display = "inline-block";
}

logoutButton.addEventListener("click", () => {

    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");

    window.location.reload();

});


function updateCartCount() {

    const cartCount =
        document.querySelector("#cart-count");

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
}



updateCartCount();

loadProducts();