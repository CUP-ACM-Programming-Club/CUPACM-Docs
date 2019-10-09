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
struct GPPF{
#define mp                                make_pair
#define irange(i, arr)              for(auto&i:arr)
#define range(i, a, b)       for(auto i=a;i<=b;++i)
#define pi                            pair<int,int>
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
```
