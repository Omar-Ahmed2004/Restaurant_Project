const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

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

        localStorage.setItem("token", data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        window.location.href = "/admin";

    } catch (error) {
        console.error(error);

        loginMessage.textContent =
            "Something went wrong. Please try again.";
    }
});