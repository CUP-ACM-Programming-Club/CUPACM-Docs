---
title: 更新本文档
sidebarDepth: 2
---

# 介绍
本文档由VuePress框架进行构建，关于VuePress框架的介绍，请跳转至[VuePress](https://vuepress.vuejs.org/zh/)进行学习使用

本文档使用VuePress的默认主题。若您有更加适合的用于本文档的主题构建，请Fork本仓库，配置好GitHub Pages供预览后，在本仓库新建一条issue并附上Github Pages地址。

本文档中的所有内容遵循CC-BY-SA 4.0协议，开源代码部分遵循MIT License，请知悉。

## 本文档是如何构建的？
::: tip
本文档默认您对Markdown语法、Git工具的使用、持续集成工具(CI)、VuePress有一定的了解，若您是上面几项技能的初学者，请先通过搜索引擎简单学习相关知识，再阅读以下部分。
:::

::: warning
本文档采用了Travis CI进行自动构建。当本文档仓库主分支产生新的Pull Request，Travis CI会根据您提交的副本进行构建测试。若您的模板无法通过正常的构建测试，我们将不会把您的Pull Request合并到主分支中，请知悉。
:::

本文档使用了全自动的部署构建，若你想帮助完善本文档，只需要简单的几步，您的更改就会自动更新到页面中。

### Fork副本
正如其他开源项目的开发流程，您先需要将本文档Fork到您的个人仓库中。您可以通过对该副本的内容进行修改，再通过Pull Request将改动推回原始仓库。

### 文档目录结构
#### `docs` 文档内容目录
本文档docs目录下的结构如下所示，随着内容的更新，部分结构可能存在缺失，欢迎您对此进行补充。

::: warning
若您需要维护文档内容，请仅更新docs目录下的文件。若需要对文档的配置进行更新，请修改后在Pull Request中详细说明更改的部分并附上更改后的效果样本
:::

::: tip
该树形结构使用`tree`命令生成，macOS用户可以使用brew进行安装
:::
```
.
├── README.md
├── code_template
│   └── index.md
└── contribute
    └── guide.md
```
您应把代码模板放在`code_template`中，把构建文档放在`contribute`目录中。

在根目录下的内容是由初始开发者构建好的部分，若没有必要的原因请不要修改。

#### 根目录
根目录下的文件是本项目的基础配置文件。包括:
* .travis.yml Travis CI持续构建配置
* LICENSE 本项目的开源协议
* package.json 本项目的依赖
* package-lock.json 本项目的依赖树(自动生成，请勿手动修改)
* README.md Github Repo README文件

#### `deploy`目录
本目录下的文件是Travis CI构建使用的shell文件，若需要添加新的构建命令，请将文件放置在本目录，并执行命令:
```shell script
git update-index --chmod=+x path/to/file
```
请将其中的`path/to/file`更换成您需要执行的文件。

#### `node_module`目录
::: danger
本目录为npm根据package.json中依赖所安装的依赖库文件目录，请不要擅自更改。
:::
#### `.travis`目录
::: danger
本目录包含自动提交的密钥文件，请不要擅自更改。 
:::

### 编写文档
您可以在`docs`文档下新建一个Markdown文件。
该文档的title(如本页面左侧导航栏的**更新本文档**)放置在文档开头，使用Front Matter语法编写。

如以下示例
```yaml
---
title: 更新本文档
---
```

对于每一个文档，构建工具在生成的时候会根据其在文档中的目录结构生成一个对应的html文件。如本文档在目录中的地址为
```yaml
/contribute/guide.md
```
那么，在构建后，您则可以通过以下方式访问本文档
```yaml
/contribute/guide
# 您也可以使用/contribute/guide.html
```
框架会自动帮您转换文档的后缀

### 预览文档
通过VuePress的构建工具，我们可以一边编写文档，一边在浏览器中查看文档经过编译的结果。

您需要通过执行
```shell script
npm run docs:dev
```
启动热更新模式。在开发环境启动完成后，程序会返回一个本地预览地址，您可以通过该地址访问您本地构建的文档。

脚手架会监听文档目录下文件的变动情况，在您保存文件后，VuePress会自动进行编译，并把内容推送到本地测试地址的页面中。

### 发布
当您完成对文档更改，并通过Git提交到您的Github fork repo以后，请给主仓库推一个Pull Request,必要的时候可以要求管理员对您的更改进行Review。

Travis CI会对您的PR进行打包测试。打包测试通过以后管理员才会考虑将您的更改合并到主分支。

管理员在同意您的PR后，Travis CI会根据您更新的内容进行一次完整构建，并将编译好的`dist`文件夹下的文件推送至主仓库的`gh-pages`分支下。您可以查看commit log确认更新推送情况。

在构建完成后，您便可以通过本文档的地址查看更改后的最新的内容。
