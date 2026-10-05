const loginForm = document.querySelector("#customer-login-form");
const loginMessage = document.querySelector("#customer-login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#customer-email").value;
    const password = document.querySelector("#customer-password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message;
            return;
        }

        if (data.user.role !== "customer") {
            loginMessage.textContent =
                "This login is for customers only.";

            return;
        }

        localStorage.setItem("customerToken", data.token);

        localStorage.setItem(
            "customer",
            JSON.stringify(data.user)
        );

        window.location.href = "/";

    } catch (error) {
        console.error(error);

        loginMessage.textContent =
            "Something went wrong. Please try again.";
    }
});