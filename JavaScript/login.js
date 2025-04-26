document.addEventListener("DOMContentLoaded", async () => {
    const auth0 = await createAuth0Client({
        domain: "fadeoutnetworks.us.auth0.com",
        client_id: "v8PIBvTSo9fq45Rqs6nVuBKKnk2y4UkL",
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