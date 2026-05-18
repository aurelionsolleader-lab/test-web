const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
fetch("https://robert-leitl.github.io/ferrofluid/dist/index-a2294cbb.js").then(res => res.text()).then(t => require('fs').writeFileSync('out.js', t));
