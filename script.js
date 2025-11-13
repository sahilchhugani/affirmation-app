const button = document.getElementById("new-affirmation");
const text = document.getElementById("affirmation");

async function fetchAffirmation() {
  text.textContent = 'Thinking of something nice…';
  try {
    const response = await fetch('/generate-affirmation');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    text.textContent = data.affirmation || 'Something nice happened, but it is beyond words!';
  } catch (error) {
    text.textContent = 'Sorry, could not fetch a new affirmation right now.';
  }
}

button.addEventListener("click", fetchAffirmation);
