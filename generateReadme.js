var fs = require('fs');

const first_break_point = '### Documentation of available snippets:'
const second_break_point = '```'

const readme_file = fs.readFileSync('./README.md', 'utf-8')

let parts = readme_file.split(first_break_point)
const header = parts[0] + first_break_point
parts = parts[1].split(second_break_point)
const footer = parts[parts.length - 1]

let files = fs.readdirSync('./snippets').filter((file) => file.substr(-16) === '.sublime-snippet')

let snippets_docs = files.map((filename) => {
  const file = fs.readFileSync(`./snippets/${filename}`, 'utf-8')
  return inspectFile(file)
})
snippets_docs.sort((a, b) => a.abbreviation > b.abbreviation ? 1 : (a.abbreviation === b.abbreviation) ? 0 : -1)

snippets_docs = snippets_docs.map((snippet) => snippet.docBlock).join('')

const readme = header + '\n```\n\n' + snippets_docs + '```' + footer

fs.writeFileSync('README.md', readme)

function inspectFile(contents) {
  var match = contents.match(
    /[\s\S]*<tabTrigger>(.*?)<\/tabTrigger>[\s\S]*?<description>(React: )?(.*?)<\/description>[\s\S]*/i
  );
  var docBlock = '';
  var abbreviation = '';
  var description = '';
  if (match !== null) {
    abbreviation = match[1];
    description = match[3];
    var shortCut = '     '.substring(0, 5 - abbreviation.length) + abbreviation;
    docBlock = '  ' + shortCut + '→  ' + description + '\n\n';
  }
  return {
    docBlock: docBlock,
    abbreviation: abbreviation,
    description: description
  };
}
