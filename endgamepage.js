// redirect user to start page if they click the restart button
const playAgainBtn = document.getElementById("restart-button");
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    // reload the current page
    window.location.href = "startGame.html";
  });
}

// play soundtrack on page load
window.addEventListener('load', () => {
    const audio = document.getElementById('end-soundtrack');
    const PlayAudioBtn = document.getElementById('play-audio-button');

    if (audio) {
        audio.play().catch(() => {
            console.warn("Autoplay failed. Showing manual play button.");
            playAudioBtn.style.display = "inline-block";
        });    
    
    // manual play button
    playAudioBtn.addEventListener("click", () => {
        audio.play();
        playAudioBtn.style.display = "none"; // Hide button after playing
    });
}
});

function endGame() {
  const resultElement = document.getElementById("game-result");
  const suspect = localStorage.getItem("cluedoSuspect");
  const weapon = localStorage.getItem("cluedoWeapon");
  const room = localStorage.getItem("cluedoRoom");

  // get game result from local storage
  const result = localStorage.getItem("cluedoGameResult");

  // update header based on win/lose
  if (result === "win") {
    resultElement.textContent = "You won!"
    resultElement.classList.add("win");
  } 
  else if (result === "lose") {
    resultElement.textContent = "You lost!";
    resultElement.classList.add("lose");
  }
  else {
    resultElement.textContent = "Game Result Undecided";
  }
}

// update game highlights section with correct guess
const highlightsList = document.querySelector('.endpage-results-display ul');
highlightsList.innerHTML = `
    <li><strong>Winner: </strong> ${suspect}</li>
    <li><strong>Turns Taken: </strong> [Insert Turns Taken Here]</li>
    <li><strong>Correct Guess: </strong> ${suspect} with the ${weapon} in the ${room}</li>
  `;

endGame();


