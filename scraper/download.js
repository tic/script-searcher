import fetch from "node-fetch";
import * as fs from 'fs';
import JSSoup from 'jssoup';

const show = 'Seinfeld';
const baseUrl = 'https://imsdb.com';

console.info('Discovering episodes...');
const startPage = await fetch(`${baseUrl}/TV/${show}.html`).then((r) => r.text());

const soup = new JSSoup.default(startPage);
const cells = soup.findAll('p');

fs.mkdirSync(`./scripts/${show}`, { recursive: true });

let i = 0;
for(const p of cells) {
  const episodeLink = p.find('a')
  const episodeName = episodeLink.text;
  const episodePageUrl = episodeLink
    .attrs
    .href
    .split('/')[2]
    .replaceAll(/ \- /g, '-')
    .replaceAll(/ /g, '-')
    .replace('-Script', '');

  console.info(episodeName);
  const scriptPage = await fetch(`${baseUrl}/transcripts/${episodePageUrl}`).then((r) => r.text());
  const scriptSoup = new JSSoup.default(scriptPage);
  const scriptElement = scriptSoup.find('pre');
  const scriptText = scriptElement.text.replaceAll(/\n\s+/g, '\n').trim();
  
    const outputJson = {
      show,
      title: episodeName,
      script: scriptText,
    };

  fs.writeFileSync(`./scripts/${show}/${i++}.json`, JSON.stringify(outputJson).replaceAll(/\\r/g, ''));
}

console.info('\nDone!');
