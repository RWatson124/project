let auth0 = null;

const configureClient = async () => {
    auth0 = await createAuth0Client({
        domain: "dev-xuv6q852cpf6upat.uk.auth0.com",
        client_id: "MIjcyVi3C2wQEnj2PIvKwYpk6adXHSq1",
        cacheLocation: "localstorage",
        useRefreshTokens: true,
    });
};

window.onload = async () => {
    await configureClient();

    const isAuthenticated = await auth0.isAuthenticated();
    if (!isAuthenticated) {
        return auth0.loginWithRedirect({
            redirect_uri: window.location.origin + window.location.pathname,
        });
    }

    const user = await auth0.getUser();
    const profileContainer = document.getElementById("profile-container");
    const userPic = document.getElementById("user-pic");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    const userWins = document.getElementById("user-wins");

    const storedWins = localStorage.getItem(`wins-${user.sub}`) || 0;

    userPic.src = user.picture;
    userName.textContent = user.name;
    userEmail.textContent = user.email;
    userWins.textContent = storedWins;

    document.getElementById("loading").style.display = "none";
    profileContainer.classList.remove("hidden");

    document.getElementById("logout").addEventListener("click", () => {
        auth0.logout({
            returnTo: window.location.origin + "/login.html",
        });
    });
};
