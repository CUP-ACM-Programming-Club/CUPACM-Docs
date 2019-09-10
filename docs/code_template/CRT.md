---
title: 中国剩余定理
---

# 中国剩余定理（扩展）

## 说明

求解同余方程组

$$x \equiv a_1 \; (\text{mod}\;m_1) \\x \equiv a_2 \; (\text{mod}\;m_2) \\\dots \\x \equiv a_k \; (\text{mod}\;m_k)$$

求x的最小非负整数解

[P4777 【模板】扩展中国剩余定理（EXCRT）](https://www.luogu.org/problem/P4777)

接下来 *n* 行，每行两个非负整数$a_{i}, b_{i}$

## 使用

输入$N$个$a$,$N$个$m$

## Tips

**请注意程序运行过程中进行乘法运算时结果可能有溢出的风险。**

## 代码

```cpp
ll mymul(ll a,ll b,ll mod){
    ll sum=0;
    while(b){
        if(b&1) sum=(sum+a)%mod;
        a=(a+a)%mod;
        b>>=1;
    }
    return sum;
}
ll exgcd(ll a,ll b,ll &x,ll &y){
    if(b==0){
        x=1,y=0;
        return a;
    }
    ll gcd=exgcd(b,a%b,y,x);
    y-=(a/b)*x;
    return gcd;
}
ll fun(){
    ll x,y;
    ll M=m[1],ans=(a[1]%M+M)%M;
    for(int i=2;i<=n;i++){
        ll gcd=exgcd(M,m[i],x,y);
        ll c=((a[i]-ans)%m[i]+m[i])%m[i];
        if(c%gcd) return -1;  //无解 
        x=mymul(x,c/gcd,m[i]/gcd);
        ans+=x*M;
        M*=m[i]/gcd;
        ans=(ans%M+M)%M;
    }
    return ans;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    scanf("%d",&n);
    for(int i=1;i<=n;i++)
        scanf("%lld%lld",&m[i],&a[i]);//m[i]代表ai,a[i]代表bi
    printf("%lld\n",fun());
} 
```
