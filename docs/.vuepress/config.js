const glob = require('glob');
const path = require('path');
const fs = require('fs');
module.exports = {
    base: '/',
    title: "CUPACM Documents",
    head: [
        ['link', {rel: 'stylesheet', href: 'https://shadow.elemecdn.com/npm/katex@0.11.0/dist/katex.min.css'}]
    ],
    plugins: ['@vuepress/back-to-top'],
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
            let manifest = {};
            if (fs.existsSync(`${filePath}.js`)) {
                manifest = require(filePath);
            }
            const sidebarList = loadDirContents(dir.substring(1));
            if (manifest.sort) {
                if (typeof manifest.sortFn === "function") {
                    sidebarMap[`${dir}/`] = sidebarList.sort(manifest.sortFn);
                }
                else {
                    sidebarList[`${dir}/`] = sidebarList.sort();
                }
            }
            else {
                sidebarMap[`${dir}/`] = sidebarList;
            }
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
