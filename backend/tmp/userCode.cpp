#include <iostream>

using namespace std;

bool ehPrimo(int num) {
    if (num < 2) return false;
    for (int i = 2; i * i <= num; i++) {
        if (num % i == 0) return false;
    }
    return true;
}

int main() {
    int n, in;
    cin >> n;

    while (n--) {
        cin >> in;
        if (ehPrimo(in))
            cout << "PRIMO" << endl;
        else
            cout << "NAO PRIMO" << endl;
    }

    return 0;
}
