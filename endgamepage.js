// page reload when restart button is clicked
const playAgainBtn = document.getElementById("restart-button");
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    // reload the current page
    location.reload();
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

  const params = new URLSearchParams(window.location.search);
  const result = params.get("result"); // win or lose

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

endGame();


