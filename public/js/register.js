const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#register-message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name =
        document.querySelector("#register-name").value;

    const email =
        document.querySelector("#register-email").value;

    const password =
        document.querySelector("#register-password").value;


    try {

        const response = await fetch("/api/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });


        const data = await response.json();


        if (!response.ok) {

            registerMessage.textContent =
                data.message;

            return;
        }


        registerMessage.textContent =
            "Account created successfully. Redirecting...";


        setTimeout(() => {
            window.location.href = "/customer-login";
        }, 1000);


    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Something went wrong. Please try again.";

    }
});