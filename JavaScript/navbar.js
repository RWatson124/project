let auth0Client = null;

async function loadNavbar() {
    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-content">
                <span class="brand">Murder Mystery</span>
                <ul class="nav-links" id="nav-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                </ul>
                <div class="profile-container">
                    <button id="profile-button" class="profile-button">Login</button>
                    <div id="dropdown-menu" class="dropdown hidden">
                        <p id="username-display" class="text-center font-bold mb-2">DetectiveName</p>
                        <p>Wins: <span id="win-count">0</span></p>
                        <p>Losses: <span id="loss-count">0</span></p>
                        <button id="logout-button" class="logout-button mt-2">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    `;

    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    document.addEventListener("click", function (event) {
        const dropdown = document.getElementById('dropdown-menu');
        const profileButton = document.getElementById('profile-button');

        if (!dropdown || !profileButton) return;

        if (profileButton.dataset.loggedIn === "true" && profileButton.contains(event.target)) {
            dropdown.classList.toggle('hidden');
        } else if (!dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });

    await configureAuth0();
}

async function configureAuth0() {
    auth0Client = await createAuth0Client({
        domain: "fadeoutnetworks.us.auth0.com",
        client_id: "v8PIBvTSo9fq45Rqs6nVuBKKnk2y4UkL",
        redirect_uri: getRedirectURI(),
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    });

    // 🔥 Handle redirect callback
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            const result = await auth0Client.handleRedirectCallback();
            console.log("Redirect callback handled:", result);
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.error("Error handling redirect", e);
        }
    }

    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("Is authenticated?", isAuthenticated);

    if (isAuthenticated) {
        showProfile();
    } else {
        showLoginButton();
    }
}

function getRedirectURI() {
    return window.location.origin + "/RWatson124/project/login.html"; // your actual path
}

function showLoginButton() {
    const profileButton = document.getElementById('profile-button');
    const dropdown = document.getElementById('dropdown-menu');

    profileButton.innerText = "Login";
    profileButton.dataset.loggedIn = "false"; // not logged in
    dropdown.classList.add('hidden');

    profileButton.addEventListener('click', async () => {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: getRedirectURI()
            }
        });
    });
}

async function showProfile() {
    const profileButton = document.getElementById('profile-button');
    const dropdown = document.getElementById('dropdown-menu');

    profileButton.innerText = "Profile ▾";
    profileButton.dataset.loggedIn = "true"; // now logged in
    dropdown.classList.add('hidden');

    const user = await auth0Client.getUser();
    console.log("User info:", user);

    document.getElementById('username-display').innerText = user.name || 'Detective';

    const wins = localStorage.getItem('wins') || 0;
    const losses = localStorage.getItem('losses') || 0;

    document.getElementById('win-count').innerText = wins;
    document.getElementById('loss-count').innerText = losses;

    document.getElementById('logout-button').addEventListener('click', () => {
        auth0Client.logout({
            logoutParams: {
                returnTo: getRedirectURI()
            }
        });
    });
}
