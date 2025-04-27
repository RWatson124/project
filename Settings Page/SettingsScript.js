const button = document.querySelector('.Menu_Icon');
const dropdownMenu = document.querySelector('#dropdownMenu');


//Dropdown menu customisation so that you can click it to make it appear and dissapear
button.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!button.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

const form = document.querySelector('.Settings_Form');
form.addEventListener('change', () => {
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const rooms = document.getElementById('rooms').value || 9;
    const hints = document.getElementById('hints').value;
    const guesses = document.getElementById('guesses').value;
    const passages = document.querySelector('input[name="passages"]:checked').value;
    //Adding the saved settings to the browser localstorage for ease of use
    localStorage.setItem('Game_Settings', JSON.stringify({ difficulty, rooms, hints, guesses, passages }));
});
//loading the settings on the page refresh/load and storing it into Saved_Settings
window.onload = () => {
    const Saved_Settings = JSON.parse(localStorage.getItem('Game_Settings'));
    // If theres any saved data it will change the value to the saved ones
    if (Saved_Settings) {
        document.querySelector(`input[name="difficulty"][value="${Saved_Settings.difficulty}"]`).checked = true;
        document.getElementById('rooms').value = Saved_Settings.rooms;
        document.getElementById('hints').value = Saved_Settings.hints;
        document.getElementById('guesses').value = Saved_Settings.guesses;
        document.querySelector(`input[name="passages"][value="${Saved_Settings.passages}"]`).checked = true;
    }
};