document.addEventListener("DOMContentLoaded", async () => {
    
    let exercises = [];

    try {
        const response = await fetch('http://localhost:3000/exercises',{
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });    
        exercises = await response.json();
    }
    catch(error) {
        console.error(error);
    }
    
    
    console.log(exercises);

    const exerciseList = document.getElementById("exercise-list");
    const exerciseTitle = document.getElementById("exercise-title");
    const exerciseDescription = document.getElementById("exercise-description");
    const startButton = document.getElementById("start-exercise");

    exercises.forEach(exercise => {
        const listItem = document.createElement("li");
        listItem.textContent = exercise.title;
        listItem.addEventListener("click", () => {
            exerciseTitle.textContent = exercise.title;
            exerciseDescription.textContent = exercise.description;
            startButton.disabled = false;
            startButton.onclick = () => {window.location.href = `solution.html?id=${exercise.id}`}
        });
        exerciseList.appendChild(listItem);
    });
});