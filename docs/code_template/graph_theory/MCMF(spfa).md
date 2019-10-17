---
title: 最小费用最大流
---

# 最小费用最大流

## 说明
使用结构体，可改用命名空间

## 使用
$d.addedge$先后四个参数分别为起点，终点，容量，费用（单项边）
$d.MinCostMaxFlow$先后三个参数分别为源点，汇点，费用（引用），返回的为最大流

## Tips
**1、调用$d.MinCostMaxFlow$时，记得传入$cost$（一般设置为$0$）**
**2、一定一定要重置结构体的$n$（总点数），因此构造超级源点和超级汇点时一般编号连续**

## 代码
``` cpp
struct MCMF {//记得重置n
    struct Edge {
        int from, to, cap, flow, cost;       //起点,终点,容量,流量,花费
        Edge(int u, int v, int c, int f, int w) : from(u), to(v), cap(c), flow(f), cost(w) {}
    };

    int n, m;                //结点数,边数(包括反向弧),源点s,汇点t
    vector<Edge> edges;            //边表。edges[e]和edges[e^1]互为反向弧
    vector<int> G[maxn];           //邻接表，G[i][j]表示结点i的第j条边在edges数组中的序号
    bool inq[maxn];                //是否在队列中
    int d[maxn];                   //Bellman-Ford
    int p[maxn];                   //上一条弧
    int a[maxn];                   //可改进量

    void init(int n) {
        this->n = n;
        edges.clear();
        for (int i = 0; i <= n; i++)
            G[i].clear();
    }

    void addedge(int from, int to, int cap, int cost) {
        edges.push_back(Edge(from, to, cap, 0, cost));
        edges.push_back(Edge(to, from, 0, 0, -cost));
        m = edges.size();
        G[from].push_back(m - 2);
        G[to].push_back(m - 1);
    }

    bool BellmanFord(int s, int t, int &flow, long long &cost)//SPFA
    {
        for (int i = 0; i <= n; i++)
            d[i] = inf;
        memset(inq, false, sizeof(inq));
        d[s] = 0;
        inq[s] = true;
        p[s] = 0;
        a[s] = inf;
        queue<int> Q;
        Q.push(s);
        while (!Q.empty()) {
            int u = Q.front();
            Q.pop();
            inq[u] = false;
            for (int i = 0; i < G[u].size(); i++) {
                Edge &e = edges[G[u][i]];
                if (e.cap > e.flow && d[e.to] > d[u] + e.cost) {
                    d[e.to] = d[u] + e.cost;
                    p[e.to] = G[u][i];
                    a[e.to] = min(a[u], e.cap - e.flow);
                    if (!inq[e.to]) {
                        Q.push(e.to);
                        inq[e.to] = true;
                    }
                }
            }
        }
        if (d[t] == inf) return false;
        flow += a[t];
        cost += (long long) d[t] * (long long) a[t];
        for (int u = t; u != s; u = edges[p[u]].from) {
            edges[p[u]].flow += a[t];
            edges[p[u] ^ 1].flow -= a[t];
        }
        return true;
    }

    int MinCostMaxFlow(int s, int t, long long &cost) {
        int flow = 0;
        cost = 0;
        while (BellmanFord(s, t, flow, cost));
        return flow;
    }

} d;
```
