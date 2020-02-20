const glob = require('glob');
const path = require('path');
const fs = require('fs');
const version = fs.readFileSync(path.resolve(process.cwd(), "VERSION"));

console.log(`Version: ${version}`);

const webPath = `https://cdn.jsdelivr.net/gh/CUP-ACM-Programming-Club/CUPACM-Docs-CDN@v${version}/`;
module.exports = {
    base: "/",
    title: "CUPACM Documents",
    head: [
        ['link', {rel: 'stylesheet', href: 'https://shadow.elemecdn.com/npm/katex@0.11.0/dist/katex.min.css'}]
    ],
    plugins: [
        ['@vuepress/back-to-top'],
        ['mermaidjs'],
        ['@dovyp/vuepress-plugin-clipboard-copy', true]
        ],
    markdown: {
        lineNumbers: true,
        plugins: ['@ryanlee2014/katex']
    },
    themeConfig: {
        repo: 'CUP-ACM-Programming-Club/CUPACM-Docs',
        editLinks: true,
        docsDir: 'docs',
        docsBranch: 'master',
        editLinkText: '在Github上编辑此页面',
        sidebar: loadSidebarContents(),
        lastUpdated: '上次更新',
        nav: [
            {
                text: '首页', link: '/'
            },
            {
                text: '模板库', link: '/code_template/'
            },
            {
                text: '题解', link: '/solution/'
            },
            {
                text: '构建本文档', link: '/contribute/'
            },
            {
                text: 'CUPOJ开发文档', link: '/oj_document/'
            },
            {
                text: 'Jetbrains教育版申请', link: '/tools/'
            }
        ]
    }
};

function loadSidebarContents() {
    const sidebarMap = {};
    const set = new Set();
    glob.sync(`docs/**`)
        .map(dir => dir.replace('docs', ''))
        .filter(dir => path.dirname(dir) !== '.')
        .forEach(dir => set.add(path.dirname(dir)));
    Array.from(set)
        .sort((a, b) => a === b ? 0 : a > b ? -1 : 1)
        .forEach(dir => {
            const filePath = path.resolve(__dirname, `../${dir}/manifest`);
            const manifest = fs.existsSync(`${filePath}.js`) ? require(filePath) : {};
            const sidebarList = loadDirContents(dir.substring(1));
            const sortFn = manifest.sort ? sidebarList.sort: el => el;
            sidebarMap[`${dir}/`] = sortWrapper(sidebarList, sortFn, manifest.sortFn);
        });
    return sidebarMap
}

function loadDirContents(dir) {
    return ['', ...glob.sync(`docs/${dir}/*.md`)
        .map(f => f.replace('docs/', '')
            .replace(dir + '/', '')
            .replace('\.md', ''))
        .filter(e => e !== 'index')
    ];
}

function sortWrapper(iterableObject, sortFn, compareFn) {
    sortFn.call(iterableObject, compareFn);
    return iterableObject;
}
