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
  
  const envMapUrl = "https://robert-leitl.github.io/ferrofluid/dist/assets/env-map-01.jpg";
  const envMapBuffer = await fetch(envMapUrl).then(r=>r.arrayBuffer());
  
  fs.mkdirSync('./public/assets', { recursive: true });
  fs.writeFileSync('./public/assets/env-map-01.jpg', Buffer.from(envMapBuffer));
  
  // Clean up HTML (remove mic and github link)
  let cleanHtml = t.replace(/<a class="github-link"[^>]*>.*?<\/a>/g, ''); // remove github
  cleanHtml = cleanHtml.replace(/<button id="microphone-button"[\s\S]*?<\/button>/, ''); // remove mic
  cleanHtml = cleanHtml.replace(/<p>See how it responds to your whistle.<\/p>/, '<p>Move your mouse to interact.</p>');
  
  // Fix urls
  cleanHtml = cleanHtml.replace(jsMatch[1], '/main.js');
  cleanHtml = cleanHtml.replace(cssMatch[1], '/style.css');
  cleanHtml = cleanHtml.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script type="module" src="/main.js"></script>');

  fs.writeFileSync('./public/simulation.html', cleanHtml);
  
  // Modify JS:
  // 1. the user requested "điều chỉnh lại màu sắc, thông số hiển thị như này" (adjust colors and display parameters like this)
  // Which points back to the image. 
  // In the shader we saw earlier:
  // vec3 ambient = texture(envMapTex, equiPos).rgb;
  // vec3 a = vec3(0.5, 0.5, 0.5);
  // vec3 b = vec3(0.5, 0.5, 0.5);
  // vec3 c = vec3(1.0, 1.0, 1.0); 
  // vec3 d = vec3(0.00, 0.33, 0.67);
  // To make it black and orange/golden, we can tweak the iridescence, but maybe the UI has parameters?
  // Let's just fix the env map URL.
  let fixedJs = jsSrc.replace(/\/ferrofluid\/dist\/assets\/env-map-01\.jpg/g, '/assets/env-map-01.jpg');
  
  // We can inject color overrides into the shader strings.
  // The shader for spikes uses `fluidShading`
  fs.writeFileSync('./public/main.js', fixedJs);
  fs.writeFileSync('./public/style.css', cssSrc);
  
  console.log("Assets downloaded successfully!");
}

download();
