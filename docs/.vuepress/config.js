const glob = require('glob');
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
    glob.sync(`docs/*`)
        .map(dir => dir.replace('docs', '').replace('/', ''))
        .forEach(dir => sidebarMap[`/${dir}/`] = loadDirContents(dir));
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
