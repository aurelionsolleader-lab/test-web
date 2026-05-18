const fetch = require('node-fetch');
fetch('https://robert-leitl.github.io/ferrofluid/dist/')
  .then(res => res.text())
  .then(text => console.log(text));
