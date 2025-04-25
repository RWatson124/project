document.addEventListener("DOMContentLoaded", async () => {
    const auth0 = await createAuth0Client({
        domain: "dev-xuv6q852cpf6upat.uk.auth0.com",
<<<<<<< HEAD
        client_id: "MIjcyVi3C2wQEnj2PIvKwYpk6adXHSq1",
        redirect_uri: window.location.origin,
=======
        client_id: "gi4vRUDc4fsZnK2siQFhknCgkSDHgZlL",
        redirect_uri: window.location.origin
>>>>>>> ff6e88166d90cbb87604dde2430d1344eb653bfc
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
