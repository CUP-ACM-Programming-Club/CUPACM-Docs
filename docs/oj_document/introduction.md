---
title: CUP Online Judge开发文档
sidebarDepth: 2
---
**CUP Online Judge**是一个以Vue.js作为前端框架，ExpressJS 作为后端框架开发的在线评测系统。


*注: CUP Virtual Judge属于较为独立的、技术栈未成熟的另外一个程序，因此在本程序中不会涉及到与Virtual Judge系统相关的接口开发问题。*

**CUP Virtual Judge由于国内各大OJ调整对海外IP地址访问的策略，现在暂时停止提交功能，保留题目内容供查询。**


## Github Actions 持续集成
CUP-Online-Judge-NG-FrontEnd使用了`Github Actions`进行全自动持续集成

根据设置，持续集成环境配置支持

* 本地构建->持续集成发布
* 远程构建->发布

### 本地构建->持续集成发布
0. 将根目录下`NEED_BUILD`文件内容改为`false`
1. 在本地开发环境运行`npm run modern`
2. 运行`git add dist`将`dist`目录下所有文件加入本次变更
3. push到Github环境，启动自动发布。

### 远程构建->发布
0. 将根目录下`NEED_BUILD`文件内容改为`true`
1. push到Github环境，启动自动发布。

### 发布目标

持续集成工作流会把`dist`文件夹内容发布到`CUP-Online-Judge-CDN`仓库中，并将根据打包过程中生成的版本发布`releases`供jsDelivr缓存


## CDN
考虑到本系统所有前端的文件经过打包后大小高达50MB,考虑在非必要时候使用CDN分担服务器的网络压力

### jsDelivr CDN

