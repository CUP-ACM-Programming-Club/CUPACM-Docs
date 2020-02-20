#!/bin/bash
node .github/shell/build_version.js
WEBPATH="https://cdn.jsdelivr.net/gh/CUP-ACM-Programming-Club/CUPACM-Docs-CDN@v$(cat VERSION)/"
if [[ "$OSTYPE" == "darwin"* ]]; then
sed -i "" "s|a.p=\"/\"|a.p=\"$WEBPATH\"|g" docs/.vuepress/dist/assets/js/app.*.js
else
sed -i  "s|a.p=\"/\"|a.p=\"$WEBPATH\"|g" docs/.vuepress/dist/assets/js/app.*.js
fi
node .github/shell/build_cdn_environment.js
