fetch("https://robert-leitl.github.io/ferrofluid/dist/index-a2294cbb.js").then(res => res.text()).then(t => {
  // Try to find shader chunks
  let count = 0;
  const regex = /(?:`([^`]*void\s+main\([^`]*)[`]|\"([^\"]*void\s+main\([^\"]*)[\"])/g;
  let match;
  while ((match = regex.exec(t)) !== null) {
      console.log(`\n\n--- SHADER MATCH ${count} ---\n`);
      console.log(match[1] || match[2]);
      count++;
  }
  
  const regex2 = /\bgl_[a-zA-Z_0-9]+/g;
  console.log("gl_ vars found:", [...new Set(t.match(regex2))]);
  
  // also specifically look for functions that return shapes for raymarching/displacement
  // find anything containing "position" and "normal" or "cellular"
  // just search for interesting strings
  const strStart = t.indexOf("cellular(");
  if (strStart !== -1) {
    console.log("Found cellular function around char:", strStart);
    console.log(t.substring(strStart - 200, strStart + 1000));
  }
  
});
