$ErrorActionPreference = 'Stop'
$siteOutput = Join-Path $PSScriptRoot 'dist'
New-Item -ItemType Directory -Path $siteOutput -Force | Out-Null
$siteFiles = @('index.html','en.html','zh.html','about.html','about-zh.html','faq.html','faq-zh.html','styles.css','content.js','app.js','robots.txt','sitemap.xml','llms.txt','netlify.toml')
foreach ($siteFile in $siteFiles) { Copy-Item -LiteralPath (Join-Path $PSScriptRoot $siteFile) -Destination $siteOutput -Force }
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'assets') -Destination $siteOutput -Recurse -Force
Compress-Archive -Path (Join-Path $siteOutput '*') -DestinationPath (Join-Path $PSScriptRoot 'coz-cos-netlify.zip') -Force
Write-Output 'Created dist/ and coz-cos-netlify.zip'
