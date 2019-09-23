---
title: Dijkstra
---

# Dijkstra(堆优化)

## 说明

::: warning

写程序时一定要初始化建图。且假定图是不带负权的有向图或无向图。

:::

[题目：](https://www.luogu.org/problem/P4779)给定一个 *N*个点，*M*条有向边的带非负权图，请你计算从 *S* 出发，到每个点的距离。

数据保证你能从 *S* 出发到任意点。


## 使用

```cpp
//配合建图模板
struct edge
{
    int to, dis, next; //to去哪里,dis权值。
}Node[MAXN];
int head[MAXN];
int vis[MAXN];
int dis[MAXN];//dis[i]代表点给定的点S到点i的最短距离
int n, m, s,cnt=0;
void add_edge( int u, int v, int d )
{
    cnt++;
    Node[cnt].dis = d;
    Node[cnt].to = v;
    Node[cnt].next = head[u];
    head[u] = cnt;
}
struct node//建堆
{
    int dis;
    int pos;
    bool operator <( const node &x )const
    {
        return x.dis < dis;
    }
};
priority_queue<node> q;
```

## Tips

注意数组开的大小

## 代码

```cpp
void dijkstra()
{
    dis[s] = 0;
    q.push( ( node ){0, s} );//题目中是S点，如果存在多点，更改函数int dijkstra(int s),此处不变
    while( !q.empty() )
    {
        node tmp = q.top();
        q.pop();
        int x = tmp.pos, d = tmp.dis;
        if( vis[x] )
            continue;
        vis[x] = 1;
        for( int i = head[x]; i; i = Node[i].next )
        {
            int y = Node[i].to;
            if( dis[y] > dis[x] + Node[i].dis )
            {
                dis[y] = dis[x] + Node[i].dis;
                if( !vis[y] )
                {
                    q.push( ( node ){dis[y], y} );
                }
            }
        }
    }
}
/*int main()
{
    start;//参照#define start ios::sync_with_stdio(false),cin.tie(0),cout.tie(0)
    scanf( "%d%d%d", &n, &m, &s );
    for(int i = 1; i <= n; ++i)dis[i] = 0x7fffffff;//初始化
    for(int i = 0; i < m; ++i )
    {
        int u, v, d;
        scanf("%d%d%d", &u, &v, &d );
        add_edge( u, v, d );//题目中是建立单向边
    }
    dijkstra();//跑一边
    for( int i = 1; i <= n; i++ )
        printf( "%d ", dis[i] );//从s点出发到各个顶点的距离
    cout<<endl;
    return 0;
}
*/
```

