let auth0Client = null;

async function loadNavbar() {
    // Generate the HTML for the navbar for easy insertion and modification of nav links within it ( PLEASE DO NOT EDIT WITHOUT CONSULTING ME FIRST! -CM)
    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-content">
                <span class="brand">Murder Mystery</span>
                <ul class="nav-links" id="nav-links">
                    <li><a href="../homepage.html">Home</a></li>
                    <li><a href="../startgame.html">Start Game</a></li>
                    <li><a href="Settings Page/SettingsIndex.html">Settings</a></li>
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

    // Insert the navbar HTML into the body of the app running it
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // Add CSS styles for the navbar and dropdown allows for the dropdown to be hidden by default offering a more sleek look comprared to showing all the info on a seperate page
    document.addEventListener("click", function (event) {
        const dropdown = document.getElementById('dropdown-menu');
        const profileButton = document.getElementById('profile-button');

        if (!dropdown || !profileButton) return;

        if (profileButton.dataset.loggedIn === "true" && profileButton.contains(event.target)) {
            dropdown.classList.toggle('hidden'); // Hides the dropdown if logged in
        } else if (!dropdown.contains(event.target)) {
            dropdown.classList.add('hidden'); // Shows the dropdown if logged out
        }
    });

    await configureAuth0();
}

// ALL of the Auth0 credentials are public related so there is no risk of exposing them by including them in the code so dont worry since its on github

async function configureAuth0() {
    auth0Client = await createAuth0Client({
        domain: "fadeoutnetworks.us.auth0.com",
        client_id: "v8PIBvTSo9fq45Rqs6nVuBKKnk2y4UkL",
        redirect_uri: getRedirectURI(),
        cacheLocation: 'localstorage',
        useRefreshTokens: true
    });

    // Handles the redirection of the user after logging in or signing up to a valid redirect URI ( login.html )

    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            const result = await auth0Client.handleRedirectCallback();
            console.log("Redirect callback handled:", result);
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.error("Error handling redirect", e);
        }
    }

    // Check if the user is logged in already and show the profile or login button accordingly

    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("Is authenticated?", isAuthenticated);

    if (isAuthenticated) {
        showProfile();
    } else {
        showLoginButton();
    }
}

// Gets the redirect URL for the login / signup process using the users current URL and the login.html page

function getRedirectURI() {
    return window.location.origin + "/login.html"; 
}

// Shows the login button and sets up the event listener for it to allow the user to actually login to the game with Auth0

function showLoginButton() {
    const profileButton = document.getElementById('profile-button');
    const dropdown = document.getElementById('dropdown-menu');

    profileButton.innerText = "Login";
    profileButton.dataset.loggedIn = "false"; 
    dropdown.classList.add('hidden');

    profileButton.addEventListener('click', async () => {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: getRedirectURI()
            }
        });
    });
}

// Shows the profile button and updates the dropdown with the user's information including there wins and wrong accusations

async function showProfile() {
    const profileButton = document.getElementById('profile-button');
    const dropdown = document.getElementById('dropdown-menu');

    const user = await auth0Client.getUser();

    const wins = localStorage.getItem("wins") || 0;
    const wrongAccusations = localStorage.getItem("wrong_accusations") || 0;

    profileButton.innerText = `${user.nickname || 'Detective'} (Wins: ${wins} | Wrong: ${wrongAccusations}) ▾`;
    profileButton.dataset.loggedIn = "true"; // now logged in
    dropdown.classList.add('hidden');

    // Updates the dropdown with the users information from Auth0 and local storage
    document.getElementById('username-display').innerText = user.name || 'Detective';
    document.getElementById('win-count').innerText = wins; // Shows users wins
    document.getElementById('loss-count').innerText = wrongAccusations; // Shows users wrong accusations


    // logs user out of the game 
    document.getElementById('logout-button').addEventListener('click', () => {
        auth0Client.logout({
            logoutParams: {
                returnTo: getRedirectURI()
            }
        });
    });
}

