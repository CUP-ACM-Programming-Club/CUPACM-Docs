#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

git clone https://github.com/CUP-ACM-Programming-Club/CUPACM-Docs.git -b gh-pages pages
rm -rf pages/*.html
rm -rf pages/assets
rm -rf pages/dist
cp -r docs/.vuepress/dist/* pages
cd pages
git add -A
git commit -m "deploy `TZ=UTC-8 date +'%Y-%m-%d %H:%M:%S'`"
git config user.email 'gxlhybh@gmail.com'
git config user.name 'Ryan Lee'
git push -f git@github.com:CUP-ACM-Programming-Club/CUPACM-Docs.git gh-pages

cd -
