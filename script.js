const quizData = [
    { question: "Which team has won the most IPL titles as of 2023 along with Mumbai Indians?", options: ["Kolkata Knight Riders", "Chennai Super Kings", "Royal Challengers Bangalore", "Gujarat Titans"], answer: 1 },
    { question: "Who holds the record for the highest individual score (175*) in an IPL match?", options: ["Virat Kohli", "AB de Villiers", "Chris Gayle", "Brendon McCullum"], answer: 2 },
    { question: "In which year was the first ever IPL tournament held?", options: ["2007", "2008", "2009", "2010"], answer: 1 },
    { question: "Which player has taken the most wickets in IPL history?", options: ["Lasith Malinga", "Amit Mishra", "Yuzvendra Chahal", "Dwayne Bravo"], answer: 2 },
    { question: "Which team is famously known as the 'Men in Pink'?", options: ["Punjab Kings", "Sunrisers Hyderabad", "Pune Warriors India", "Rajasthan Royals"], answer: 3 },
    { question: "Who has smashed the most number of sixes in the history of the IPL?", options: ["Chris Gayle", "Rohit Sharma", "MS Dhoni", "Kieron Pollard"], answer: 0 },
    { question: "Which bowler holds the record for the best bowling figures (6/12) in an IPL match?", options: ["Sohail Tanvir", "Alzarri Joseph", "Adam Zampa", "Anil Kumble"], answer: 1 },
    { question: "Who won the first ever IPL title?", options: ["Chennai Super Kings", "Mumbai Indians", "Rajasthan Royals", "Deccan Chargers"], answer: 2 },
    { question: "Which stadium serves as the home ground for the Royal Challengers Bangalore?", options: ["M. Chinnaswamy Stadium", "Wankhede Stadium", "Eden Gardens", "M. A. Chidambaram Stadium"], answer: 0 },
    { question: "Who has won the most 'Orange Caps' (most runs in a season) in IPL history?", options: ["Virat Kohli", "David Warner", "Chris Gayle", "KL Rahul"], answer: 1 }
];

let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(null);
let timeLeft = 300;
let timerInterval;
let isSubmitted = false;

const navGrid = document.getElementById('nav-grid');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const qNumDisplay = document.getElementById('q-num-display');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timeDisplay = document.getElementById('time-display');
const optionLetters = ['A', 'B', 'C', 'D'];

function init() {
    createNavButtons();
    loadQuestion(0);
    timeDisplay.textContent = formatTime(timeLeft);
    startTimer();
}

function createNavButtons() {
    navGrid.innerHTML = '';

    for (let i = 0; i < quizData.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.textContent = i + 1;
        btn.id = `nav-btn-${i}`;
        btn.type = 'button';
        btn.setAttribute('aria-label', `Go to question ${i + 1}`);
        btn.onclick = () => loadQuestion(i);
        navGrid.appendChild(btn);
    }

    updateNavDisplay();
}

function updateNavDisplay() {
    for (let i = 0; i < quizData.length; i++) {
        const btn = document.getElementById(`nav-btn-${i}`);
        if (!btn) continue;

        btn.className = 'nav-btn';
        if (userAnswers[i] !== null) btn.classList.add('answered');
        if (i === currentQuestion) btn.classList.add('active');
    }
}

function loadQuestion(index) {
    if (index < 0 || index >= quizData.length || isSubmitted) return;

    const quizArea = document.getElementById('quiz-area');
    quizArea.style.animation = 'none';
    void quizArea.offsetHeight;
    quizArea.style.animation = 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';

    currentQuestion = index;
    qNumDisplay.textContent = currentQuestion + 1;

    const qData = quizData[currentQuestion];
    questionText.textContent = qData.question;
    optionsGrid.innerHTML = '';

    qData.options.forEach((option, index) => {
        const optionCard = document.createElement('button');
        optionCard.type = 'button';
        optionCard.className = `option-card ${userAnswers[currentQuestion] === index ? 'selected' : ''}`;
        optionCard.setAttribute('aria-pressed', String(userAnswers[currentQuestion] === index));
        optionCard.innerHTML = `<div class="option-letter">${optionLetters[index]}</div><div class="option-text"></div>`;
        optionCard.querySelector('.option-text').textContent = option;
        optionCard.onclick = () => selectOption(index);
        optionsGrid.appendChild(optionCard);
    });

    prevBtn.disabled = currentQuestion === 0;
    if (currentQuestion === quizData.length - 1) {
        nextBtn.innerHTML = 'Submit <i class="fa-solid fa-check"></i>';
        nextBtn.classList.add('submit-mode');
    } else {
        nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
        nextBtn.classList.remove('submit-mode');
    }

    updateNavDisplay();
}

