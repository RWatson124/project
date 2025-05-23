// redirect user to start page if they click the restart button
const playAgainBtn = document.getElementById("restart-button");
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    // reload the current page
    window.location.href = "homepage.html";
  });
}

// play soundtrack on page load
window.addEventListener('load', () => {
    const audio = document.getElementById('end-soundtrack');
    const PlayAudioBtn = document.getElementById('endpage-play-audio-button');

    if (audio) {
        audio.play().catch(() => {
            console.warn("Autoplay failed. Showing manual play button.");
            playAudioBtn.style.display = "inline-block";
        });    
    
    // manual play button
    const playAudioBtn = document.getElementById('endpage-play-audio-button');
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', toggleAudio);
    }
}
});

document.addEventListener("DOMContentLoaded", function() {
  endGame();
});

function endGame() {
  const resultElement = document.getElementById("game-result");
  const suspect = localStorage.getItem("cluedoSuspect");
  const weapon = localStorage.getItem("cluedoWeapon");
  const room = localStorage.getItem("cluedoRoom");

  console.log("Retreived from localStorage:", {suspect, weapon, room, resultElement}); 

  // get game result from local storage
  const result = localStorage.getItem("gameResult");

  // update header based on win/lose
  if (result === "win") {
    resultElement.textContent = "You won!";
    resultElement.classList.add("endpage-win");
  } 
  else if (result === "lose") {
    resultElement.textContent = "You lost!";
    resultElement.classList.add("endpage-lose");
  }
  else {
    resultElement.textContent = "Game Result Undecided";
  }


// update game highlights section with correct guess
  const highlightsList = document.querySelector('#endpage-highlights ul');
  if (highlightsList) {
  highlightsList.innerHTML = `   
      <li><strong>Secret Solution: </strong> ${suspect} with the ${weapon} in the ${room}</li>
    `;
 } else {
    console.error("Highlights list not found!");
}
}


document.addEventListener("DOMContentLoaded", endGame);


