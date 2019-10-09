---
title: 图论--最大势
---

# 图论--最大势

## 说明
  - 最大势算法：求弦图的完美消除序列算法

## 使用
  - 创建数据结构: GPPF
  - 建图成功后调用`GPPF::solve()`

## Tips


## 代码
```cpp
#include      <iostream>
#include       <iomanip>
#include        <string>
#include        <cstdio>
#include         <cmath>
#include       <cstring>
#include     <algorithm>
#include        <vector>
#include         <queue>
#include         <deque>
#include          <list>
#include           <map>
#include <unordered_map>
#include <unordered_set>
#include           <set>
#include        <bitset>
#include       <fstream>
#include         <ctime>
#include         <stack>
#include         <regex>


typedef long long                               LL;
typedef unsigned long long                     ULL;
#define pi                            pair<int,int>
#define lowbit(x)                        (x)&(-(x))
#define mp                                make_pair
#define irange(i, arr)              for(auto&i:arr)
#define range(i, a, b)       for(auto i=a;i<=b;++i)
#define itrange(i, a, b)     for(auto i=a;i!=b;++i)
#define rerange(i, a, b)     for(auto i=a;i>=b;--i)
#define IOS ios::sync_with_stdio(false), cin.tie(0)
#define fill(arr, tmp)  memset(arr,tmp,sizeof(arr))
using namespace std;
/// here to write const value like: const int mod = 1e9+7


/// here to write data structure
struct GPPF{
    static const int mxn = 1e5+5;
    bool vis[mxn], use[mxn];
    int n,m,ans,cnt[mxn];
    vector<int>G[mxn];
    GPPF(int n,int m):n(n),m(m){
        range(i,1,m){
            int u,v;
            cin>>u>>v;
            G[u].push_back(v);
            G[v].push_back(u);
        }
    }
    void solve(){
        priority_queue<pi > q;
        range(i, 1, n)q.push(mp(0, i));
        while (!q.empty()) {
            while(!q.empty() and vis[q.top().second])q.pop();
            if(q.empty())break;
            int u = q.top().second;
            q.pop();
            vis[u] = true;
            if(not use[cnt[u]]){
                ++ans;
                use[cnt[u]] = true;
            }
            irange(i,G[u]){
                if(vis[i])continue;
                ++cnt[i];
                q.push(mp(cnt[i],i));
            }
        }
        cout<<ans<<'\n';
    }
};

void init() { /// here to write init function

}

void solve() { /// here to write main algorithm
    GPPF g(10,10);
    g.solve();
}

int main(int argc, char**args) {
    IOS;
    init();
    solve();
    return 0;
}
```
