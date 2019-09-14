---
title: H.Texas hold'em Poker 
---
# H.Texas hold'em Poker
## 题意
若干人打德州扑克(~~并不是~~),根据给定的规则比较谁更大，若根据规则两人大小相等则比较姓名字典序大小。
牌面一共有8种，此处不复述题目内容
## 思路
大模拟题，细节很多。**注意多组样例**
重载`<`，建立比较函数，预处理牌面类型即可。
## 代码
```cpp
#include <iostream>
#include <algorithm>
#include <cstring>
#include <vector>
#include <set>
#include <numeric>

using namespace std;

enum {
    STRAIGHT = 49,
    ROYAL_STRAIGHT = 50,
    FOUR = 48,
    THREE_TWO = 47,
    TWO_PAIR = 44,
    PAIR = 43,
    THREE = 45,
    HIGHEST = 42
};

vector<int> convert(string& s) {
    vector<int> vec;
    int sz = s.length();
    for(int i = 0; i < sz; ++i) {
        if (s[i] == '1') {
            ++i;
            vec.push_back(10);
            continue;
        }
        switch(s[i]) {
            case 'J':
                vec.push_back(11);
                break;
            case 'Q':
                vec.push_back(12);
                break;
            case 'K':
                vec.push_back(13);
                break;
            case 'A':
                vec.push_back(1);
                break;
            default:
                vec.push_back(s[i] - '0');
        }
    }
    return vec;
}

struct Node {
    string name;
    string _card;
    vector<int>card;
    int Four;
    int FourRemain;
    int Three;
    int ThreeRemain;

    pair<int, int>ThreeTwo;
    pair<int, int> TwoPair;
    int TwoPairRemain;
    int PPair;
    int PPairSum;
    int highest;
    int type = -1;
    Node(){}
    Node(string& name, string& card){
        this->_card = card;
        this->name = name;
    }
    bool operator < (const Node& v) const {
        int val = type;
        int target_val = v.type;
        if (val != target_val) {
            return val > target_val;
        }
        if (type == ROYAL_STRAIGHT) {
            return name < v.name;
        }
        if (type == STRAIGHT) {
            if (card != v.card) {
                return card > v.card;
            }
            return name < v.name;
        }
        if (type == FOUR) {
            if (Four != v.Four) {
                return Four > v.Four;
            }
            if (FourRemain == v.FourRemain) {
                return name < v.name;
            }
            else {
                return FourRemain > v.FourRemain;
            }
        }
        if (type == THREE_TWO) {
            if (ThreeTwo != v.ThreeTwo) {
                return ThreeTwo > v.ThreeTwo;
            }
            return name < v.name;
        }
        if (type == THREE) {
            if (Three != v.Three) {
                return Three > v.Three;
            }
            if (ThreeRemain == v.ThreeRemain) {
                return name < v.name;
            }
            else {
                return ThreeRemain > v.ThreeRemain;
            }
        }
        if (type == TWO_PAIR) {
            if (TwoPair != v. TwoPair) {
                return TwoPair > v.TwoPair;
            }
            if (TwoPairRemain == v.TwoPairRemain) {
                return name < v.name;
            }
            else {
                return TwoPairRemain > v.TwoPairRemain;
            }
        }
        if (type == PAIR) {
            if (PPair != v.PPair) {
                return PPair > v.PPair;
            }
            if (PPairSum == v.PPairSum) {
                return name < v.name;
            }
            else {
                return PPairSum > v.PPairSum;
            }
        }
        if (highest != v.highest) {
            return highest > v.highest;
        }
        return name < v.name;
    }

    int cal(Node node) const {
        if (type == -1) return node.cal();
        return type;
    }

    void init() {
        type = cal();
    }

    int cal() {
        if (royalStraight()) {
            return ROYAL_STRAIGHT;
        }
        if (straight()) {
            return STRAIGHT;
        }
        if (four()) {
            return FOUR;
        }
        if (threeTwo()) {
            return THREE_TWO;
        }
        if (three()) {
            return THREE;
        }
        if (two_pair()) {
            return TWO_PAIR;
        }
        if (one_pair()) {
            return PAIR;
        }
        highestCard();
        return HIGHEST;
    }

    bool royalStraight() {
        genCard();
        if (_card.find("10") != _card.npos && _card.find("J") != _card.npos && _card.find("Q") != _card.npos && _card.find("K") != _card.npos && _card.find("A") != _card.npos) {
            return true;
        }
        return false;
    }

    void genCard() {
        if (card.size() == 0) {
            card = convert(_card);
            sort(card.begin(), card.end());
        }
    }

    bool straight() {
        genCard();
        vector<int>&array = card;
        for(int i = 0; i < array.size() - 1; ++i) {
            if (array[i] + 1 != array[i + 1]) {
                return false;
            }
        }
        return true;
    }

    bool highestCard() {
        genCard();
        highest = accumulate(card.begin(), card.end(), 0);
        return true;
    }

    bool one_pair() {
        genCard();
        vector<int>&array = card;
        vector<std::pair<int, int> >vec;
        for(int & i : card) {
            if (vec.empty()) {
                vec.push_back({i, 1});
                continue;
            }
            if (i == (*vec.rbegin()).first) {
                ++(*vec.rbegin()).second;
            }
            else {
                vec.push_back({i, 1});
            }
        }
        bool ok = false;
        for(auto & i : vec) {
            if (i.second == 2) {
                PPair = i.first;
                ok = true;
            }
            else {
                PPairSum += i.first;
            }
        }
        return ok;
    }

    bool two_pair() {
        genCard();
        vector<int>&array = card;
        vector<std::pair<int, int> >vec;
        for(int & i : card) {
            if (vec.empty()) {
                vec.push_back({i, 1});
                continue;
            }
            if (i == (*vec.rbegin()).first) {
                ++(*vec.rbegin()).second;
            }
            else {
                vec.push_back({i, 1});
            }
        }
        vector<int>num;
        int cnt = 0;
        for(int i = 0; i < vec.size(); ++i) {
            if (vec[i].second == 2) {
                ++cnt;
                num.push_back(vec[i].first);
            }
            else {
                TwoPairRemain = vec[i].first;
            }
        }
        if(cnt == 2) {
            TwoPair = {max(num[0], num[1]), min(num[0], num[1])};
            return true;
        }
        return false;
    }

    bool three() {
        genCard();
        vector<int>&array = card;
        int element = array[0];
        int times = 1;
        for(int i = 1; i < array.size(); ++i) {
            if (array[i] == element) {
                ++times;
                if (times >= 3) {
                    break;
                }
            }
            else {
                element = array[i];
                times = 1;
            }
        }
        if (times >= 3) {
            Three = element;
            ThreeRemain = 0;
            for(int i = 0; i < array.size(); ++i) {
                if (array[i] != element) {
                    ThreeRemain += array[i];
                }
            }
        }
        return times >= 3;
    }

    bool threeTwo() {
        genCard();
        set<int>s;
        for(int i : card) {
            s.insert(i);
        }
        if (s.size() == 2) {
            vector<int> ele(s.begin(), s.end());
            int cnt = 0;
            for(int i : card) {
                if (i == ele[0]) ++cnt;
            }
            if (cnt == 3) {
                ThreeTwo = {ele[0], ele[1]};
            }
            else {
                ThreeTwo = {ele[1], ele[0]};
            }
            return true;
        }
        return false;
    }

    bool four() {
        genCard();
        vector<int>&array = card;
        int element = array[0];
        int times = 1;
        for(int i = 1; i < array.size(); ++i) {
            if (array[i] == element) {
                ++times;
                if (times >= 4) {
                    break;
                }
            }
            else {
                element = array[i];
                times = 1;
            }
        }
        if (times >= 4) {
            Four = element;
            for(int i = 0 ; i < array.size(); ++i) {
                if (array[i] != element) {
                    FourRemain = array[i];
                    break;
                }
            }
        }
        return times >= 4;
    }
};
const int maxn = 1e5 + 10;
Node node[maxn];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);
    int n;
    while(cin >> n) {
        string name, card;
        for (int i = 0; i < n; ++i) {
            cin >> name >> card;
            node[i] = Node(name, card);
            node[i].init();
        }
        sort(node, node + n);
        for (int i = 0; i < n; ++i) {
            cout << node[i].name << '\n';
        }
    }
}
```
