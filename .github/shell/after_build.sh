#!/bin/bash
WEBPATH="https://cdn.jsdelivr.net/gh/CUP-ACM-Programming-Club/CUPACM-Docs-CDN@v$(cat VERSION)/"
if [[ "$OSTYPE" == "darwin"* ]]; then
sed -i "" "s|a.p=\"/\"|a.p=\"$WEBPATH\"|g" docs/.vuepress/dist/assets/js/app.*.js
sed -i "" "s|/assets/img/|$WEBPATH/assets/img/|g" docs/.vuepress/dist/assets/css/*.css
else
sed -i  "s|a.p=\"/\"|a.p=\"$WEBPATH\"|g" docs/.vuepress/dist/assets/js/app.*.js
sed -i  "s|/assets/img/|$WEBPATH/assets/img/|g" docs/.vuepress/dist/assets/css/*.css
fi
node .github/shell/build_cdn_environment.js