function selectOption(optionIndex) {
    if (isSubmitted) return;

    userAnswers[currentQuestion] = optionIndex;
    loadQuestion(currentQuestion);

    if (currentQuestion < quizData.length - 1) {
        window.setTimeout(() => nextQuestion(), 400);
    }
}

function nextQuestion() {
    if (isSubmitted) return;
    if (currentQuestion < quizData.length - 1) {
        loadQuestion(currentQuestion + 1);
    } else {
        submitQuiz();
    }
}

function prevQuestion() {
    if (currentQuestion > 0 && !isSubmitted) {
        loadQuestion(currentQuestion - 1);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    timerInterval = window.setInterval(() => {
        if (isSubmitted) {
            window.clearInterval(timerInterval);
            return;
        }

        timeLeft = Math.max(0, timeLeft - 1);
        timeDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 60) {
            const timerBox = document.getElementById('timer-box');
            timerBox.style.color = '#ff4b2b';
            timerBox.style.borderColor = 'rgba(255, 75, 43, 0.5)';
        }

        if (timeLeft <= 0) {
            window.clearInterval(timerInterval);
            submitQuiz(true);
        }
    }, 1000);
}

function submitQuiz(isTimeout = false) {
    if (isSubmitted) return;
    isSubmitted = true;
    window.clearInterval(timerInterval);

    let score = 0;
    const detailsContainer = document.getElementById('result-details');
    detailsContainer.innerHTML = '';

    for (let i = 0; i < quizData.length; i++) {
        const qData = quizData[i];
        const userAnswer = userAnswers[i];
        const isCorrect = userAnswer === qData.answer;
        if (isCorrect) score++;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'review-item';

        const statusColorClass = isCorrect ? 'ans-correct' : (userAnswer === null ? 'ans-missing' : 'ans-wrong');
        const statusIcon = isCorrect ? 'fa-check-circle' : (userAnswer === null ? 'fa-minus-circle' : 'fa-times-circle');
        const statusText = isCorrect ? 'Correct' : (userAnswer === null ? 'Not Answered' : 'Incorrect');
        const userAnswerText = userAnswer !== null ? qData.options[userAnswer] : 'None';

        const reviewAnswer = document.createElement('div');
        reviewAnswer.className = `review-ans ${statusColorClass}`;
        const statusIconElement = document.createElement('i');
        statusIconElement.className = `fa-solid ${statusIcon}`;
        reviewAnswer.append(statusIconElement, document.createTextNode(` ${statusText} · Your Answer: ${userAnswerText}`));

        const questionTitle = document.createElement('div');
        questionTitle.className = 'review-q';
        questionTitle.textContent = `Q${i + 1}. ${qData.question}`;
        itemDiv.appendChild(questionTitle);
        itemDiv.appendChild(reviewAnswer);

        if (!isCorrect) {
            const correctAnswer = document.createElement('div');
            correctAnswer.className = 'review-correct-text';
            const arrowIcon = document.createElement('i');
            arrowIcon.className = 'fa-solid fa-arrow-right';
            correctAnswer.append(arrowIcon, document.createTextNode(` Correct Answer: ${qData.options[qData.answer]}`));
            itemDiv.appendChild(correctAnswer);
        }

        detailsContainer.appendChild(itemDiv);
    }

    document.getElementById('final-score').textContent = score;

    let message = score === quizData.length
        ? "Perfect Score! You're an IPL Expert! 🏆"
        : score >= 7
            ? 'Great Job! Solid knowledge! 🏏'
            : score >= 4
                ? 'Good effort, keep watching! 📺'
                : 'Looks like you need to watch more IPL! 😉';

    if (isTimeout) message = "Time's Up! " + message;
    document.getElementById('result-msg').textContent = message;

    const overlay = document.getElementById('result-overlay');
    overlay.classList.add('show');

    window.setTimeout(() => {
        document.getElementById('score-circle').style.background =
            `conic-gradient(var(--primary-light) ${(score / quizData.length) * 100}%, rgba(255,255,255,0.05) 0)`;
    }, 100);
}

init();
