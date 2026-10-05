const cartItemsContainer =
    document.querySelector("#cart-items");

const cartTotal =
    document.querySelector("#cart-total");

const checkoutButton =
    document.querySelector("#checkout-btn");

const cartMessage =
    document.querySelector("#cart-message");


let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


async function loadCart() {

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>

                <p>
                    Add some delicious food to your cart.
                </p>

                <a href="/#menu" class="primary-btn">
                    Browse Menu
                </a>
            </div>
        `;

        cartTotal.textContent = "$0.00";

        checkoutButton.disabled = true;

        return;
    }


    try {

        const productRequests = cart.map((item) =>
            fetch(`/api/products/${item.productId}`)
                .then((response) => response.json())
        );


        const products = await Promise.all(
            productRequests
        );


        cartItemsContainer.innerHTML = "";


        let total = 0;


        products.forEach((product, index) => {

            const cartItem = cart[index];

            const itemTotal =
                product.price * cartItem.quantity;


            total += itemTotal;


            const itemElement =
                document.createElement("div");

            itemElement.classList.add("cart-item");


            itemElement.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        $${product.price}
                    </p>

                </div>


                <div class="quantity-controls">

                    <button
                        class="quantity-btn"
                        data-id="${product.id}"
                        data-action="decrease"
                    >
                        −
                    </button>


                    <span>
                        ${cartItem.quantity}
                    </span>


                    <button
                        class="quantity-btn"
                        data-id="${product.id}"
                        data-action="increase"
                    >
                        +
                    </button>

                </div>


                <strong class="item-total">
                    $${itemTotal.toFixed(2)}
                </strong>


                <button
                    class="remove-btn"
                    data-id="${product.id}"
                >
                    Remove
                </button>

            `;


            cartItemsContainer.appendChild(
                itemElement
            );

        });


        cartTotal.textContent =
            `$${total.toFixed(2)}`;


        addCartEvents();


    } catch (error) {

        console.error(error);

        cartMessage.textContent =
            "Failed to load cart.";

    }
}


function addCartEvents() {

    document
        .querySelectorAll(".quantity-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        Number(button.dataset.id);

                    const action =
                        button.dataset.action;


                    const item =
                        cart.find(
                            (item) =>
                                item.productId === productId
                        );


                    if (!item) {
                        return;
                    }


                    if (action === "increase") {

                        item.quantity += 1;

                    }


                    if (action === "decrease") {

                        item.quantity -= 1;


                        if (item.quantity <= 0) {

                            cart =
                                cart.filter(
                                    (item) =>
                                        item.productId !== productId
                                );

                        }

                    }


                    saveCart();

                    loadCart();

                }
            );

        });


    document
        .querySelectorAll(".remove-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        Number(button.dataset.id);


                    cart =
                        cart.filter(
                            (item) =>
                                item.productId !== productId
                        );


                    saveCart();

                    loadCart();

                }
            );

        });

}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


checkoutButton.addEventListener(
    "click",
    async () => {

        const customerToken =
            localStorage.getItem("customerToken");


        if (!customerToken) {

            window.location.href =
                "/customer-login";

            return;

        }


        if (cart.length === 0) {
            return;
        }


        checkoutButton.disabled = true;

        checkoutButton.textContent =
            "Processing...";


        try {

            const response = await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization":
                            `Bearer ${customerToken}`
                    },

                    body: JSON.stringify({
                        items: cart
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                cartMessage.textContent =
                    data.message;

                checkoutButton.disabled = false;

                checkoutButton.textContent =
                    "Checkout";

                return;
            }


            localStorage.removeItem("cart");

            cart = [];


            cartMessage.textContent =
                "Order placed successfully!";

            cartMessage.classList.remove("error");

            cartMessage.classList.add("success");

            checkoutButton.textContent =
                "Order Placed";


            setTimeout(() => {

                window.location.href = "/";

            }, 1500);


        } catch (error) {

            console.error(error);
            
            cartMessage.textContent =
                "Something went wrong. Please try again.";

            cartMessage.classList.remove("success");

            cartMessage.classList.add("error");


            checkoutButton.disabled = false;

            checkoutButton.textContent =
                "Checkout";
        }

    }
);


loadCart();