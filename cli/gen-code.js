#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function basePathResolver(rootPath) {
    return function () {
        return path.resolve(rootPath, ...arguments);
    }
}

function successExit() {
    process.exit(0);
}

function errorExit() {
    process.exit(0);
}

function checkExisted(file) {
    return fs.existsSync(file);
}

const rootPath = path.resolve(__dirname, '../');

const rootPathResolver = basePathResolver(rootPath);

rl.question('请输入Markdown文件名(无需添加后缀名)\n', answer => {
    if (answer.length === 0) {
        console.log('非法输入');
        errorExit();
    }
    const srcFile = rootPathResolver('template', 'code_template', 'template.md');
    const destFile = rootPathResolver('docs', 'code_template', `${answer}.md`);
    if (checkExisted(destFile)) {
        console.log('文件已存在，请使用其他文件名。');
        console.log('程序结束');
        errorExit();
    }
    try {
        fs.copyFileSync(srcFile, destFile);
    } catch (e) {
        console.error('复制模板失败');
        console.error(e);
        errorExit();
    }
    if (checkExisted(destFile)) {
        console.log(`模板添加成功，请前往${destFile}编辑内容`);
    } else {
        console.log(`模板添加失败`);
        errorExit();
    }
    console.log('添加文件到Git记录');
    const stdout = execSync(`cd ${rootPath} && git add -A`);
    console.log('成功');
    rl.close();
   successExit();
});
