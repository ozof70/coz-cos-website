import {readFile,readdir,writeFile} from 'node:fs/promises';

// Keep physical .html files, but publish a single extensionless URL per page.
export function cleanPagePath(path) {
  if (['/index.html','/zh.html','/zh','/index'].includes(path)) return '/';
  return path.replace(/\.html$/, '');
}

export function cleanPageURLs(text) {
  const local = text.replace(/https:\/\/(?:www\.)?cozcos\.com\/([a-z0-9-]+)\.html\b/gi,
    (_, name) => 'https://cozcos.com' + cleanPagePath('/' + name + '.html'));
  // A root-relative URL, not a path inside an external website or asset name.
  return local.replace(/(?<![A-Za-z0-9:/])\/([a-z0-9-]+)\.html\b/gi,
    (_, name) => cleanPagePath('/' + name + '.html'));
}

export async function writePageFile(file, data, ...options) {
  const isPage = /\.html$/.test(file) || ['sitemap.xml','llms.txt','robots.txt'].includes(file);
  return writeFile(file, isPage && typeof data === 'string' ? cleanPageURLs(data) : data, ...options);
}

export async function refreshSiteRoutes() {
  const files=(await readdir('.')).filter(file=>file.endsWith('.html')).sort();
  for(const file of files) {
    const old=await readFile(file,'utf8');
    const updated=cleanPageURLs(old);
    if(updated!==old)await writeFile(file,updated);
  }
  const rules=[];
  for(const file of files.filter(file=>!['index.html','zh.html'].includes(file))) {
    const page=cleanPagePath('/'+file);
    // Netlify normalizes .html and trailing slashes before matching redirect rules.
    // A 301 between these equivalent paths would redirect the clean URL to itself.
    // Serve the clean URL, and retain legacy files with canonical metadata instead.
    rules.push(`[[redirects]]\n  from = "${page}"\n  to = "/${file}"\n  status = 200\n  force = true\n`);
  }
  const begin='# BEGIN extensionless page routes';
  const end='# END extensionless page routes';
  let config=await readFile('netlify.toml','utf8');
  const block=`${begin}\n# Explicit routes keep one canonical URL and leave API/asset paths untouched.\n[build.processing.html]\n  pretty_urls = false\n\n[[redirects]]\n  from = "/index"\n  to = "/"\n  status = 301\n  force = true\n\n${rules.join('\n')}\n${end}\n\n`;
  if(config.includes(begin))config=config.slice(0,config.indexOf(begin))+block+config.slice(config.indexOf(end)+end.length).replace(/^\s*/,'');
  else config=config.replace('[[headers]]',block+'[[headers]]');
  await writeFile('netlify.toml',config);
}
