---
title: 增强版输入输出挂
---

# 增强版输入输出挂

## 说明

原文链接:[输入输出挂备份](https://www.haoyuan.info/?p=381)
在输入挂的基础上做了平滑使用的封装

## 使用
如同`cin`,`cout`一样平滑输入输出
```cpp
int a;
long long b;
char c;
string d;
char str[100];
fin >> a >> b >> c >> d >> str << a << b << c << d << str;(wwww)
```

## Tips
::: warn
若不存在宏定义`ONLINE_JUDGE`,输入输入将使用`cin`
:::
## 代码
```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <list>
#include <cmath>
#include <algorithm>
#include <vector>
#include <map>
#include <queue>
#include <stack>
#include <set>
#include <complex>
using ll = long long;
/*
 * 输入挂
 * 场场AK buff
 */
namespace IO {
    using namespace std;
    class endln {
    };

    class iofstream {
    private:
        int idx;
        bool eof;
        char buf[100005], *ps, *pe;
        char bufout[100005], outtmp[50], *pout, *pend;

        inline void rnext() {
            if (++ps == pe)
                pe = (ps = buf) + fread(buf, sizeof(char), sizeof(buf) / sizeof(char), stdin), eof = true;
            //eof = ps != pe;
        }

        inline void write() {
            fwrite(bufout, sizeof(char), pout - bufout, stdout);
            pout = bufout;
        }

    public:
        iofstream() : idx(-1), eof(true) {
            pe = (ps = buf) + 1;
            pend = (pout = bufout) + 100005;
        }

        ~iofstream() {
            write();
        }

        template<class T>
        inline bool fin(T &ans) {
#ifdef ONLINE_JUDGE
            ans = 0;
            T f = 1;
            if (ps == pe) {
                return eof = false;
            }
            do {
                rnext();
                if ('-' == *ps) f = -1;
            } while (!isdigit(*ps) && ps != pe);
            if (ps == pe) {
                return eof = false;
            }
            do {
                ans = (ans << 1) + (ans << 3) + *ps - 48;
                rnext();
            } while (isdigit(*ps) && ps != pe);
            ans *= f;
#else
            cin >> ans;
#endif
            return true;
        }

        template<class T>
        inline bool fdb(T &ans) {
#ifdef ONLINE_JUDGE
            ans = 0;
            T f = 1;
            if (ps == pe) return false;//EOF
            do {
                rnext();
                if ('-' == *ps) f = -1;
            } while (!isdigit(*ps) && ps != pe);
            if (ps == pe) return false;//EOF
            do {
                ans = ans * 10 + *ps - 48;
                rnext();
            } while (isdigit(*ps) && ps != pe);
            ans *= f;
            if (*ps == '.') {
                rnext();
                T small = 0;
                do {
                    small = small * 10 + *ps - 48;
                    rnext();
                } while (isdigit(*ps) && ps != pe);
                while (small >= 1) {
                    small /= 10;
                }
                ans += small;
            }
#else
            cin >> ans;
#endif
            return true;
        }

/*
 * 输出挂
 * 超强 超快
 */

        inline bool out_char(const char c) {
#ifdef ONLINE_JUDGE
            *(pout++) = c;
            if (pout == pend) write();
#else
            cout << c;
#endif
            return true;
        }

        inline bool out_str(const char *s) {
#ifdef ONLINE_JUDGE
            while (*s) {
                *(pout++) = *(s++);
                if (pout == pend) write();
            }
#else
            cout << s;
#endif
            return true;
        }

        template<class T>
        inline bool out_double(T x, int idx) {
            char str[50];
            string format = "%";
            if (~idx) {
                format += '.';
                format += (char) (idx + '0');
            }
            format += "f";
            sprintf(str, format.c_str(), x);
            out_str(str);
            return true;
        }

        template<class T>
        inline bool out_int(T x) {
#ifdef ONLINE_JUDGE
            if (!x) {
                out_char('0');
                return true;
            }
            if (x < 0) x = -x, out_char('-');
            int len = 0;
            while (x) {
                outtmp[len++] = x % 10 + 48;
                x /= 10;
            }
            outtmp[len] = 0;
            for (int i = 0, j = len - 1; i < j; ++i, --j) swap(outtmp[i], outtmp[j]);
            out_str(outtmp);
#else
            cout << x;
#endif
            return true;
        }


        inline iofstream &operator<<(const double &x) {
            out_double(x, idx);
            return *this;
        }

        inline iofstream &operator<<(const int &x) {
            out_int(x);
            return *this;
        }

        inline iofstream &operator<<(const unsigned long long &x) {
            out_int(x);
            return *this;
        }

        inline iofstream &operator<<(const unsigned &x) {
            out_int(x);
            return *this;
        }

        inline iofstream &operator<<(const long &x) {
            out_int(x);
            return *this;
        }

        inline iofstream &operator<<(const ll &x) {
            out_int(x);
            return *this;
        }

        inline iofstream &operator<<(const endln &x) {
            out_char('\n');
            return *this;
        }


        inline iofstream &operator<<(const char *x) {
            out_str(x);
            return *this;
        }

        inline iofstream &operator<<(const string &x) {
            out_str(x.c_str());
            return *this;
        }

        inline iofstream &operator<<(const char &x) {
            out_char(x);
            return *this;
        }

        inline bool setw(int x) {
            if (x >= 0) {
                idx = x;
                return true;
            }
            return false;
        }

        inline iofstream &operator>>(int &x) {
            if (!fin(x) && !x)eof = false;
            return *this;
        }

        inline iofstream &operator>>(ll &x) {
            if (!fin(x) && !x)eof = false;
            return *this;
        }

        inline iofstream &operator>>(double &x) {
            if (!fdb(x) && x == 0.0)eof = false;
            return *this;
        }

        inline iofstream &operator>>(float &x) {
            if (!fdb(x) && x == 0.0)eof = false;
            return *this;
        }

        inline iofstream &operator>>(unsigned &x) {
            if (!fin(x) && !x)eof = false;
            return *this;
        }

        inline iofstream &operator>>(unsigned long long &x) {
            if (!fin(x) && !x)eof = false;
            return *this;
        }

        inline explicit operator bool() {
            return eof;
        }

        inline char getchar() {
#ifdef ONLINE_JUDGE
            if (ps == pe) {
                return eof = false;
            }
            rnext();
            if (ps + 1 == pe)
                eof = false;
            return *ps;
#else
            return std::getchar();
#endif
        }

        inline iofstream &operator>>(char *str) {
#ifdef ONLINE_JUDGE
            if (ps == pe) {
                eof = false;//EOF
                return *this;
            }
            do {
                rnext();
            } while (isspace(*ps) && iscntrl(*ps) && ps != pe);
            if (ps == pe) {
                eof = false;//EOF
                return *this;
            }
            do {
                *str = *ps;
                ++str;
                rnext();
            } while (!(isspace(*ps) || iscntrl(*ps)) && ps != pe);
            *str = '\0';
            return *this;
#else
            cin >> str;
            return *this;
#endif
        }

        inline iofstream &operator>>(string &str) {
#ifdef ONLINE_JUDGE
            str.clear();
            if (ps == pe) {
                eof = false;//EOF
                return *this;
            }
            do {
                rnext();
            } while (isspace(*ps) && iscntrl(*ps) && ps != pe);
            if (ps == pe) {
                eof = false;//EOF
                return *this;
            }
            do {
                str += *ps;
                rnext();
            } while (!(isspace(*ps) || iscntrl(*ps)) && ps != pe);
            return *this;
#else
            cin >> str;
            return *this;
#endif
        }
    };

    static iofstream fin;
    static endln ln;
}
using IO::fin;
```
