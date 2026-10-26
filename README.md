# Quizora — IPL Master Quiz

A lightweight, responsive IPL trivia quiz built with vanilla HTML, CSS and JavaScript. No framework, build step, account or backend is required.

## Features

- 10 multiple-choice IPL questions
- Five-minute countdown with automatic submission at timeout
- Question navigator and answered-question progress
- Previous/next navigation and answer selection
- Submit confirmation showing answered and unanswered counts
- Score summary, accuracy percentage and answer-by-answer review
- Responsive layout, keyboard focus styling and reduced-motion support

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select answers and submit the quiz before the timer expires.

There are no package dependencies or install command.

## Project structure

```text
Quizora/
├── index.html
├── style.css
├── script.js
├── tests/
│   └── quiz-data.test.cjs
└── .github/
    └── workflows/
        └── quizora-checks.yml
```

## Validation

GitHub Actions runs on pushes and pull requests targeting `main`. It checks JavaScript syntax and runs the quiz-data integrity tests with Node.js. These automated checks do not replace manual browser testing across devices.

Run the checks locally with Node.js installed:

```bash
node --check script.js
node --test tests/quiz-data.test.cjs
```

## IPL trivia references

Questions about historical records can change as new seasons are played. The all-time wicket-leader and bowling-figures items were checked against the IPL records pages in October 2026:

- [IPL — Most Wickets](https://www.ipl.com/records/bowling-ipl-most-wickets)
- [IPL — Cricket Records](https://www.ipl.com/records/ipl)

The first-title-count question is explicitly framed as a record at the end of the 2023 season. Re-check dynamic records when updating the quiz for a later season.

## Limitations

- Quiz questions and answers are bundled in `script.js`; there is no remote question API.
- Answers are not saved after reloading or closing the page.
- A GitHub Actions pass verifies syntax and data integrity, not full interactive browser behavior or accessibility conformance.
