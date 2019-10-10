---
title: SPFA最短路&&判断正负环
---

# SPFA最短路(扩展判断正负环)

## 说明

::: warning

在没有负环、单纯求最短路径，不建议使用SPFA算法，而是用Dijkstra算法。在有负环的情况下，可以考虑SPFA算法。

:::

## 使用

```cpp
//配合建图模板
struct edge
{
    int from,to,w,next;//from 代表从哪里开始，to是到哪里去 w代表权值
}Node[MAXN];
int head[MAXN];
int vis[MAXN];//判断vis[i]是否在队列中
int dist[MAXN];//dist[i]代表点给定的点S到点i的最短距离
int n,m,t;
void add(int i,int j,int w)//i为第一个点，j为第二个点，w为其权值。注意当为无向图的时候要建立两条边
{
    Node[t].from=i;
    Node[t].to=j;
    Node[t].w=w;
    Node[t].next=head[i];
    head[i]=t++;
}
```

## Tips

注意数组开的大小

## 代码

```cpp
void spfa(int s)
{
    queue <int> q;
    for(int i=1;i<=n;i++)
    dist[i]=inf;
    memset(vis,false,sizeof(vis));
    q.push(s);
    dist[s]=0;
    while(!q.empty())
    {
        int u=q.front();
        q.pop();
        vis[u]=false;
        for(int i=head[u];i!=-1;i=Node[i].next)
        {
            int v=Node[i].to;
            if(dist[v]>dist[u]+Node[i].w)
            {
                dist[v]=dist[u]+Node[i].w;
                if(!vis[v])
                {
                    vis[v]=true;
                    q.push(v);
                }
            }
        }
    }
}
/*int main()
{
    int a,b,c,s,e;
    scanf("%d%d",&n,&m);
    t=0;
    memset(head,-1,sizeof(head));
    while(m--)
    {
        scanf("%d%d%d",&a,&b,&c);
        add(a,b,c);//加入边a,b
    }
    scanf("%d%d",&s,&e);从s跑到e
    spfa(s);//跑一边spfa
    if(dist[e]==inf) printf("-1\n");
    else printf("%d\n",dist[e]);//输出距离
    return 0;
}*/
```

## 扩展

#### [P3385 【模板】负环](https://www.luogu.org/problem/P3385)

判断是否有负环(从源点1开始)

#### 代码

```cpp
/*
struct edge
{
	int from,to,w,next;//同上
}Node[MAXN];
int n,m,s,cnt,x,y,z,c[MAXN];
int dist[MAXN],vis[MAXN],head[MAXN];
*/
int spfa()
{
	queue<int> q;
	for(int i=1;i<=n;i++)
	dis[i]=INF;
	dis[1]=0;
	memset(vis,0,sizeof(vis));
	memset(c,0,sizeof(c)); 
	q.push(1);//入队 这一个可有可无，因为他是从源点1入队的，如果从任一一个顶点，修改int spfa(int s)
              //q.push(s){s代表一个其中一个顶点顶点}
	vis[1]=1;//初始化 
	while(!q.empty())
	{
		int u=q.front();
		q.pop();//出队 
		vis[u]=0;//出队标记 
		for(int i=head[u];i!=-1;i=Node[i].next)//所有u能走的路 
		{
			int v=Node[i].to;
			if(dis[v]>dis[u]+Node[i].w)
			{
				dis[v]=dis[u]+Node[i].w;//取最小的 
				c[v]++;//更新 
				if(c[v]>n) return 0;//出现超过n次表示就有负环 
				if(vis[v]==0)//如果这个点没在队列里就标记入队 
				{
					vis[v]=1;
					q.push(v);
				}
			}
		} 
	}
	return 1;
}
/*int main()
{
	int t;
	cin>>t;
	while(t--)
	{
		cin>>n>>m;
		memset(head,-1,sizeof(head));
		for(int i=1;i<=m;i++)
		{
			cin>>x>>y>>z;
			add(x,y,z);//同上
			if(z>=0)//题目中 若w<0则为单向，否则双向 若是双向添加双向边，其他同上
			add(y,x,z);
		}
		if(spfa()==0) cout<<"YE5"<<endl;
		else cout<<"N0"<<endl;	
	}
	return 0;
}*/
```