[https://oj.cupacm.com](https://oj.cupacm.com)

[https://www.cupacm.com](https://www.cupacm.com)

以上节点使用了jsDelivr作为CDN服务提供方，通过持续集成自动部署发布版本到CUP-Online-Judge-CDN仓库，即可简单通过控制index.html更改需要部署的前端版本

## 云化
### Datasource
* MySQL 使用阿里云RDS MySQL服务器
### Middleware
* 判题机注册节点 **待开发**
### Core
* 前端 已完成
* 后端 已完成
* 判题机 待开发
## 线上已知问题

迁移至[CUP Online Judge系统问题整理复盘](/discuss/thread/17)
~~* WebSocket进程有CPU hang100%的现象~~
~~解决方案:排查中~~

~~* 提交事件响应抖动造成冗余提交~~
~~解决方案: 前端去颤加锁，后端加计时器~~

~~* 发布有较大不确定性，有不可预估的风险~~
~~解决方案: 新增部署dev环境->ppe环境->prod环境发布链，新发布统一走SOP变更。~~

## TypeScript改造
> 动态一时爽，重构火葬场

为了杜绝以上情况的出现，现计划通过改造当前后端，使用TypeScript语言重构。

**注: 使用TypeScript请务必抽象化规范化各种DO,减少不必要的`any`声明**

如果你也对重构计划感兴趣，欢迎访问
* (后端)[CUP-Online-Judge-Express:typescript](https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Express/tree/typescript)
* (前端)[CUP-Online-Judge-NG-FrontEnd](https://github.com/ryanlee2014/CUP-Online-Judge-NG-FrontEnd)

为我们贡献代码

## 集群化
目前后端功能逐渐丰富，接口的数量也逐渐增加，带来的性能开销也越来越大。在高并发及高任务提交的环境下，数据库查询队列负载过重，同时CPU占用率高导致判题效率严重下降，造成较为严重的后果。

在当天晚上通过使用Apache Bench对后端接口进行压测过程发现，服务器多个接口均存在不能耐受突发高并发请求的情况。包括但不限于：
* 问题历史页面接口: `problemstatus` (响应时间: 4s)
* 问题集接口： `problemset` (响应时间:1s)
* 竞赛列表接口： `contest` (响应时间: 800ms)
* ...

原缓存模型为：
<mermaid>
graph LR;
    路由中间件--SQL查询-->MySQL缓存层;
    MySQL缓存层--SQL查询-->MySQL数据库;
    MySQL数据库-.结果.->MySQL缓存层;
    MySQL缓存层--缓存查询-->缓存;
    MySQL缓存层--缓存更新-->缓存;
    缓存-.返回缓存 or null.->MySQL缓存层;
    MySQL缓存层-.返回结果.->路由中间件;
</mermaid>
以上接口在面临高并发请求任务时，由于服务器本身缓存部分为MySQL任务结果，并没有对接口本身做缓存优化，因此存在以下缓存穿透的可能。

在高并发环境下，对于SQL查询语句存在重复的情况，而部分慢查询不能及时将数据存到缓存层中，造成缓存穿透，所有请求直接打到数据库，造成后端服务器掉底。

针对这种情况，可以考虑使用加锁进行优化。对于每个查询，先获得锁，然后进行查询缓存任务，完成后释放锁，保证后续任务能够直接命中缓存。

<mermaid>
graph LR;
    路由中间件--SQL查询-->MySQL缓存层;
    MySQL缓存层--SQL查询-->MySQL数据库;
MySQL缓存层--加锁/解锁-->MySQL缓存层
    MySQL数据库-.结果.->MySQL缓存层;
    MySQL缓存层--缓存查询-->缓存;
    MySQL缓存层--缓存更新-->缓存;
    缓存-.返回缓存 or null.->MySQL缓存层;
    MySQL缓存层-.返回结果.->路由中间件;
</mermaid>

以上模型能够解决慢查询击穿数据库的问题。但是如果并发量较大，初始未加缓存的情况下仅能有一个查询在同时进行，性能还没有达到最优。这时候我们可以考虑维护锁管理器，对于每个查询按照指定的规则生成锁的键值，对于每类查询，保证只会命中特定的锁，而不影响其他无关查询的性能。

<mermaid>
graph LR;
    路由中间件--SQL查询-->MySQL缓存层;
    MySQL缓存层--SQL查询-->MySQL数据库;
MySQL缓存层--加锁/解锁-->锁管理器;
    MySQL数据库-.结果.->MySQL缓存层;
    MySQL缓存层--缓存查询-->缓存;
    MySQL缓存层--缓存更新-->缓存;
    缓存-.返回缓存 or null.->MySQL缓存层;
    MySQL缓存层-.返回结果.->路由中间件;
</mermaid>>

通过以上几步优化，我们成功将原本并发量为1~~也就是完全没有并发的杂鱼~~提升为500rps上下。

但是500rps并不能让我们停止对性能提升的追求。通过使用`top`工具观察压测过程中的资源使用情况，我们发现对于单进程，`node`已经跑满单核CPU的所有计算资源。我们知道，`Node.js`使用单线程维护事件队列保证异步高并发的运行环境。而我们显然需要发挥一台计算机多核的威力，不能仅实现一核有难，多核围观这一情况。

### Cluster
Node.js在官方库中提供了`Cluster`这一模块，使得Node应用能够以集群的形式运行在服务器上。

我们可以通过启动一个`Master`进程，fork与CPU数量相当的`Worker`进程，由`Master`进程获得TCP连接，使用RoundRobin算法平均分配给各个进程，实现负载均衡。
<mermaid>
graph TD;
TCP-->A;
A[Master进程]-->B[Worker 1];
A[Master进程]-->C[Worker 2];
A[Master进程]-->D[Worker 3];
A[Master进程]-->E[Worker 4];
A[Master进程]-->F[Worker 5];
A[Master进程]-->G[Worker 6];
A[Master进程]-->H[Worker 7];
A[Master进程]-->I[Worker 8];
</mermaid>
但是为什么我没有一开始就用这种模型开发呢？
因为在我们系统中**存在单例模式的组件，组件对变更事件敏感**。
以下组件是要求严格单例模式且需要即时响应请求的:
1. 判题模块
2. ConfigManager
3. 在线用户管理
4. WebSocket通信模块

其中(1)(3)(4)模块的抽象保证耦合，(2)模块要求即时同步更新。

对于前面这种情况，我采用应用切分的方式实现功能的解耦合，将(1)(3)(4)作为一个新服务切分出来，在其他服务掉底的情况仍能保持判题功能。
<mermaid>
graph TD;
A[CUP Online Judge]-->B[CUP Online Judge Express];
A-->C[CUP Online Judge WebSocket]
B-->HTTP
HTTP-.->B
C-->WebSocket
WebSocket-.->C
HTTP-->D[Client]
WebSocket-->D
</mermaid>


后面这种情况，使用进程间通信保证一致性。
<mermaid>
graph TD;
U[Worker]--通知更新-->A[Master]
A--广播-->B[Worker 2]
A--广播-->C[Worker 3]
A--广播-->D[Worker 4]
A--广播-->E[Worker 5]
</mermaid>

然后经过一番优化以后，上述几个瓶颈接口达到了惊人的2300rps,更不用说剩下一些不涉及数据存取的部分，性能提升相当显著。

### 热更新
考虑推线上发布的时候会短暂影响用户的使用体验，而在改造集群以后可以通过负载均衡分配任务给不同的Worker进程。因此可以通过现有的模型改造热更新方案。

通过IPC通信通知Master进程重启，Master进程将Worker进程时间Promise化，实现平滑进程过渡，保证用户在无感知情况下实现更新。

<mermaid>
graph LR;
A[New Worker]--bootstrap-->B[Worker Set]
B--Destroy-->C[Dead Worker]
</mermaid>

## 为什么选用Node.js作为后端

Node.js有以下优点:
* 单线程
  * 协程
* 高并发
  * I/O密集
* 事件队列
  * 事件驱动型后端
* ~~敏捷开发~~
  * ~~前端后端一把梭~~
* NPM

缺点:
* 不适用于计算密集型应用
* 动态语言
> 动态一时爽，重构火葬场
(TypeScript重构希望~~在做了 在做了~~)
* 不够完善的后端生态

本文档使用GitHub作为版本控制工具，访问本文档旧版本内容请前往下列链接查看:
<a href="https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-doc/blob/master/CUP-Online-Judge%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3.md" target="_blank">CUP-Online-Judge开发文档.md</a>

阅读本文档需要了解以下预备知识:
* Node.js(v~~10.0~~12+)
* JavaScript(ES~~5~~~~6~~~~7~~10)
* TypeScript
* PHP(v7.0+)(**Deprecated***)
* Linux
* C++(17+)**
* HTML(HTML5 is optional)
* Vue.js 2+
* CSS3
* SQL
* Redis
* Apache httpd(**Deprecated**)
* Nginx

*: PHP即将在`去PHP`计划中被删除。
**: ThreadPool使用了C++17语法特性(Lambda表达式)
## 程序架构

本程序参照了HUSTOJ与SYZOJ的架构，采用了MySQL + Node.js + Linux C/C++ ~~+ PHP~~技术栈进行开发。

下列列出的本程序的项目已经开源。
* <a href="https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Express" target="_blank">基于Node.js Express开发的后端</a>
* <a href="https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Judger" target="_blank">基于简易沙箱的判题机</a>
* <a href="https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-docker-judger" target="_blank">基于Docker的判题机</a>
* ~~<a href="https://github.com/CUP-ACM-Programming-Club/CUP_Online_Judge_Semantic_UI" target="_blank">基于Semantic UI构建的、使用Vue.js作为框架的前端</a>~~<a href="https://github.com/ryanlee2014/CUP-Online-Judge-NG-FrontEnd" target="_blank">基于Vue-Cli 3.0构建的Vue.js单页应用程序</a>
* <a href="https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Problem-Packer" target="_blank">使用Electron Vue开发的跨平台题目打包管理器</a>
* ~~<a href="https://github.com/ryanlee2014/HUSTOJ-Flat-UI-Theme" target="_blank">基于Flat UI开发的PHP事务下的主题</a>~~

下列部分~~暂未开源，或者~~由于即将被替代/与其他开源项目的功能重复决定不做开源处理。
* 基于Medoo编写的旧版的PHP事务部分
* 基于Semantic UI与Bootstrap开发的主题
* 管理员管理后台

关于本程序采用的开源软件，请访问[开放源代码声明](https://www.cupacm.com/opensource.php)查看。

## 写在开发前

为了更好的方便内部模块间的协同工作，请认真理解本程序的工作流程，即使它非常的混乱、冗余。

在为本程序进行开发时请时刻~~牢记**稳定**与**必要**是该程序功能增改的一大原则~~考虑以领域驱动设计(DDD)的角度对模组抽象化。

以下是本程序在用户登录后模块间通信的图示。
![](https://raw.githubusercontent.com/CUP-ACM-Programming-Club/CUP-Online-Judge-doc/master/pic/program_structure.png)

可以分为以下部分。
### ~~Node.js Runtime~~基于Node.js Express开发的后端
使用ExpressJS框架，主要功能：
* 使用Socket.IO与用户进行双向通信
* CRUD(**Deprecated:考虑到Node.js对运算密集部分的不友好，这部分将考虑使用微服务进行拆分**)
* 维护判题队列
* 用户权限管理
* 题目文件部署
* WebSocket转发
* 信息广播

#### 程序文件夹
\- root
\--- static 静态文件文件夹(js库/css库)
\--- route 路由文件夹(API接口)
\--- manager 领域设计贫血模型
\--- orm 数据库对象关系映射模型(Sequelize.js)
\--- test 单元测试
\--- bin 启动文件夹(程序启动文件)
\--- module 模块文件夹(被其他文件调用)
\--- middleware 中间件文件夹(中间件)
\--- views 模版文件夹(pug文件模板)
\--- logs 日志文件夹(日志)

#### 程序启动(Daemon)
`npm start`

#### 程序启动(Debug)
`npm test`

#### 程序重启(Daemon)
`npm restart`

### C++ Judger

使用EasyWebsocket、HUSTOJ Judger进行重构、开发
主要功能:
判题:

## 一个提交的执行流程

### 客户端
1. 用户点击`提交`按钮
2. 代码、token被打包，委托Socket.IO模块推送到Node.js Runtime
3. Socket.IO模块接受`result`事件，调用挂在`window`上的`problemsubmitter`Vue实例，Vue实例执行相关操作，显示判题情况。

### 服务器 
##### Node.js Runtime
1. (/bin/main.js)收到`submit`事件响应的数据，将数据移交`submitControl`模块，判断提交合法性并解包数据，存储至数据库中
2. 等待模块返回完成信号，建立socket连接与solution_id的映射，将判题任务移交到判题机
3. 判题机维护判题队列。
   - 若队列空闲则直接唤起空闲判题机移交判题任务
   - 若队列非空，则赋予高优先权移交队列，等待判题机结束后询问队列，入队判题
4. 通过WebSocket模块接收来自判题机的判题信息，通过查阅solution_id对应的socket连接，将数据转发给对应socket
5. WebSocket模块通过检测完成信号，释放相关资源
6. 判题机判题结束，检查队列任务，若队列非空，则获取队列头的任务进行判题，若队列为空，则判题机入空闲队列

#### C++ Judger
1. 被Node.js Runtime唤醒，建立简易沙箱环境，~~获取MySQL连接~~目前开启`-no-mysql`模式，会变为使用Node.js通过WebSocket传送数据至后端
2. 初始化系统调用，载入数据文件
3. 判断提交类型
   - 测试运行：不进行答案比对，直接返回评测数据，程序结束
   - 正常提交：根据题目内容进行评测，根据数据库取出的数据决定判题方法为`文本对比`或`Special Judge`
     - 文本对比：对比标准输出与用户输出的内容，返回`Wrong Answer`/`Presentation Error`/`Accept`信息
     - Special Judge: 将输入文件、输出文件、用户输出、用户代码传入程序，根据程序退出时返回的值决定判题结果。理论上可以返回所有的判题结果。

4. 数据保存，更新用户数据与题目数据
5. 退出程序

## PHP与Node.js之间如何共享用户数据

在每次访问PHP页面时，`/include/db_info.inc.php`文件作为所有PHP文件的头文件被引入到PHP文件中，该文件包括了数据库相关的函数初始化以及缓存数据库的初始化。同时该文件会生成一个和用户`user_id`相关的`token`,并将`token`和`user_id`一同保存在cookie中，在页面进行XHR时cookie会一同发送到Node.js运行时环境 

若访问的是Vue单页应用(即当前生效的页面),`generate_token`中间件会在`cookie`中添加一个`newToken`及`user_id`字段，并通过Redis为List: ${user_id}newToken添加一个新的token,PHP页面通过`/include/db_info.inc.php`进行登录鉴权。

## ConfigManager
ConfigManager是一个系统参数及开关状态的统一管理模块，通过设置存储模块和日志模块进行可持久化及日志回滚操作。

模块支持使用**MySQL**及**Redis**进行持久化。

该模块目前在后端用于灰度发布及动态配置管理。

### Config
Config是一个运行时根据管理员设置动态改变的key-value配置。开发者可以在任何需要动态配置的地方插入`ConfigManager.getConfig(key)`获得Config数据。需要注意的是`key`值是唯一的，`Config`表不能有重复key值存在。

### Switch
Switch是一个运行时根据管理员设置的动态改变的开关。开关的值为$[0,100]$,其中开关值代表开关打开的概率。不难发现，0代表开关关闭，100代表开关打开，而中间态代表开关有一定概率是打开状态，而概率为$n$%。在每次调用`ConfigManager.isSwitchedOn(key)`的时候，系统会随机生成一个$[0,100]$的数与设置的数进行大小对比以获得开关状态。
显然，Switch是一种特殊的Config。

**ConfigManager在系统中是一个单例模块**

## Node.js Router开发

要使前端能够调用接口，访问数据，就需要开发对应的Router响应时间。所有的Router文件均放置于文件夹`/router`下。编写Router的方式与Express.js官网的模板相似，只需导出数组
```javascript
module.exports = ["router_path", middleware, Router]
```
就能够被app.js自动在启动时载入。

### Interceptor
对于部分需要根据后台配置管理的路由，可以在暴露的数组中添加`Interceptor`中间件，从`/module/interceptor/middleware.js`中通过`InterceptorFactory`配置`validator`,使用`getInterceptorInstance`获得拦截器实例放入路由出参middleware中即可。

`validator`: boolean Function(req, res), 传入`request`，`response`对象，根据返回值决定是否调用`next()`执行下一个中间件。

可以配合`ConfigManager`中的`switch`及`config`进行动态更改开闭状态。

## Node.js Module开发

所有的后台功能若是能够抽象的，应该开发成`Module`以供使用。开发的Module存放在`/module`文件夹下即可

## Node.js Socket.IO开发

该模块是后台程序诞生的原因~~显示在线人数~~,因此这里的代码是所有代码中历史最久远的部分。目前还没有整理方便置入中间件或绑定响应时间的接口。请等待版本更新。

## 前端开发

前端是本系统中一个非常重要的部分。考虑到服务器本身对CPU的依赖，于是所有的非保密数据的运算均由客户端(即用户浏览器)运算得出。

本平台界面采用Semantic UI进行构建，因此能够支持~~Semantic UI~~Fomantic UI最新文档下的所有模块及特效。

大多数的页面由最新版本的Vue.js驱动。由于`去PHP计划`还没有全面完成，部分页面仍将使用旧版的PHP模块驱动。
目前还使用PHP模块驱动的页面有(此处不考虑CUP Virtual Judge):
- ~~竞赛及作业~~
- ~~管理员后台~~
- ~~编译错误页面~~
- ~~运行错误页面~~
- 注册页面*

删除在`3.0.0-alpha`版本中已重构的部分
*: 正在重构中

以上的页面将在不久的将来被Vue页面替代，因此在这些页面上进行功能增删需要三思。

当前所有的前端请求均通过**AJAX**与后端保持通信，~~考虑到Semantic UI仍然基于jQuery进行开发，为了减少过多第三方库的引入，建议直接使用jQuery的接口进行XHR请求~~请直接在`CUP-Online-Judge-NG-Frontend`中使用`this.axios`进行AJAX操作。

有少数的功能不能够使用AJAX通信，而必须使用Socket.IO接口与后端通信。
- 历史页面最新提交的更新
- 题目提交页面评测题目
- 黑板
- 全局信息推送
- 建立WebSocket时提交的环境数据
- 在线用户情况
- 评测队列

## Git
### 版本
开发版本格式为：`${major-version}.${maintain-version}.${bugfix-version/refactor-version/hotfix-version}[optional: ${alpha|beta|ppe}]`

#### 如何针对代码的改变选择适合的版本号变化
当出现以下变化的，大版本增加:
* 核心代码完全重构
* 环境更改

当出现以下变化的，小版本增加:
* 增加前/后端模块链
* 修改前/后端模块链
* 新增/修改Plugin
* 新增非重要功能
* 删除模块/UI更改

当出现以下变化时，修复版本增加:
* 修复Bugs
* 更新依赖
* 更正typo
* 新增/修改测试用例
* 无感知的功能重构

## 发布
**非线上紧急修复问题，一律禁止在高峰期进行任何发布**

### 后端发布

#### WebSocket发布
该服务为单例应用，重启过程没有任何安全措施。请尽可能于低峰期发布。
未来将考虑接入主Cluster节点。

#### 功能发布
该服务涉及除判题机及在线用户以外的所有服务，目前可采用安全的在线热部署进行重启。

热部署触发链接:[Hot-Reload](/api/admin/system/hot-reload/)

管理员通过以下链接Notify主进程进行重启作业。重启失败时，现有Worker将不会被替代。

同理，主进程相关逻辑为单例应用，重启过程有一定的安全措施，但也请务必在低峰期更改。

Master重启流程

<mermaid>
graph TD
A[Worker] --Notify--> B[Master]
B --Fork--> C[new Worker]
C --> D{isAlive?}
D --N-->E[End]
D --Y--> F[Fork new workers]
F --> G[Update worker queue]
G --> E
</mermaid>
