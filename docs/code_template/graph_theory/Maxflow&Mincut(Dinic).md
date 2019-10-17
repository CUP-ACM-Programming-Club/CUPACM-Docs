---
title: 最大流&&最小割(Dinic)
---

# 最大流&&最小割（使用$Dinic$）

## 说明
使用结构体，可改用命名空间

## 使用
$d.ClearFlow$表示将流清空（有利于添边重新计算）
$d.AddEdge$表示添加单向边
$d.maxflow$表示最大流（需要输入源点和汇点）
$d.ClearAll$表示初始化（适用于多组数据）
$d.Mincut$表示最小割的编号集合，调用d.edges可查询到该边

## Tips
最小割需在调用最大流后进行

## 代码
``` cpp
struct Edge {
    int from, to, cap, flow;
};

struct Dinic {
    int n, m, s, t;
    vector<Edge> edges;    // 边数的两倍
    vector<int> G[maxn];   // 邻接表，G[i][j]表示结点i的第j条边在e数组中的序号
    bool vis[maxn];         // BFS使用
    int d[maxn];           // 从起点到i的距离
    int cur[maxn];        // 当前弧指针

    void ClearAll(int n) {
        for (int i = 0; i < n; i++) G[i].clear();
        edges.clear();
    }

    void ClearFlow() {
        for (int i = 0; i < edges.size(); i++) edges[i].flow = 0;
    }

    void AddEdge(int from, int to, int cap) {
        edges.push_back((Edge) {from, to, cap, 0});
        edges.push_back((Edge) {to, from, 0, 0});//反向弧容量为0
        m = edges.size();
        G[from].push_back(m - 2);
        G[to].push_back(m - 1);
    }

    bool BFS() {
        memset(vis, 0, sizeof(vis));
        queue<int> Q;
        Q.push(s);
        vis[s] = 1;
        d[s] = 0;
        while (!Q.empty()) {
            int x = Q.front();
            Q.pop();
            for (int i = 0; i < G[x].size(); i++) {
                Edge &e = edges[G[x][i]];
                if (!vis[e.to] && e.cap > e.flow) {
                    vis[e.to] = 1;
                    d[e.to] = d[x] + 1;
                    Q.push(e.to);
                }
            }
        }
        return vis[t];
    }

    int DFS(int x, int a) {
        if (x == t || a == 0) return a;
        int flow = 0, f;
        for (int &i = cur[x]; i < G[x].size(); i++) {
            Edge &e = edges[G[x][i]];
            if (d[x] + 1 == d[e.to] && (f = DFS(e.to, min(a, e.cap - e.flow))) > 0) {
                e.flow += f;
                edges[G[x][i] ^ 1].flow -= f;
                flow += f;
                a -= f;
                if (a == 0) break;
            }
        }
        return flow;
    }

    int Maxflow(int s, int t) {
        this->s = s;
        this->t = t;
        int flow = 0;
        while (BFS()) {
            memset(cur, 0, sizeof(cur));
            flow += DFS(s, inf);
        }
        return flow;
    }

    vector<int> Mincut() { // call this after maxflow
        vector<int> ans;
        for (int i = 0; i < edges.size(); i++) {
            Edge &e = edges[i];
            if (vis[e.from] && !vis[e.to] && e.cap > 0) ans.push_back(i);
        }
        return ans;//返回一个vector，存储最小割集合
    }
} d;

```
