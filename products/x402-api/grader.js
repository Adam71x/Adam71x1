function gradeReadme(md) {
  md = String(md || '').replace(/\r\n?/g, '\n');
  if (!md.trim()) return { score: 0, grade: 'Weak', words: 0, headings: 0, codeBlocks: 0, checks: [] };
  var fences = md.match(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm) || [];
  var indentedCode = /(^|\n\n)((?: {4}|\t)[^\n]+\n?)+/.test(md);
  var prose = md.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm, '\n');
  var lines = prose.split('\n');
  var headings = [];
  lines.forEach(function (l, i) {
    var m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(l);
    if (m) headings.push({ level: m[1].length, text: m[2].trim(), line: i });
  });
  // Setext headings (Title\n=====)
  lines.forEach(function (l, i) {
    if (i > 0 && lines[i - 1].trim() && /^=+\s*$/.test(l)) headings.push({ level: 1, text: lines[i - 1].trim(), line: i - 1 });
    else if (i > 0 && lines[i - 1].trim() && /^-{3,}\s*$/.test(l) && !/^\s*[-*|]/.test(lines[i - 1])) headings.push({ level: 2, text: lines[i - 1].trim(), line: i - 1 });
  });
  headings.sort(function (a, b) { return a.line - b.line; });
  var htmlH = prose.match(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi) || [];
  htmlH.forEach(function (h) { var m = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i.exec(h); headings.push({ level: +m[1], text: m[2].replace(/<[^>]+>/g, '').trim(), line: -1 }); });

  var text = prose.replace(/<[^>]+>/g, ' ').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1');
  var words = (text.match(/[A-Za-z0-9][\w'-]*/g) || []).length;
  var hasHeading = function (re) { return headings.some(function (h) { return re.test(h.text); }); };
  var mdLinks = [];
  var linkRe = /(!?)\[([^\]]*)\]\(\s*([^)\s]*)(?:\s+"[^"]*")?\s*\)/g, lm;
  while ((lm = linkRe.exec(prose))) mdLinks.push({ img: !!lm[1], text: lm[2], url: lm[3] });
  var htmlImgs = prose.match(/<img\b[^>]*>/gi) || [];

  var checks = [];
  function add(id, name, max, got, fix) {
    got = Math.max(0, Math.min(max, Math.round(got)));
    checks.push({ id: id, name: name, max: max, points: got, pass: got >= max, fix: got >= max ? '' : fix });
  }

  // 1. Title
  var h1 = headings.filter(function (h) { return h.level === 1; });
  add('title', 'Project title (single H1)', 8,
    h1.length === 1 ? 8 : h1.length > 1 ? 5 : (headings.length ? 3 : 0),
    h1.length > 1 ? 'Use exactly one top-level heading (<code># name</code>); demote the others to <code>##</code>.'
      : 'Start the file with <code># project-name</code> so readers and GitHub know what they are looking at.');

  // 2. Description
  var firstPara = '';
  var startLine = h1.length && h1[0].line >= 0 ? h1[0].line + 1 : 0;
  var buf = [];
  for (var i = startLine; i < lines.length; i++) {
    var l = lines[i].trim();
    if (/^#{1,6}\s/.test(l)) { if (buf.length) break; else if (i > startLine) break; else continue; }
    if (!l || /^(=+|-{3,})$/.test(l)) { if (buf.length) break; continue; }
    if (/^(\[!\[|!\[|<img|<p|<\/?div|<a\b|\[!)/i.test(l) && !buf.length) continue; // skip badge/logo lines
    buf.push(l);
  }
  firstPara = buf.join(' ').replace(/<[^>]+>/g, '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1');
  var descLen = firstPara.replace(/\s+/g, ' ').trim().length;
  var todoDesc = /\b(todo|tbd|coming soon|wip)\b/i.test(firstPara);
  add('description', 'Opening description', 12,
    todoDesc ? 3 : descLen >= 80 ? 12 : descLen >= 40 ? 8 : descLen > 0 ? 4 : 0,
    descLen === 0 ? 'Add a 1&ndash;3 sentence paragraph right under the title: what it does, who it is for, why it is different.'
      : todoDesc ? 'Replace the TODO/placeholder in your opening paragraph with a real one-line pitch.'
      : 'Your opening paragraph is thin (' + descLen + ' chars). Aim for 80+ characters that say what it does and for whom.');

  // 3. Install
  var instHead = hasHeading(/install|setup|set up|getting started|quick ?start|requirements/i);
  var instCmd = /\b(npm (i|install)|yarn add|pnpm add|pip3? install|pipx install|cargo (add|install)|go (get|install)|gem install|brew install|apt(-get)? install|composer require|dotnet add|docker (run|pull)|git clone|conda install|poetry add|uv (add|pip))\b/i.test(md);
  add('install', 'Installation instructions', 12,
    (instHead ? 6 : 0) + (instCmd ? 6 : 0),
    !instHead && !instCmd ? 'Add an <code>## Install</code> section with the exact command (e.g. <code>npm install x</code>, <code>pip install x</code>) and prerequisites/versions.'
      : !instHead ? 'You have an install command but no heading for it. Put it under <code>## Install</code> so people can find it.'
      : 'Your Install section has no copy-pasteable command. Add one in a fenced code block.');

  // 4. Usage with code block
  var usageHead = hasHeading(/usage|example|quick ?start|getting started|how to use|tutorial|demo|api/i);
  var codeBlocks = fences.length + (indentedCode ? 1 : 0);
  var langTagged = fences.filter(function (f) { return /^(```|~~~)\s*[\w+#.-]+/.test(f); }).length;
  add('usage', 'Usage example with code block', 15,
    (usageHead ? 6 : 0) + (codeBlocks >= 1 ? 6 : 0) + (codeBlocks >= 2 || langTagged >= 1 ? 3 : 0),
    codeBlocks === 0 ? 'Add a <code>## Usage</code> section with a fenced code block (<code>```bash</code>) showing the smallest working example and its output.'
      : !usageHead ? 'Put your example under a <code>## Usage</code> or <code>## Example</code> heading.'
      : 'Add a language tag to fenced blocks (<code>```js</code>, <code>```bash</code>) for syntax highlighting, and show more than one example.');

  // 5. Badges
  var badge = /(shields\.io|badge\.fury|badgen\.net|\/badge\.svg|\/badges?\/|travis-ci|codecov\.io|circleci\.com.*svg|actions\/workflows\/[^)]*badge)/i.test(md);
  add('badges', 'Status badges', 5, badge ? 5 : 0,
    'Add 2&ndash;4 badges under the title (build status, version, license) from shields.io. They signal the project is maintained.');

  // 6. License
  var licHead = hasHeading(/licen[cs]e/i);
  var licName = /\b(MIT|Apache[- ]2|GPL|LGPL|AGPL|BSD|MPL|ISC|Unlicense|CC[- ]BY|LICENSE(\.md|\.txt)?)\b/.test(md);
  add('license', 'License', 8, (licHead ? 5 : 0) + (licName ? 3 : 0),
    !licHead ? 'Add a <code>## License</code> section naming the license (e.g. "MIT &mdash; see LICENSE"). Many teams cannot use unlicensed code.'
      : 'Name the actual license (MIT, Apache-2.0, GPL-3.0...) and link the LICENSE file.');

  // 7. Contributing
  var contrib = hasHeading(/contribut|development|hacking|support|issues/i) || /CONTRIBUTING(\.md)?/.test(md);
  add('contributing', 'Contributing / support', 6, contrib ? 6 : 0,
    'Add a short <code>## Contributing</code> section: how to report bugs, run tests locally, and open a PR (or link CONTRIBUTING.md).');

  // 8. Screenshots / demo
  var nonBadgeImgs = mdLinks.filter(function (x) { return x.img && !/shields\.io|badge|badgen|codecov|travis|\.svg\?/i.test(x.url); }).length
    + htmlImgs.filter(function (t) { return !/shields\.io|badge|badgen/i.test(t); }).length;
  var demoLink = /asciinema|\.gif\b|youtube\.com|youtu\.be|vimeo|loom\.com|demo/i.test(md);
  add('visuals', 'Screenshot or demo', 6, nonBadgeImgs > 0 ? 6 : demoLink ? 4 : 0,
    'Add a screenshot, GIF, or terminal recording (asciinema) near the top. A picture of the output answers "what does this do?" in one glance.');

  // 9. Heading structure
  var h2 = headings.filter(function (h) { return h.level === 2; }).length;
  var skips = 0;
  var md_heads = headings.filter(function (h) { return h.line >= 0; });
  for (var k = 1; k < md_heads.length; k++) if (md_heads[k].level > md_heads[k - 1].level + 1) skips++;
  var structPts = (h2 >= 4 ? 7 : h2 >= 2 ? 5 : h2 === 1 ? 2 : 0) + (skips === 0 && h2 > 0 ? 3 : skips === 1 ? 1 : 0);
  add('structure', 'Heading structure', 10, structPts,
    h2 < 2 ? 'Split the content into sections with <code>##</code> headings (Install, Usage, Configuration, Contributing, License).'
      : skips ? 'Heading levels skip (e.g. <code>#</code> straight to <code>###</code>) ' + skips + ' time(s). Keep levels sequential for screen readers and the GitHub outline.'
      : 'Aim for at least 4 <code>##</code> sections so readers can scan.');

  // 10. Length
  var lenPts = words < 50 ? 1 : words < 150 ? 4 : words <= 2500 ? 8 : words <= 5000 ? 6 : 4;
  add('length', 'Length (' + words + ' words)', 8, lenPts,
    words < 150 ? 'At ' + words + ' words it is too short to answer basic questions. Most good READMEs land between 300 and 1,500 words.'
      : 'At ' + words + ' words it is long. Move reference material into a <code>docs/</code> folder and keep the README to the essentials.');

  // 11. Broken-looking links
  var bad = mdLinks.filter(function (x) {
    var u = x.url;
    return !u || u === '#' || /^(todo|tbd|link|url|here|xxx)$/i.test(u) || /localhost|127\.0\.0\.1|example\.com|your[-_]?(user|name|repo|org)|<[^>]*>|\s/i.test(u) || /^htp|^http:\/[^/]|^www\./i.test(u);
  });
  var emptyText = mdLinks.filter(function (x) { return !x.img && !x.text.trim(); }).length;
  var clickHere = mdLinks.filter(function (x) { return !x.img && /^(click here|here|link|this)$/i.test(x.text.trim()); }).length;
  var badCount = bad.length + emptyText;
  add('links', 'Links look valid', 5, badCount === 0 ? (clickHere ? 4 : mdLinks.length || words >= 150 ? 5 : 3) : badCount === 1 ? 2 : 0,
    !badCount && !clickHere ? 'No links found. Link to docs, the issue tracker, or a live demo so readers can go deeper.'
      : badCount ? badCount + ' link(s) look broken or placeholder' + (bad.length ? ' (e.g. <code>' + (bad[0].url || '(empty)').replace(/</g, '&lt;') + '</code>)' : '') + '. Replace with real URLs; avoid localhost, example.com, and <code>#</code>.'
      : 'Replace "click here" / "here" link text with descriptive text (better for accessibility and search).');

  // 12. TOC for long docs
  var isLong = words > 1200 || headings.length > 8;
  var hasToc = hasHeading(/contents|table of contents|toc/i) || (prose.match(/\]\(#[\w-]+\)/g) || []).length >= 3;
  add('toc', isLong ? 'Table of contents (long doc)' : 'Table of contents (not needed yet)', 5,
    hasToc || (!isLong && words >= 150) ? 5 : !isLong ? 3 : 0,
    !isLong ? 'Not needed yet at this length; once the README grows past ~1,200 words, add a <code>## Contents</code> list.' : 'Your README is long (' + words + ' words, ' + headings.length + ' headings). Add a <code>## Contents</code> list of anchor links near the top.');

  var score = checks.reduce(function (s, c) { return s + c.points; }, 0);
  var grade = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs work' : 'Weak';
  return { score: score, grade: grade, words: words, headings: headings.length, codeBlocks: codeBlocks, checks: checks };
}
module.exports = { gradeReadme };
