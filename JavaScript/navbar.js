/*  Load and initialize Auth0 */
let auth0Client = null; // variable to hold the Auth0 instance

//load the navbar into the page
async function loadNavbar() {
    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-content">
                <span class="brand">Murder Mystery</span>
                <ul class="nav-links" id="nav-links">
                    <li><a href="homepage.html">Home</a></li>
                    <li><a href="characterSelection.html">Start Game</a></li>
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

    // Insert navbar HTML at the very top of the <body>
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // Handles showing and hiding dropdown menu based on clicking the profile button
    document.addEventListener("click", function (event) {
        const dropdown = document.getElementById('dropdown-menu');
        const profileButton = document.getElementById('profile-button');

        if (!dropdown || !profileButton) return; // checks if elements exist

        if (profileButton.dataset.loggedIn === "true" && profileButton.contains(event.target)) {
            dropdown.classList.toggle('hidden'); // Toggle dropdown if clicking on the profile button
        } else if (!dropdown.contains(event.target)) {
            dropdown.classList.add('hidden'); // Hide dropdown if clicking outside of it
        }
    });

    await configureAuth0(); // After navbar is loaded initialize Auth0
}

// Set up Auth0 authentication
async function configureAuth0() {
    auth0Client = await createAuth0Client({
        domain: "fadeoutnetworks.us.auth0.com", //  Auth0 domain
        client_id: "v8PIBvTSo9fq45Rqs6nVuBKKnk2y4UkL", //  Auth0 client ID
        redirect_uri: getRedirectURI(), // Redirect URI after login
        cacheLocation: 'localstorage', // Store tokens in localstorage
        useRefreshTokens: true // Use refresh tokens to stay logged in longer and not require to relogin
    });

    // if user has been redirected back after login then it handles the redirect
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
            const result = await auth0Client.handleRedirectCallback(); // Finish login process
            console.log("Redirect callback handled:", result);
            window.history.replaceState({}, document.title, window.location.pathname); // Clean up the URL
        } catch (e) {
            console.error("Error handling redirect", e);
        }
    }

    // Check if user is already loggesd in
    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log("Is authenticated?", isAuthenticated);

    // Update navbar based on login status (Logged in or logged out)
    if (isAuthenticated) {
        showProfile();
    } else {
        showLoginButton();
    }
}

// Build the correct redirect URI based on current domain and login page
function getRedirectURI() {
    return window.location.origin + "/RWatson124/project/login.html"; 
}

// Update the navbar to show "Login" button
function showLoginButton() {
    const profileButton = document.getElementById('profile-button');
    const dropdown = document.getElementById('dropdown-menu');

    profileButton.innerText = "Login"; // Set button text
    profileButton.dataset.loggedIn = "false"; // set user as logged out
    dropdown.classList.add('hidden'); // Hide the dropdown menu

    // When clicking login button, use the auth0 login redirect
    profileButton.addEventListener('click', async () => {
        await auth0Client.loginWithRedirect({
            authorizationParams: {
                redirect_uri: getRedirectURI()
            }
        });
    });
}

// Update the navbar to show users profile and stats 
async function showProfile() {
    const profileButton = document.getElementById('profile-button');
    const dropdown = document.getElementById('dropdown-menu');

    const user = await auth0Client.getUser(); // Get user info
    console.log("User info:", user);

    // Load wins and wrong accusations from local storage (This would be auth0 but using my private creds on github is risky so imagine this is Auth0)
    const wins = localStorage.getItem("wins") || 0;
    const wrongAccusations = localStorage.getItem("wrong_accusations") || 0;

    // Update profile button to show the users nickname and stats (Wins and wrong accusations))
    profileButton.innerText = `${user.nickname || 'Detective'} (Wins: ${wins} | Wrong: ${wrongAccusations}) ▾`;
    profileButton.dataset.loggedIn = "true"; // Mark user as logged in
    dropdown.classList.add('hidden'); // Hide dropdown

    // Update dropdown menu with users info and stats
    document.getElementById('username-display').innerText = user.nickname || 'Detective';
    document.getElementById('win-count').innerText = wins;
    document.getElementById('loss-count').innerText = wrongAccusations;

    // add event listener for logout button
    document.getElementById('logout-button').addEventListener('click', () => {
        auth0Client.logout({
            logoutParams: {
                returnTo: getRedirectURI()
            }
        });
    });
}
.