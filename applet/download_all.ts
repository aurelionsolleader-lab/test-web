import fs from 'fs';
import path from 'path';

async function download() {
  const t = await fetch("https://robert-leitl.github.io/ferrofluid/dist/").then(r=>r.text());
  
  // Extract css and js urls
  const jsMatch = t.match(/src="(\/ferrofluid\/dist\/[^"]+\.js)"/);
  const cssMatch = t.match(/href="(\/ferrofluid\/dist\/[^"]+\.css)"/);
  
  const jsUrl = "https://robert-leitl.github.io" + jsMatch[1];
  const cssUrl = "https://robert-leitl.github.io" + cssMatch[1];
  
  const jsSrc = await fetch(jsUrl).then(r=>r.text());
  const cssSrc = await fetch(cssUrl).then(r=>r.text());
  
  // also get env map that we saw in the code: "/ferrofluid/dist/assets/env-map-01.jpg"
  const envMapUrl = "https://robert-leitl.github.io/ferrofluid/dist/assets/env-map-01.jpg";
  const envMapBuffer = await fetch(envMapUrl).then(r=>r.arrayBuffer());
  
  fs.mkdirSync('./public/assets', { recursive: true });
  fs.writeFileSync('./public/assets/env-map-01.jpg', Buffer.from(envMapBuffer));
  
  // Clean up HTML (remove mic and github link)
  let cleanHtml = t.replace(/<a class="github-link"[^>]*>.*?<\/a>/g, ''); // remove github
  cleanHtml = cleanHtml.replace(/<button id="microphone-button".*?<\/button>/s, ''); // remove mic
  cleanHtml = cleanHtml.replace(/<p>See how it responds to your whistle.<\/p>/, '<p>Move your mouse to interact.</p>');
  
  // Fix urls to local
  cleanHtml = cleanHtml.replace(jsMatch[1], '/main.js');
  cleanHtml = cleanHtml.replace(cssMatch[1], '/style.css');
  
  fs.writeFileSync('./public/index.html', cleanHtml);
  
  // Write js and css files 
  // Need to fix the env map url inside JS
  const fixedJs = jsSrc.replace(/\/ferrofluid\/dist\/assets\/env-map-01\.jpg/g, '/assets/env-map-01.jpg');
  fs.writeFileSync('./public/main.js', fixedJs);
  fs.writeFileSync('./public/style.css', cssSrc);
  
  console.log("Assets downloaded successfully!");
}

download();
