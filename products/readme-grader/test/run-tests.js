#!/usr/bin/env node
// Extracts gradeReadme() from ../index.html and checks scores are ordered weak < medium < strong.
// Usage: node products/readme-grader/test/run-tests.js
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = /\/\* ==GRADER-START==[^*]*\*\/([\s\S]*?)\/\* ==GRADER-END== \*\//.exec(html);
assert(m, 'could not find GRADER-START/END markers in index.html');
const ctx = {};
vm.runInNewContext(m[1] + '\nthis.gradeReadme = gradeReadme;', ctx);
const grade = ctx.gradeReadme;

const read = (n) => fs.readFileSync(path.join(__dirname, 'samples', n + '.md'), 'utf8');
const results = {};
for (const name of ['weak', 'medium', 'strong']) {
  const r = grade(read(name));
  results[name] = r;
  console.log(`${name.padEnd(7)} ${String(r.score).padStart(3)}/100  ${r.grade.padEnd(10)} (${r.words} words)`);
  for (const c of r.checks) console.log(`   ${c.pass ? 'ok ' : '-- '} ${c.id.padEnd(13)} ${c.points}/${c.max}`);
}

let failed = 0;
function t(desc, fn) { try { fn(); console.log('PASS', desc); } catch (e) { failed++; console.log('FAIL', desc, '-', e.message); } }

t('weights sum to 100', () => assert.strictEqual(results.strong.checks.reduce((s, c) => s + c.max, 0), 100));
t('weak < medium < strong', () => {
  assert(results.weak.score < results.medium.score, `weak ${results.weak.score} !< medium ${results.medium.score}`);
  assert(results.medium.score < results.strong.score, `medium ${results.medium.score} !< strong ${results.strong.score}`);
});
t('weak scores under 40', () => assert(results.weak.score < 40, String(results.weak.score)));
t('medium scores 40-75', () => assert(results.medium.score >= 40 && results.medium.score <= 75, String(results.medium.score)));
t('strong scores 85+', () => assert(results.strong.score >= 85, String(results.strong.score)));
t('weak flags placeholder link', () => assert(!results.weak.checks.find(c => c.id === 'links').pass));
t('medium flags localhost link and skipped heading level', () => {
  assert(!results.medium.checks.find(c => c.id === 'links').pass);
  assert(/skip/.test(results.medium.checks.find(c => c.id === 'structure').fix));
});
t('every failing check has a fix suggestion', () => {
  for (const r of Object.values(results)) for (const c of r.checks) if (!c.pass) assert(c.fix.length > 20, c.id);
});
t('empty/trivial input scores near 0 without throwing', () => {
  assert.strictEqual(grade('').score, 0);
  assert(grade('hello').score <= 15, String(grade('hello').score));
});
t('headings inside code fences are ignored', () => {
  const r = grade('# a\n\n```\n# not a heading\n# nope\n```\n');
  assert.strictEqual(r.headings, 1);
});

console.log(failed ? `\n${failed} test(s) failed` : '\nAll tests passed');
process.exit(failed ? 1 : 0);
