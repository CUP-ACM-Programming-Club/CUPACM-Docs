---
title: B. Light bulbs
---
# B. Light bulbs

## 题意
把$[0, n - 1)$的灯泡，初始关闭，每次操作一个区间，将其状态反转，问最后打开多少灯泡
$n <= 1000000, m <= 1000, T <= 1000$
## 思路
::: warning
$n < 1000000 && T <= 1000$,说明你不能用$O(n)$的算法，只能用$O(mlog(m))$的算法
:::
区间排序求前缀和，实现过程多样。
## 代码
```cpp
#include <iostream>
#include <map>

using namespace std;
map<int, int> mp;
int n, k;
void init() {
    mp.clear();
    cin >> n >> k;
    for(int i = 0; i < k; ++i) {
        int l, r;
        cin >> l >> r;
        ++mp[l + 1];
        --mp[r + 2];
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    int T;
    cin >> T;
    int kase = 0;
    while(T--) {
        init();
        int cur = 0, tot = 0;
        mp[0] = mp[n + 1] = 0;
        map<int, int>::iterator iter = mp.begin(), prev = mp.begin();
        ++iter;
        while(iter != mp.end()) {
            if (cur % 2)  {
                tot += iter->first - prev->first;
            }
            cur += iter->second;
            prev = iter;
            ++iter;
        }
        cout << "Case #" << (++kase) << ": " << tot << '\n';
    }
}
```
