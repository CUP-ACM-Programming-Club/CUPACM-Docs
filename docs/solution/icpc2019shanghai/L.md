---
title: L. Digit sum
---
# L. Digit sum
## 题意
求$b$进制下$\displaystyle\sum_{i=1}^{n}S(i), S(i) = digitSum(i)$
$b < 10, n < 1000000$
## 思路
$b$进制下有
$$
\begin{aligned}
S(0) &= 0 \\
S(b * n + k) &= S(n) + k (k < b, n \geq 0)
\end{aligned}
$$

考虑预处理，对于每个询问查询时间$O(1)$。
预处理时间约为$O(n * b)$

## 代码
```cpp
#include <iostream>
#include <algorithm>
using namespace std;
const int maxn = 1e6 + 10;
using ll = long long;
ll arr[11][maxn];

int main()
{
    for(int i = 2; i <= 10; ++i) {
        for(int j = 0; i * j + i < maxn; ++j) {
            for(int k = 0; k < i; ++k) {
                arr[i][i * j + k] = arr[i][j] + k;
            }
        }
    }
    for(int i = 2; i <= 10; ++i) {
        for(int j = 1; j < maxn; ++j) {
            arr[i][j] += arr[i][j - 1];
        }
    }
    int T;
    int kase = 0;
    cin >> T;
    while(T--) {
        int n, b;
        cin >> n >> b;
        cout << "Case #" << (++kase) << ": ";
        cout << arr[b][n] << '\n';
    }
}
```
