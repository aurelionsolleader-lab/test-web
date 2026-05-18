import fs from 'fs';

let js = fs.readFileSync('./public/main.js', 'utf8');

// Replace the palette to match the golden/brown reflections
// Original: 
// vec3 c = vec3(1.0, 1.0, 1.0); 
// vec3 d = vec3(0.00, 0.33, 0.67);
// We want golden/copper/brown colors instead of blue/purple.
js = js.replace('vec3 c = vec3(1.0, 1.0, 1.0);', 'vec3 c = vec3(1.5, 1.0, 0.5);');
js = js.replace('vec3 d = vec3(0.00, 0.33, 0.67);', 'vec3 d = vec3(0.1, 0.3, 0.1);');

// Increase ambient intensity from 0.2 to 0.4
js = js.replace('vec3 color = ambient * 0.2', 'vec3 color = ambient * 0.5');

// Make the background pure white instead of gray.
// Original: 
// t.clearColor(e,e,e,1) where e=0.05
// outColor = vec4(mix(vec3(0.05), color, edgeMask), 1.);
js = js.replace('outColor = vec4(mix(vec3(0.05), color, edgeMask), 1.);', 'outColor = vec4(mix(vec3(1.0), color, edgeMask), 1.);');
// Actually, let's just make the ground shader output white.
js = js.replace('outColor = vec4(mix(vec3(0.05)', 'outColor = vec4(mix(vec3(1.0)');

// Also the clearColor is set somewhere.
js = js.replace(/t\.clearColor\([^)]+\)/g, 't.clearColor(1.0, 1.0, 1.0, 1.0)');

// We also want to hide the UI panel (Tweakpane) to remove any debug GUI
js = js.replace('this.isDev', 'false'); // Disable dev pane if that's what shows it

fs.writeFileSync('./public/main.js', js);
console.log("Colors updated!");
