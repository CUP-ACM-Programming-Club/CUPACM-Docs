---
title: J. Stone game
---
# J. Stone game

## 题意
> 待补充
## 思路
* 对所有石子从大到小排序，进行dp。
* 我们考虑取出的那一堆石子，f[i][j] 表示该堆石子里最小的石子为 i，总价值 为 j 的方案数，这个通过dp来算。
* 对于所有最小石子为 i 的方案，可以求出其左右边界，那么对应答案加上改 区间内的 f[i][l] ~ f[i][r]。其中 i 这一维可以略去。
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
