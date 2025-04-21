document.addEventListener("DOMContentLoaded", async () => {
    const auth0 = await createAuth0Client({
        domain: "dev-xuv6q852cpf6upat.uk.auth0.com",
        client_id: "gi4vRUDc4fsZnK2siQFhknCgkSDHgZlL",
        redirect_uri: window.location.origin,
    });

    if (window.location.search.includes("code=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    const loginBtn = document.getElementById("login");
    loginBtn.addEventListener("click", async () => {
        await auth0.loginWithRedirect();
    });
});
