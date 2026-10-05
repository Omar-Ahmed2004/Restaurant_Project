const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || user.role !== "admin") {
    window.location.href = "/login";
}


const productsContainer = document.querySelector(
    "#admin-products-container"
);

const productForm = document.querySelector("#product-form");
const formSection = document.querySelector("#product-form-section");

const formTitle = document.querySelector("#form-title");
const formMessage = document.querySelector("#form-message");

const addProductButton = document.querySelector("#add-product-btn");
const cancelButton = document.querySelector("#cancel-btn");
const logoutButton = document.querySelector("#logout-btn");

let editingProductId = null;


// ====================
// Load Products
// ====================

async function loadProducts() {

    try {

        const response = await fetch("/api/products/admin/all", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const products = await response.json();

        productsContainer.innerHTML = "";

        products.forEach((product) => {

            const card = document.createElement("div");

            card.classList.add("admin-product-card");

            card.innerHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="admin-product-info">

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <strong>$${product.price}</strong>

                    <span>
                        ${product.isAvailable
                            ? "Available"
                            : "Unavailable"}
                    </span>

                    <div class="admin-product-actions">

                        <button
                            class="edit-btn"
                            data-id="${product.id}"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            data-id="${product.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

            productsContainer.appendChild(card);
        });


        document.querySelectorAll(".edit-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => editProduct(button.dataset.id)
                );

            });


        document.querySelectorAll(".delete-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => deleteProduct(button.dataset.id)
                );

            });

    } catch (error) {

        console.error(error);

    }
}


// ====================
// Add Product Button
// ====================

addProductButton.addEventListener("click", () => {

    editingProductId = null;

    formTitle.textContent = "Add Product";

    productForm.reset();

    formSection.style.display = "block";

    formMessage.textContent = "";
});


// ====================
// Cancel
// ====================

cancelButton.addEventListener("click", () => {

    formSection.style.display = "none";

    productForm.reset();

    editingProductId = null;

});


// ====================
// Save Product
// ====================

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.querySelector("#product-name").value;
    const description =
        document.querySelector("#product-description").value;
    const price =
        document.querySelector("#product-price").value;
    const image =
        document.querySelector("#product-image").files[0];
    const isAvailable =
        document.querySelector("#product-availability").value;


    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("isAvailable", isAvailable);


    if (image) {
        formData.append("image", image);
    }


    try {

        let url = "/api/products";
        let method = "POST";


        if (editingProductId) {

            url = `/api/products/${editingProductId}`;
            method = "PUT";

        }


        const response = await fetch(url, {

            method,

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData

        });


        const data = await response.json();


        if (!response.ok) {

            formMessage.textContent = data.message;

            return;

        }


        formMessage.textContent =
            "Product saved successfully.";


        productForm.reset();

        editingProductId = null;

        formSection.style.display = "none";


        loadProducts();


    } catch (error) {

        console.error(error);

        formMessage.textContent =
            "Something went wrong.";

    }

});


// ====================
// Edit Product
// ====================

async function editProduct(id) {

    try {

        const response =
            await fetch(`/api/products/${id}`);

        const product =
            await response.json();


        editingProductId = id;

        formTitle.textContent = "Edit Product";


        document.querySelector("#product-name").value =
            product.name;

        document.querySelector("#product-description").value =
            product.description;

        document.querySelector("#product-price").value =
            product.price;

        document.querySelector("#product-availability").value =
            product.isAvailable;


        formSection.style.display = "block";


    } catch (error) {

        console.error(error);

    }

}


// ====================
// Delete Product
// ====================

async function deleteProduct(id) {

    const confirmed =
        confirm("Are you sure you want to delete this product?");

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`/api/products/${id}`, {

                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        loadProducts();


    } catch (error) {

        console.error(error);

    }

}


// ====================
// Logout
// ====================

logoutButton.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login";

});


const adminOrdersContainer =
    document.querySelector("#admin-orders-container");

