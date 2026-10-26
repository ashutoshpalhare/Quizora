const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('script.js', 'utf8');
const declaration = source.match(/const quizData = \[[\s\S]*?\n\];/);

assert.ok(declaration, 'script.js should declare quizData');
const quizData = vm.runInNewContext(`${declaration[0]}\nquizData;`, {});

test('quiz contains exactly ten questions', () => {
  assert.equal(quizData.length, 10);
});

test('every question has four unique options and a valid answer index', () => {
  for (const [index, question] of quizData.entries()) {
    assert.ok(question.question.trim().length > 0, `question ${index + 1} has text`);
    assert.equal(question.options.length, 4, `question ${index + 1} has four options`);
    assert.ok(question.options.every(option => typeof option === 'string' && option.trim()), `question ${index + 1} options are non-empty strings`);
    assert.equal(new Set(question.options).size, 4, `question ${index + 1} options are unique`);
    assert.ok(Number.isInteger(question.answer), `question ${index + 1} answer is an integer`);
    assert.ok(question.answer >= 0 && question.answer < question.options.length, `question ${index + 1} answer index is in range`);
  }
});

test('key IPL record answers remain mapped to their intended options', () => {
  assert.equal(quizData[0].answer, 1); // Chennai Super Kings, historical 2023 title count
  assert.equal(quizData[1].answer, 2); // Chris Gayle, highest individual score
  assert.equal(quizData[2].answer, 1); // First IPL season: 2008
  assert.equal(quizData[3].answer, 2); // Yuzvendra Chahal, all-time wickets leader (2026)
  assert.equal(quizData[6].answer, 1); // Alzarri Joseph, 6/12
  assert.equal(quizData[7].answer, 2); // Rajasthan Royals, first champions
});
