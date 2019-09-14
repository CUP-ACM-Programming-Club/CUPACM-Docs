---
title: F. Honk's pool
---
# F.  Honk's pool
## 题意
给定若干水池，每个水池有水$a_{i}$升，每天按照下列顺序完成操作
1. 从水最多的水池取一升水
2. 往水最少的水池倒一升水
3. 回家睡觉(到下一天)

问$k$天以后最多水的水池与最少水的水池的差。
## 思路
排序，根据水池的水量离散化，维护一个有序$pair$数组，每个数组元素存$\{\text{水池水量},\text{该水量的水池数目}\}$

计算出$k$天以后下界，用同样的方法计算上界，计算得结果。

要考虑到当$k$天不到水量已经到达平均值的情况，在中间做好边界判断。

同时注意平均值可能不足以让所有水池都到达平均值，因此若所有水池都无法进行进一步操作时，水量差值可能为1。
根据余数可以判断这种情况。
## 代码
```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <vector>
#include <iomanip>
#include <queue>
using namespace std;
using ll = long long;

const int maxn = 5e5 + 10;
int arr[maxn];
pair<int, int> pir[maxn];
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    int n, k;
    while(cin >> n >> k) {
        ll sum = 0;
        for (int i = 1; i <= n; ++i) {
            cin >> arr[i];
            sum += arr[i];
        }
        if (n == 1) {
            cout << 0 << '\n';
            return 0;
        }
        ll average = sum / n;
        sort(arr + 1, arr + 1 + n);
        int prev = -1, pos = 0;
        for (int i = 1; i <= n; ++i) {
            if (arr[i] != prev) {
                prev = arr[i];
                pir[++pos] = {arr[i], 1};
            } else {
                ++pir[pos].second;
            }
        }

        ll cur = 0;
        int apos = 1;
        bool finish = false;
        for (int i = 1; i <= pos; ++i) {
            if (pir[i].first >= average) {
                cout << (sum % n ? 1 : 0) << '\n';
                finish = true;
                break;
            }
            apos = i;
            ll increment = (ll)pir[i].second * (ll)abs(pir[i].first - min(pir[i + 1].first, (int) average));
            if (cur + increment > k) {
                break;
            }
            cur += increment;
            pir[i + 1].second += pir[i].second;
        }
        if (finish) continue;
        int lower = pir[apos].first + ((k - cur) / pir[apos].second);
        int bpos = pos;
        cur = 0;
        for(int i = pos; i; --i) {
            bpos = i;
            ll decrement = (ll)pir[i].second * (ll)abs(pir[i].first - pir[i - 1].first);
            if (cur + decrement > k) {
                break;
            }
            cur += decrement;
            pir[i - 1].second += pir[i].second;
        }
        int upper = pir[bpos].first - ((k - cur) / pir[bpos].second);
        cout << upper - lower << '\n';
    }
}
```