const refreshOrdersButton =
    document.querySelector("#refresh-orders");


async function loadAdminOrders() {

    if (!adminOrdersContainer) {
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    adminOrdersContainer.innerHTML = `
        <p class="orders-loading">
            Loading orders...
        </p>
    `;

    try {

        const response = await fetch("/api/orders/admin", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const orders = await response.json();

        if (!response.ok) {
            throw new Error(
                orders.message || "Failed to load orders"
            );
        }


        if (orders.length === 0) {

            adminOrdersContainer.innerHTML = `
                <div class="admin-empty-orders">

                    <h3>No orders yet</h3>

                    <p>
                        Customer orders will appear here.
                    </p>

                </div>
            `;

            return;
        }


        adminOrdersContainer.innerHTML = "";


        orders.forEach((order) => {

            const orderCard =
                document.createElement("div");

            orderCard.classList.add("admin-order-card");


            const orderDate =
                new Date(order.createdAt)
                    .toLocaleString();


            const itemsHTML =
                order.items.map((item) => {

                    return `
                        <div class="admin-order-item">

                            <span>
                                ${item.product.name}
                                × ${item.quantity}
                            </span>

                            <strong>
                                $${(
                                    item.price *
                                    item.quantity
                                ).toFixed(2)}
                            </strong>

                        </div>
                    `;

                }).join("");


            orderCard.innerHTML = `

                <div class="admin-order-header">

                    <div>

                        <h3>
                            Order #${order.id}
                        </h3>

                        <p>
                            ${orderDate}
                        </p>

                    </div>


                    <div class="admin-order-customer">

                        <strong>
                            ${order.user.name}
                        </strong>

                        <span>
                            ${order.user.email}
                        </span>

                    </div>

                </div>


                <div class="admin-order-items">

                    ${itemsHTML}

                </div>


                <div class="admin-order-footer">

                    <div class="admin-order-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            $${order.totalPrice.toFixed(2)}
                        </strong>

                    </div>


                    <div class="admin-order-status">

                        <label>
                            Status
                        </label>

                        <select
                            class="order-status-select"
                            data-id="${order.id}"
                        >

                            <option
                                value="pending"
                                ${order.status === "pending" ? "selected" : ""}
                            >
                                Pending
                            </option>

                            <option
                                value="preparing"
                                ${order.status === "preparing" ? "selected" : ""}
                            >
                                Preparing
                            </option>

                            <option
                                value="completed"
                                ${order.status === "completed" ? "selected" : ""}
                            >
                                Completed
                            </option>

                            <option
                                value="cancelled"
                                ${order.status === "cancelled" ? "selected" : ""}
                            >
                                Cancelled
                            </option>

                        </select>

                    </div>

                </div>

            `;


            adminOrdersContainer.appendChild(orderCard);

        });


        addOrderStatusEvents();


    } catch (error) {

        console.error(error);

        adminOrdersContainer.innerHTML = `
            <p class="admin-orders-error">
                Failed to load orders.
            </p>
        `;

    }
}


function addOrderStatusEvents() {

    document
        .querySelectorAll(".order-status-select")
        .forEach((select) => {

            select.addEventListener("change", async () => {

                const orderId =
                    Number(select.dataset.id);

                const newStatus =
                    select.value;

                const token =
                    localStorage.getItem("token");


                try {

                    const response =
                        await fetch(
                            `/api/orders/admin/${orderId}/status`,
                            {
                                method: "PATCH",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        `Bearer ${token}`
                                },

                                body: JSON.stringify({
                                    status: newStatus
                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Failed to update status"
                        );

                    }


                    console.log(
                        "Order status updated:",
                        data
                    );


                } catch (error) {

                    console.error(error);

                    alert(
                        "Failed to update order status"
                    );

                    loadAdminOrders();

                }

            });

        });

}

if (refreshOrdersButton) {

    refreshOrdersButton.addEventListener(
        "click",
        loadAdminOrders
    );

}
loadProducts();
loadAdminOrders();

