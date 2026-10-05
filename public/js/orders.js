const ordersContainer =
    document.querySelector("#orders-container");

const customerToken =
    localStorage.getItem("customerToken");


if (!customerToken) {
    window.location.href = "/customer-login";
}


async function loadOrders() {

    try {

        const response = await fetch("/api/orders/my-orders", {
            headers: {
                "Authorization": `Bearer ${customerToken}`
            }
        });

        const orders = await response.json();

        if (!response.ok) {
            throw new Error(
                orders.message || "Failed to load orders"
            );
        }

        if (orders.length === 0) {

            ordersContainer.innerHTML = `
                <div class="empty-orders">

                    <h2>No orders yet</h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a href="/#menu" class="primary-btn">
                        Browse Menu
                    </a>

                </div>
            `;

            return;
        }


        ordersContainer.innerHTML = "";


        orders.forEach((order) => {

            const orderElement =
                document.createElement("div");

            orderElement.classList.add("order-card");


            const orderDate =
                new Date(order.createdAt)
                    .toLocaleString();


            const itemsHTML =
                order.items.map((item) => {

                    return `
                        <div class="order-item">

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


            orderElement.innerHTML = `

                <div class="order-header">

                    <div>
                        <h2>
                            Order #${order.id}
                        </h2>

                        <p>
                            ${orderDate}
                        </p>
                    </div>

                    <span class="order-status ${order.status}">
                        ${order.status}
                    </span>

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-footer">

                    <span>
                        Total
                    </span>

                    <strong>
                        $${order.totalPrice.toFixed(2)}
                    </strong>

                </div>

            `;


            ordersContainer.appendChild(orderElement);

        });


    } catch (error) {

        console.error(error);

        ordersContainer.innerHTML = `
            <p class="orders-error">
                Failed to load your orders.
            </p>
        `;

    }
}


document
    .querySelector("#logout-btn")
    .addEventListener("click", () => {

        localStorage.removeItem("customerToken");
        localStorage.removeItem("customer");

        window.location.href = "/";

    });


loadOrders();