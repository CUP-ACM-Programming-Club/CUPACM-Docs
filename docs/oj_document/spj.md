---
title: 如何为题目编写Special Judge
sidebarDepth: 2
---
# 前言
根据CUP Online Judge开发文档，我们知道Judger支持除了文本对比以外的第二种判题模式: Special Judge。本文主要为题目编写者及做题的同学用于学习或者进行开发使用。

# Special Judge原理简介
根据[judge_client.cpp#L339](https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Judger/blob/master/judge_client.cpp#L339)，当题目信息参数带有`spj=1`时，Judger会执行Special Judge模块进行判题，而不是通过默认策略对用户输出与std进行对比
```cpp
JudgeResult judge_solution(int &ACflg, double &usedtime, double time_lmt, int isspj,
                           int p_id, char *infile, char *outfile, char *userfile, char *usercode, int &PEflg,
                           int lang, char *work_dir, int &topmemory, int mem_lmt,
                           int solution_id, int num_of_test, string &global_work_dir) {
    //usedtime-=1000;
    shared_ptr<Language> languageModel(getLanguageModel(lang));
    cout << "Used time" << endl;
    cout << usedtime << endl;
    cout << time_lmt * 1000 * (use_max_time ? 1 : num_of_test) << endl;
    cout << "judge solution: infile: " << infile << " outfile: " << outfile << " userfile: " << userfile << endl;
    int comp_res;
    if (!ALL_TEST_MODE)
        num_of_test = static_cast<int>(1.0);
    if (ACflg == ACCEPT
        && usedtime > time_lmt * 1000 * (use_max_time ? 1 : num_of_test)) {
        cout << "Time Limit Exceeded" << endl;
        usedtime = time_lmt * 1000;
        ACflg = TIME_LIMIT_EXCEEDED;
    }
    if (topmemory > mem_lmt * STD_MB)
        ACflg = MEMORY_LIMIT_EXCEEDED; //issues79
    languageModel->fixACFlag(ACflg);
    // compare
    if (ACflg == ACCEPT) {
        if (isspj) {
            comp_res = SpecialJudge::newInstance().setDebug(DEBUG).run(oj_home, p_id, infile, outfile, userfile,
                                                                       usercode, global_work_dir);
        } else {
            shared_ptr<Compare::Compare> compare(getCompareModel());
            compare->setDebug(DEBUG);
            comp_res = compare->compare(outfile, userfile);
        }
        if (comp_res == WRONG_ANSWER) {
            ACflg = WRONG_ANSWER;
            if (DEBUG)
                printf("fail test %s\n", infile);
        } else if (comp_res == PRESENTATION_ERROR)
            PEflg = PRESENTATION_ERROR;
        ACflg = comp_res;
    }
    //jvm popup messages, if don't consider them will get miss-WrongAnswer
    languageModel->fixFlagWithVMIssue(work_dir, ACflg, topmemory, mem_lmt);
    return {ACflg, usedtime, topmemory, 0};
}
```
Special Judge模块的执行原理为：
[SpecialJudge.cpp#L19](https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Judger/blob/master/model/judge/policy/SpecialJudge.cpp#L19)
1. 判断spj文件类型，调用对应Runtime启动，在入参中塞入
    1. std 输入
    2. std 输出
    3. 用户输出
    4. 用户代码
2. 处理spj返回的结果，并对返回结果做兼容性处理。

# 编写spj程序
从判题原理可以得出，spj程序目前支持使用
* static binary executable
* Node.js
* Python 3
  进行编写。

spj程序通过各自语言的协议从arguments读取用户输出、std输入输出和用户代码信息。

spj通过判题处理后用程序返回值将判题结果返回。目前支持两种返回的方式：
1. 使用0代表`ACCEPT`，1代表`WRONG ANSWER`
2. 使用标准结果枚举返回

Judger最终会将两种结果归一化，变为标准结果返回给后端服务。
标准结果枚举可参考该文件:
[index.json](https://github.com/ryanlee2014/CUP-Online-Judge-Frontend/blob/typescript/src/type/index.json)
```json
"cn": [
      "等待",
      "等待重判",
      "编译中",
      "运行并评判",
      "答案正确",
      "格式错误",
      "答案错误",
      "时间超限",
      "内存超限",
      "输出超限",
      "运行错误",
      "编译错误",
      "编译成功",
      "运行完成",
      "已加入队列",
      "提交被拒绝",
      "系统错误",
      ""
    ]
```
或者该文件
[staic_var.h](https://github.com/CUP-ACM-Programming-Club/CUP-Online-Judge-Judger/blob/master/header/static_var.h)
```cpp
enum judge_procedure {
    WAITING = 0,
    WAITING_REJUDGE = 1,
    COMPILING = 2,
    RUNNING_JUDGING = 3,
    ACCEPT = 4,
    PRESENTATION_ERROR = 5,
    WRONG_ANSWER = 6,
    TIME_LIMIT_EXCEEDED = 7,
    MEMORY_LIMIT_EXCEEDED = 8,
    OUTPUT_LIMIT_EXCEEDED = 9,
    RUNTIME_ERROR = 10,
    COMPILE_ERROR = 11,
    COMPILE_OK = 12,
    TEST_RUN = 13,
    SUBMITTED = 14,
    SYSTEM_REJECTED = 15,
    SYSTEM_ERROR = 16
};
```

## 一些spj的参考:
C/C++
```cpp
#include <iostream>
#include <sstream>
#include <fstream>

using namespace std;

int main(int argc, char *args[])
{
    ifstream in(args[1]);
    ifstream out(args[2]);
    ifstream user(args[3]);
    ifstream code(args[4]);
    string s;
	while (getline(code, s))
	{
		if (s.find("1299743") != s.npos||s.find("1299000")!=s.npos||s.find("1299740")!=s.npos||s.find("1147678")!=s.npos||s.find("1299742"!=s.npos))
		{
			return 1;
		}
	}
	string s1,s2;
	while(out>>s1,user>>s2)
	{
	    if(s1!=s2)return 1;
	}
	if(!out.eof())return 1;
	if(!user.eof())return 1;
	return 0;
} 

```
Node.js
```javascript
const fs = require("fs")
const argv = process.argv
try {
    let eps = 1e-6
    let stdout = fs.readFileSync(argv[3]).toString().trim()
    let userout = fs.readFileSync(argv[4]).toString().trim()
    let stdoutArray = stdout.split("\n")
    let useroutArray = userout.split("\n")
    let len = stdoutArray.length
    if(len !== useroutArray.length) {
        process.exit(6)
    }
    for(let i = 0;i < len; ++i) {
        if(isNaN(useroutArray[i])) {
            process.exit(6)
        }
        if(Math.abs(parseFloat(stdoutArray[i]) - parseFloat(useroutArray[i])) > eps) {
            process.exit(6)
        }
    }
    process.exit(4)
}
catch(e) {
    process.exit(15)
}
```
目前没有使用Python 3进行spj的例子，因此这里不单独给出Python 3 sample.

# 上传SPJ的方法
通过【题目编辑】页面上传文件即可。
![](https://i.328888.xyz/2023/01/05/WBqNU.png)
上传前可通过[Problem 1498 SPJ测试](https://oj.cup.edu.cn/problem/edit/1498)对SPJ进行合法性测试
