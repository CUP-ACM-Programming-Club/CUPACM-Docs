---
title: 米勒拉宾素性测试
---

# 米勒拉宾素性测试

## 说明
 快速进行大素数验证。

## 使用
| 功能 | 函数 | 样例调用 | 样例返回 |
|:---|:---|:---|:---|
|素性测试| `bool Miller_Rabin(LL n)`| `Miller_Rabin(29)` | true |
|分解素因数| `void findfac(LL n)` | `findfac(10)` | factor数组:`[2,5]` |

## Tips
 - 唯一可调外部参数: `const int S=20;`为米勒拉宾算法验证次数，失误率为: $\frac{1}{2^S}$

## 代码
```cpp
#include <iostream>
#include <string>
#include <cstdio>
#include <cmath>
#include <cstring>
#include <algorithm>
#define range(i,a,b) for(int i=a;i<=b;++i)
#define rerange(i,a,b) for(int i=a;i>=b;--i)
#define LL long long
#define fill(arr,tmp) memset(arr,tmp,sizeof(arr))
using namespace std;
const int S=20;
LL mult_mod(LL a,LL b,LL c){
	a%=c;
	b%=c;
	long long ret=0;
	while(b){
		if(b&1){ret+=a;ret%=c;}
		a<<=1;
		if(a>=c)a%=c;
		b>>=1;
	}
	return ret;
}
LL pow_mod(LL x,LL n,LL mod){
	if(n==1)return x%mod;
	x%=mod;
	LL tmp=x;
	LL ret=1;
	while(n){
		if(n&1) ret=mult_mod(ret,tmp,mod);
		tmp=mult_mod(tmp,tmp,mod);
		n>>=1;
	}
	return ret;
}
bool check(LL a,LL n,LL x,LL t){
	LL ret=pow_mod(a,x,n);
	LL last=ret;
	range(i,1,t){
		ret=mult_mod(ret,ret,n);
		if(ret==1&&last!=1&&last!=n-1) return true;
		last=ret;
	}
	if(ret!=1) return true;
	return false;
}
bool Miller_Rabin(LL n){
	if(n<2)return false;
	if(n==2)return true;
	if((n&1)==0) return false;
	LL x=n-1;
	LL t=0;
	while((x&1)==0){x>>=1;t++;}
	range(i,0,S-1){
		LL a=rand()%(n-1)+1;
		if(check(a,n,x,t))return false;
	}
	return true;
}
LL factor[100];
int tol;
LL gcd(LL a,LL b){
	if(a==0)return 1;
	if(a<0) return gcd(-a,b);
	while(b){
		long long t=a%b;
		a=b;
		b=t;
	}
	return a;
}
LL Pollard_rho(LL x,LL c){
	LL i=1,k=2;
	LL x0=rand()%x;
	LL y=x0;
	while(1){
		i++;
		x0=(mult_mod(x0,x0,x)+c)%x;
		LL d=gcd(y-x0,x);
		if(d!=1&&d!=x) return d;
		if(y==x0) return x;
		if(i==k){y=x0;k+=k;}
	}
}
void findfac(LL n){
	if(Miller_Rabin(n)){
		factor[tol++]=n;
		return;
	}
	LL p=n;
	while(p>=n)p=Pollard_rho(p,rand()%(n-1)+1);
	findfac(p);
	findfac(n/p);
}
int main(){
	long long n;
	while(scanf("%lld",&n)!=EOF){
		tol=0;
		/*
		findfac(n);
		for(int i=0;i<tol;++i)cout<<factor[i]<<" ";
		printf("\n");
		*/
		if(Miller_Rabin(n))printf("Yes\n");
		else printf("No\n");
	}
	return 0;
}
```
