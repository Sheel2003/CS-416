const MAX_NUMBER = 10;
let score = 0;
let totalQuestions = 0;
let feedbackMessage = '';

function initializeGame() {
  score = 0;
  totalQuestions = 0;
  feedbackMessage = '';
  updateScore();
  displayNewQuestion();
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const num1 = getRandomNumber(1, MAX_NUMBER);
  const num2 = getRandomNumber(1, MAX_NUMBER);
  const correctAnswer = num1 * num2;

  return {
    question: `${num1} * ${num2}`,
    correctAnswer: correctAnswer,
  };
}
function generateDistractors(correctAnswer) {
  const distractors = [];
  distractors.push(correctAnswer);
  while (distractors.length < 5) {
    const num = Math.floor(Math.random() * 100) + 1;
    if (num !== correctAnswer && !distractors.includes(num)) {
      distractors.push(num);
    }
  }
  distractors.sort((a, b) => a - b);
  return distractors;
}
function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}/${totalQuestions}`;
}

function updateFeedback(feedbackText, isCorrect) {
  const feedbackElement = document.querySelector('#feedback');
  feedbackElement.textContent = feedbackText;
  feedbackElement.className = isCorrect ? 'correct' : 'incorrect';
}
function displayNewQuestion() {
  const questionData = generateQuestion();
  const distractors = generateDistractors(questionData.correctAnswer);
  const answerChoices = generateDistractors(questionData.correctAnswer, distractors);

  const answerChoicesElement = document.getElementById('answer-choices');
  answerChoicesElement.innerHTML = '';

  document.getElementById('expression').textContent = questionData.question;

  answerChoices.forEach(function (choice) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'answer-button', 'container-sm', 'col-sm-1');
    button.textContent = choice;
    button.addEventListener('click', function () {
      handleAnswer(parseInt(button.textContent, 10), questionData.correctAnswer);
    });
    answerChoicesElement.appendChild(button);
  });
  updateFeedback('', false);
}

function handleAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    feedbackMessage = 'Correct!';
    score++;
  } else {
    const equation = document.getElementById('expression').textContent;
    feedbackMessage = `Wrong. ${equation} is ${correctAnswer}.`;
  }
  totalQuestions++;
  updateScore();
  displayNewQuestion();
  updateFeedback(feedbackMessage, selectedAnswer === correctAnswer);
}

initializeGame();

document.getElementById('reset-button').addEventListener('click', function () {
  initializeGame();
});
