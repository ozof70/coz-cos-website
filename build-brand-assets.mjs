import {readFile,writeFile} from 'node:fs/promises';

// Preserve the supplied brand mark; hide only its small COSPLAY REUSE caption.
const bitmap = (await readFile('assets/closet.png')).toString('base64');
const mask = '<defs><mask id="brand" maskUnits="userSpaceOnUse" x="0" y="0" width="1185" height="1327"><rect width="1185" height="1327" fill="white"/><rect x="100" y="1100" width="650" height="90" fill="black"/></mask></defs>';
const image = '<image width="1185" height="1327" href="data:image/png;base64,' + bitmap + '" mask="url(#brand)"/>';
await writeFile('assets/coz-logo.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1185 1327">' + mask + image + '</svg>');
await writeFile('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1440">' + mask + '<g transform="translate(127 57)">' + image + '</g></svg>');

// favicon-96.png and apple-touch-icon.png are rendered square versions of favicon.svg.
