---
title: D. Counting Sequences I
---
# D. Counting Sequences I
## 题意
统计有多少个序列满足和等于积

即$\displaystyle\sum a_i = \displaystyle\prod a_i$

## 思路
dfs + 剪枝，**和OEIS上的某个数列没有关系，仅仅为前9个结果巧合相同**

## 代码
```cpp
#include <iostream>
#include <cmath>
#include <cstring>
#include <vector>
#include <queue>
#include <algorithm>
#define ll long long
using namespace std;

const ll MOD = 1e9 + 7;
const int maxn = 310 * 500;

ll dp[maxn];
ll a[310];
ll ans, sum, _max;

bool cmp(const ll& x, const ll& y)
{
    return x > y;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    int T, n;
    cin >> T;
    while (T--)
    {
        cin >> n;
        memset(dp, 0, sizeof(dp));
        ans = sum = _max = 0;
        for (int i = 1; i <= n; i++)
        {
            cin >> a[i];
            sum += a[i];
        }
        sort(a + 1, a + n + 1, cmp);
        dp[0] = 1;
        for (int i = 1; i <= n; i++)
        {
            _max += a[i];
            for (int j = min(_max, sum / 2 + 1000); j >= a[i]; j--)
            {
                if (dp[j - a[i]] > 0)
                {
                    dp[j] += dp[j - a[i]];
                    dp[j] %= MOD;
                    if (j - a[i] <= sum - j &&
                        j >= sum - j)
                    {
                        ans += dp[j - a[i]];
                        ans %= MOD;
                    }
                }
            }
        }
        cout << ans << '\n';
    }
}
```
