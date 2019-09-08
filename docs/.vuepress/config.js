const glob = require('glob');

module.exports = {
    base: '/',
    title: "CUPACM Documents",
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        sidebar: {
            '/code_template/': loadLocaleMessages('code_template'),
            '/solution/': loadLocaleMessages('solution'),
            '/contribute/': loadLocaleMessages('contribute')
        },
        nav: [
            {
                text: '首页', link: '/'
            },
            {
                text: '模板库', link: '/code_template/index'
            },
            {
                text: '题解', link: '/solution/index'
            },
            {
                text: '构建本文档', link: '/contribute/index'
            },
            {
                text: 'Github地址', link: 'https://github.com/CUP-ACM-Programming-Club/CUPACM-Docs'
            }
        ]
    }
};

function loadLocaleMessages(dir) {
    return ['', ...glob.sync(`docs/${dir}/*.md`)
        .map(f => f.replace('docs/', '')
            .replace(dir + '/', '')
            .replace('\.md', ''))
        .filter(e => e !== 'index')
            ];
}
