let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
    updateStats();
  });

function loadQuestion() {
  const q = questions[current];

  document.getElementById("questionBox").innerText = q.question;

  const answerBox = document.getElementById("answerBox");
  answerBox.innerHTML = "";

  document.getElementById("feedback").innerHTML = "";

  // Multiple Choice
  if (q.type === "mc") {
    q.options.forEach(opt => {
      const div = document.createElement("div");
      div.classList.add("option");
      div.innerText = opt;

      div.onclick = () => checkMC(opt, q);
      answerBox.appendChild(div);
    });

    document.getElementById("textInput").style.display = "none";
  }

  // Text Input
  if (q.type === "text") {
    document.getElementById("textInput").style.display = "block";

    document.getElementById("textInput").onkeydown = (e) => {
      if (e.key === "Enter") {
        checkText(e.target.value, q);
      }
    };
  }
}

function checkMC(answer, q) {
  const options = document.querySelectorAll(".option");

  options.forEach(o => {
    if (o.innerText === q.correct) {
      o.classList.add("correct");
    } else {
      o.classList.add("wrong");
    }
  });

  if (answer === q.correct) {
    correct++;
    showFeedback(true, q.explanation);
  } else {
    wrong++;
    showFeedback(false, q.explanation);
  }
}

function checkText(input, q) {
  const answers = q.correctAnswers;

  let isCorrect = answers.includes(input.trim());

  if (isCorrect) {
    correct++;
    showFeedback(true, q.explanation);
  } else {
    wrong++;
    showFeedback(false, q.explanation);
  }
}

function showFeedback(ok, explanation) {
  const fb = document.getElementById("feedback");

  fb.innerHTML = ok
    ? "✔ Richtig! " + explanation
    : "❌ Falsch! " + explanation;
}

document.getElementById("continueBtn").onclick = () => {
  current++;
  if (current >= questions.length) {
    alert("Quiz fertig!");
    return;
  }
  loadQuestion();
  updateStats();
};

function updateStats() {
  document.getElementById("progressText").innerText =
    `Frage ${current + 1} / ${questions.length}`;

  document.getElementById("scoreText").innerText =
    `✔ ${correct} | ❌ ${wrong}`;

  let percent = (current / questions.length) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
}