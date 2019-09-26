---
title: CLion安装和激活
---
::: tip
本文原作者为[@Slian](https://github.com/Slian22)
:::

# CLion安装和激活
::: tip
[@ryanlee2014](https://github.com/ryanlee2014): Jetbrains套件下的其他IDE也可以使用本Manual的前五点完成激活。
:::

::: warning
本文内容以Windows视角进行整理，关于macOS系统中不同的部分将会使用**warning** tag特别标注
:::

## 关于ToolBox

![image1](image\image1.png)



简单来说，就是可以下载JetBrain全家桶（我全都要）

## First: 获得Toolbox学生免费正版

登录中国石油大学（北京）学生邮箱（http://mail.student.cup.edu.cn/），默认用户名为学号（例如2017010001），默认密码为生日（例如20000101），第一次登录后需要修改密码，请务必牢记修改后的密码。

![image2](image\image2.png)

## Second: 申请Toolbox

点击前往[JetBrains Toolbox 专业开发工具
 学生免费授权计划](https://www.jetbrains.com/zh/student/)

![image3](image\image3.png)

![image4](image\image4.png)

点击立刻申请，就会出现以下画面

![image5](image\image5.png)

填写

![image6](image\image6.png)

以下必点

![image7](image\image7.png)

重新打开学生邮箱，此时会看到来自Jetbrains的验证邮件，点击链接即可。

![image8](image\image8.png)

在新打开的页面中设置Jetbrains账号的密码即可。

## Third：下载ToolBox

登录页面下载

[Toolbox App](https://www.jetbrains.com/toolbox/app/)

**注意**

::: warning
macOS用户同样需要注意用户名问题，请参考macOS的用户名更改方式
:::

如果你的用户名字为中文（之前我得用户名为C:\Users\单联天）,请务必设置第四步。如果用户名为英语，即可跳过第四步。

![image9](image\image9.png)

下载完成以后

![image10](image\image10.png)

点击右上角的Setting键，找到相关目录，然后找到文档目录，将文件迁到别的盘（为了节省C盘空间）
::: tip
[@ryanlee2014](https://github.com/ryanlee2014): 如果你的C盘空间足够，那么建议你装在C盘,可以节省许多不必要的麻烦。
:::

::: warning
macOS用户无需切换盘符
:::

文件迁到别的盘的情况下，下载的文档即可在别的盘下载下来。

（ToolBox会将所有文件下载到自己的目录下）

## Forth：Windows10修改中文用户文件夹

**尽早将所有文件名不要用中文命名，这是一个好习惯。（不然配置编译器的时候就会很吃亏）**

参考文章：Windows10_如何修改用户文件夹下的中文用户文件夹名

[https://blog.csdn.net/tanzey/article/details/82657816](https://blog.csdn.net/tanzey/article/details/82657816)

::: warning
macOS用户更改用户名的教程请自行通过搜索引擎查找。
请善用[Google](https://www.google.com),如果你在校园网可以使用[Google IPv6](https://ipv6.google.com)
:::

亲身实践做完之后，用杀毒软件做一下检测，自动将别的环境变量改过来了。

（不然也可以自己重装一下系统，换一个用户名-English）

或者，可以花个钱，重装系统。

## Fifth：下载并激活CLion

### 下载

  打开ToolBox，找到CLion，点击install。

  等待即可

  最终文档目录在开始菜单中的最近添加显示

![image11](image\image11.png)

### 激活

  打开CLion，在出现的激活窗口输入Jetbrains账号（学生邮箱）密码（自己设定），点击“Activate”按钮即可。

  ![image12](image\image12.png)

## Sixth：配置CLion

::: warning
macOS用户请使用
```shell script
brew install gcc
```
安装GCC套件，若没有安装`HomeBrew`的可以Google安装

然后在CLion新建好的项目中，找到`CMakeLists.txt`文件，在`add_executable`前一行添加
```shell script
set(CMAKE_C_COMPILER /usr/local/bin/gcc-9)
set(CMAKE_CXX_COMPILER /user/local/bin/g++-9)
```
其中那个`9`代表你安装的gcc版本，请根据实际安装的版本更改版本号。如`gcc-8`,`g++-8`。
:::

**方法一：下载MinGW压缩包**

**（1）下载MinGW**
这里必须注意的是下载压缩包，不要下载离线安装的版本，不然你会装到猴年马月，而且安装难度较大。
打开下载地址：[MinGW](https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/) 进入下载页面

![image13](image\image13.png)

**注意：不要手贱点绿色按钮去下载！！！**
往下拉，一直拉到下面的界面，然后就可以下载压缩包了。

![image14](image\image14.png)

下载了以后必须是解压啊，然后开始配置CLion。

打开CLion，左上角File-Settings-Build-Toolchains，然后点击 **+** 号

![image15](image\image15.png)

Environment选择MinGW，然后填入刚刚解压的MinGW64的路径（这是我的路径）：

E:\FOrMinGW\mingw64

然后CLion会自动帮你填上所有你该填的东西，点击OK，等调试的小虫子变绿就可以了。

**当然，也会出现无法检测成功的情况，这时候就需要手动填写啦。**
 调试完成！！！

**方法二：借助DEV C++**

**（1）下载安装DEV C++**
 https://sourceforge.net/projects/orwelldevcpp/

安装默认路径即可，注意，选择full安装！！！

**（2）配置CLion**

同样地，打开CLion，左上角File-Settings-Build-Toolchains，然后点击 **+** 号

![image16](image\image16.png)

![image17](image\image17.png)

Environment选择MinGW，然后填入刚刚安装的dev cpp的MinGW64的路径：

E:\ Dev-Cpp\MinGW64

然后OK，等一段时间就可以了。

## Sixth：运行一个简单的Program

· 左上角File->New Project

![image18](image\image18.png)

Location是你的存放程序的地址。

我这里设置的是E:\HelloWorld

![image19](image\image19.png)

Create以后，出现以下画面，稍微等一会（CLion在加载程序）

![image20](image\image20.png)

右键程序（随便一处就行）

点击Run ‘HelloWorld’或者使用快捷键Ctrl+Shift+F10运行程序

![image21](image\image21.png)

或者点击右上角的绿色剪头即可运行程序。

![image22](image\image22.png)

The End。

## Seventh：CLion进阶

[CLion基本使用方法](https://blog.csdn.net/CSDNhuaong/article/details/88094027)

[配置参考](https://www.jianshu.com/p/1aa989808e15)
