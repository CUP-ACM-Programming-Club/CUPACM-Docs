#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
# cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git clone https://github.com/CUP-ACM-Programming-Club/CUPACM-Docs.git -b gh-pages gh-pages

cp -r docs/.vuepress/dist gh-pages

cd gh-pages

git add -A
git config --global user.name 'Ryan Lee'
git config --global user.email 'gxlhybh@gmail.com'
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://${push_docs}@github.com/CUP-ACM-Programming-Club/CUPACM-Docs.git gh-pages

cd -
