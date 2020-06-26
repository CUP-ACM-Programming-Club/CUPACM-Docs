---
title: E.Gugugu's upgrade schemes 
---
# E.Gugugu's upgrade schemes 
## 题意
计算贝尔数(**Bell number**),对结果取$mod$
## 思路
本题是原题: [BZOJ 3501(CUPOJ 4415)](https://oj.cupacm.com/problem/submit/4415)
用贝尔三角预处理贝尔数,对于$B_{n}, n \geq mod$的情况，有
$$
B_{p+n} \equiv B_n+B_{n+1}(\bmod p)
$$
$$
B_{p^m+n} \equiv mB_n+B_{n+1}(\bmod p)
$$
## 代码
```cpp
#include <iostream>

using namespace std;
using ll = long long;
const int maxn = 1001;
int mod;

int f[maxn], s[maxn][maxn];

int cal(ll n) {
    int m = 0, b[maxn], c[maxn], d[70];
    for (int i = 0; i <= mod; ++i) {
        b[i] = f[i] % mod;
    }
    while (n) {
        d[m++] = n % mod;
        n /= mod;
    }
    for (int i = 1; i < m; ++i)
        for (int j = 1; j <= d[i]; ++j) {
            for (int k = 0; k < mod; ++k) {
                c[k] = (b[k] * i + b[k + 1]) % mod;
            }
            c[mod] = (c[0] + c[1]) % mod;
            for (int k = 0; k <= mod; ++k) {
                b[k] = c[k];
            }
        }
    return c[d[0]];
}

ll bell(ll n) {
    if (n < maxn)return f[n];
    return (cal(n) + mod) % mod;
}

void init() {
    f[0] = f[1] = s[0][0] = s[1][0] = 1, s[1][1] = 2;
    for (int i = 2; i < maxn; i++) {
        int j;
        for (f[i] = s[i][0] = s[i - 1][i - 1], j = 1; j <= i; j++) {
            s[i][j] = (s[i - 1][j - 1] + s[i][j - 1]) % mod;
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    int T;
    cin >> T;
    while (T--) {
        ll n;
        cin >> n >> mod;
        init();
        cout << bell(n) << '\n';
    }
}
```
