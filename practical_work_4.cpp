/*
 * პრაქტიკული სამუშაო 4
 * წრფივი სტრუქტურის ალგორითმებზე ამოცანების რეალიზება 
 * სტანდარტული ფუნქციების გამოყენებით
 */

#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;

// ============================================
// ფუნქცია 1: გამოთვალეთ a და b (ვარიანტი ა)
// ============================================
void exercise1a() {
    cout << "\n=== ვარჯანტი ა: გამოთვალეთ a და b ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // a = (x^2 + y^2) / (1 + z^2)
    double a = (pow(x, 2) + pow(y, 2)) / (1 + pow(z, 2));
    
    // b = x * (arctan(z) + exp(-(x+3)))
    double b = x * (atan(z) + exp(-(x + 3)));
    
    cout << fixed << setprecision(4);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
}

// ============================================
// ფუნქცია 2: გამოთვალეთ a და b (ვარიანტი ბ)
// ============================================
void exercise1b() {
    cout << "\n=== ვარიანტი ბ: გამოთვალეთ a და b ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // a = sin(x) + cos(y) / sqrt(z)
    double a = sin(x) + cos(y) / sqrt(z);
    
    // b = log(x) + pow(y, 2) - z
    double b = log(x) + pow(y, 2) - z;
    
    cout << fixed << setprecision(4);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
}

// ============================================
// ფუნქცია 3: გამოთვალეთ a და b (ვარიანტი გ)
// ============================================
void exercise1c() {
    cout << "\n=== ვარიანტი გ: გამოთვალეთ a და b ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // a = exp(x) * sin(y) + tan(z)
    double a = exp(x) * sin(y) + tan(z);
    
    // b = sqrt(x + y) / (1 + pow(z, 2))
    double b = sqrt(x + y) / (1 + pow(z, 2));
    
    cout << fixed << setprecision(4);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
}

// ============================================
// ფუნქცია 4: გამოთვალეთ a და b (ვარიანტი დ)
// ============================================
void exercise1d() {
    cout << "\n=== ვარიანტი დ: გამოთვალეთ a და b ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // a = pow(x, 3) + log10(y) - fabs(z)
    double a = pow(x, 3) + log10(y) - fabs(z);
    
    // b = (x + y) / (1 + sin(z))
    double b = (x + y) / (1 + sin(z));
    
    cout << fixed << setprecision(4);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
}

// ============================================
// ფუნქცია 5: გამოთვალეთ z (ვარიანტი ბ)
// ============================================
void exercise2b() {
    cout << "\n=== გამოთვალეთ z (ვარიანტი ბ) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // z = sqrt(x^2 + y^2) / (1 + exp(-x))
    double z = sqrt(pow(x, 2) + pow(y, 2)) / (1 + exp(-x));
    
    cout << fixed << setprecision(4);
    cout << "z = " << z << endl;
}

// ============================================
// ფუნქცია 6: გამოთვალეთ z (ვარიანტი გ)
// ============================================
void exercise2c() {
    cout << "\n=== გამოთვალეთ z (ვარიანტი გ) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // z = (sin(x) + cos(y)) / (1 + pow(x, 2))
    double z = (sin(x) + cos(y)) / (1 + pow(x, 2));
    
    cout << fixed << setprecision(4);
    cout << "z = " << z << endl;
}

// ============================================
// ფუნქცია 7: გამოთვალეთ z (ვარიანტი დ)
// ============================================
void exercise2d() {
    cout << "\n=== გამოთვალეთ z (ვარიანტი დ) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // z = log(x + y) + atan(x / y)
    double z = log(x + y) + atan(x / y);
    
    cout << fixed << setprecision(4);
    cout << "z = " << z << endl;
}

// ============================================
// ფუნქცია 8: გამოთვალეთ T (ვარიანტი ა)
// ============================================
void exercise3a() {
    cout << "\n=== გამოთვალეთ T (ვარიანტი ა) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // T = pow(z, 2) / (1 + sin(pow(z, 2))) - sqrt(x + 2)
    double T = pow(z, 2) / (1 + sin(pow(z, 2))) - sqrt(x + 2);
    
    cout << fixed << setprecision(4);
    cout << "T = " << T << endl;
}

// ============================================
// ფუნქცია 9: გამოთვალეთ T (ვარიანტი ბ)
// ============================================
void exercise3b() {
    cout << "\n=== გამოთვალეთ T (ვარიანტი ბ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // T = (exp(x) + log(y)) / (1 + pow(z, 3))
    double T = (exp(x) + log(y)) / (1 + pow(z, 3));
    
    cout << fixed << setprecision(4);
    cout << "T = " << T << endl;
}

// ============================================
// ფუნქცია 10: გამოთვალეთ T (ვარიანტი გ)
// ============================================
void exercise3c() {
    cout << "\n=== გამოთვალეთ T (ვარიანტი გ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // T = sqrt(x + y) * cos(z) / (1 + fabs(x - y))
    double T = sqrt(x + y) * cos(z) / (1 + fabs(x - y));
    
    cout << fixed << setprecision(4);
    cout << "T = " << T << endl;
}

// ============================================
// ფუნქცია 11: გამოთვალეთ y (ვარიანტი ა)
// ============================================
void exercise4a() {
    cout << "\n=== გამოთვალეთ y (ვარიანტი ა) ===" << endl;
    double x;
    cout << "შეიყვანეთ x: ";
    cin >> x;
    
    // y = sin(x) + pow(cos(x), 2) / (1 + exp(-x))
    double y = sin(x) + pow(cos(x), 2) / (1 + exp(-x));
    
    cout << fixed << setprecision(4);
    cout << "y = " << y << endl;
}

// ============================================
// ფუნქცია 12: გამოთვალეთ y (ვარიანტი ბ)
// ============================================
void exercise4b() {
    cout << "\n=== გამოთვალეთ y (ვარიანტი ბ) ===" << endl;
    double x;
    cout << "შეიყვანეთ x: ";
    cin >> x;
    
    // y = log(x + 1) + atan(x) - sqrt(x)
    double y = log(x + 1) + atan(x) - sqrt(x);
    
    cout << fixed << setprecision(4);
    cout << "y = " << y << endl;
}

// ============================================
// ფუნქცია 13: გამოთვალეთ y (ვარიანტი გ)
// ============================================
void exercise4c() {
    cout << "\n=== გამოთვალეთ y (ვარიანტი გ) ===" << endl;
    double x;
    cout << "შეიყვანეთ x: ";
    cin >> x;
    
    // y = exp(x) / (1 + pow(x, 2)) + fabs(x - 5)
    double y = exp(x) / (1 + pow(x, 2)) + fabs(x - 5);
    
    cout << fixed << setprecision(4);
    cout << "y = " << y << endl;
}

// ============================================
// ფუნქცია 14: გამოთვალეთ y (ვარიანტი დ)
// ============================================
void exercise4d() {
    cout << "\n=== გამოთვალეთ y (ვარიანტი დ) ===" << endl;
    double x;
    cout << "შეიყვანეთ x: ";
    cin >> x;
    
    // y = pow(x, 2) * sin(x) + cos(x) / log10(x + 1)
    double y = pow(x, 2) * sin(x) + cos(x) / log10(x + 1);
    
    cout << fixed << setprecision(4);
    cout << "y = " << y << endl;
}

// ============================================
// ფუნქცია 15: გამოთვალეთ S (ვარიანტი ა)
// ============================================
void exercise5a() {
    cout << "\n=== გამოთვალეთ S (ვარიანტი ა) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // S = (x + y + z) / (1 + pow(x, 2) + pow(y, 2))
    double S = (x + y + z) / (1 + pow(x, 2) + pow(y, 2));
    
    cout << fixed << setprecision(4);
    cout << "S = " << S << endl;
}

// ============================================
// ფუნქცია 16: გამოთვალეთ S (ვარიანტი ბ)
// ============================================
void exercise5b() {
    cout << "\n=== გამოთვალეთ S (ვარიანტი ბ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // S = sqrt(x * y) + exp(z) / (1 + sin(x + y))
    double S = sqrt(x * y) + exp(z) / (1 + sin(x + y));
    
    cout << fixed << setprecision(4);
    cout << "S = " << S << endl;
}

// ============================================
// ფუნქცია 17: გამოთვალეთ S (ვარიანტი გ)
// ============================================
void exercise5c() {
    cout << "\n=== გამოთვალეთ S (ვარიანტი გ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // S = log(x + y) + pow(z, 2) - atan(x / y)
    double S = log(x + y) + pow(z, 2) - atan(x / y);
    
    cout << fixed << setprecision(4);
    cout << "S = " << S << endl;
}

// ============================================
// ფუნქცია 18: გამოთვალეთ S (ვარიანტი დ)
// ============================================
void exercise5d() {
    cout << "\n=== გამოთვალეთ S (ვარიანტი დ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // S = (sin(x) + cos(y)) * exp(-z) / (1 + fabs(x - y))
    double S = (sin(x) + cos(y)) * exp(-z) / (1 + fabs(x - y));
    
    cout << fixed << setprecision(4);
    cout << "S = " << S << endl;
}

// ============================================
// ფუნქცია 19: გამოთვალეთ R (ვარიანტი ა)
// ============================================
void exercise6a() {
    cout << "\n=== გამოთვალეთ R (ვარიანტი ა) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // R = pow(x, 2) + pow(y, 2) / (1 + sqrt(x + y))
    double R = pow(x, 2) + pow(y, 2) / (1 + sqrt(x + y));
    
    cout << fixed << setprecision(4);
    cout << "R = " << R << endl;
}

// ============================================
// ფუნქცია 20: გამოთვალეთ R (ვარიანტი ბ)
// ============================================
void exercise6b() {
    cout << "\n=== გამოთვალეთ R (ვარიანტი ბ) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // R = exp(x) * sin(y) + log(x + y) / cos(x)
    double R = exp(x) * sin(y) + log(x + y) / cos(x);
    
    cout << fixed << setprecision(4);
    cout << "R = " << R << endl;
}

// ============================================
// ფუნქცია 21: გამოთვალეთ R (ვარიანტი გ)
// ============================================
void exercise6c() {
    cout << "\n=== გამოთვალეთ R (ვარიანტი გ) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // R = atan(x) + pow(y, 3) / (1 + fabs(x - y))
    double R = atan(x) + pow(y, 3) / (1 + fabs(x - y));
    
    cout << fixed << setprecision(4);
    cout << "R = " << R << endl;
}

// ============================================
// ფუნქცია 22: გამოთვალეთ R (ვარიანტი დ)
// ============================================
void exercise6d() {
    cout << "\n=== გამოთვალეთ R (ვარიანტი დ) ===" << endl;
    double x, y;
    cout << "შეიყვანეთ x, y: ";
    cin >> x >> y;
    
    // R = sqrt(x * y) + log10(x + 1) - tan(y)
    double R = sqrt(x * y) + log10(x + 1) - tan(y);
    
    cout << fixed << setprecision(4);
    cout << "R = " << R << endl;
}

// ============================================
// ფუნქცია 23: გამოთვალეთ Q (ვარიანტი ა)
// ============================================
void exercise7a() {
    cout << "\n=== გამოთვალეთ Q (ვარიანტი ა) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // Q = (x + y) / (1 + pow(z, 2)) + sin(x * y)
    double Q = (x + y) / (1 + pow(z, 2)) + sin(x * y);
    
    cout << fixed << setprecision(4);
    cout << "Q = " << Q << endl;
}

// ============================================
// ფუნქცია 24: გამოთვალეთ Q (ვარიანტი ბ)
// ============================================
void exercise7b() {
    cout << "\n=== გამოთვალეთ Q (ვარიანტი ბ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // Q = exp(x + y) / (1 + cos(z)) - sqrt(x * y)
    double Q = exp(x + y) / (1 + cos(z)) - sqrt(x * y);
    
    cout << fixed << setprecision(4);
    cout << "Q = " << Q << endl;
}

// ============================================
// ფუნქცია 25: გამოთვალეთ Q (ვარიანტი გ)
// ============================================
void exercise7c() {
    cout << "\n=== გამოთვალეთ Q (ვარიანტი გ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // Q = log(x + y + z) + atan(x / z) / pow(y, 2)
    double Q = log(x + y + z) + atan(x / z) / pow(y, 2);
    
    cout << fixed << setprecision(4);
    cout << "Q = " << Q << endl;
}

// ============================================
// ფუნქცია 26: გამოთვალეთ Q (ვარიანტი დ)
// ============================================
void exercise7d() {
    cout << "\n=== გამოთვალეთ Q (ვარიანტი დ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // Q = pow(x, 2) * sin(y) + cos(z) / (1 + fabs(x - z))
    double Q = pow(x, 2) * sin(y) + cos(z) / (1 + fabs(x - z));
    
    cout << fixed << setprecision(4);
    cout << "Q = " << Q << endl;
}

// ============================================
// ფუნქცია 27: გამოთვალეთ W (ვარიანტი ა)
// ============================================
void exercise8a() {
    cout << "\n=== გამოთვალეთ W (ვარიანტი ა) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // W = sqrt(x + y + z) / (1 + exp(-x)) + log(y)
    double W = sqrt(x + y + z) / (1 + exp(-x)) + log(y);
    
    cout << fixed << setprecision(4);
    cout << "W = " << W << endl;
}

// ============================================
// ფუნქცია 28: გამოთვალეთ W (ვარიანტი ბ)
// ============================================
void exercise8b() {
    cout << "\n=== გამოთვალეთ W (ვარიანტი ბ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // W = (sin(x) + cos(y)) * exp(z) / (1 + pow(x, 2))
    double W = (sin(x) + cos(y)) * exp(z) / (1 + pow(x, 2));
    
    cout << fixed << setprecision(4);
    cout << "W = " << W << endl;
}

// ============================================
// ფუნქცია 29: გამოთვალეთ W (ვარიანტი გ)
// ============================================
void exercise8c() {
    cout << "\n=== გამოთვალეთ W (ვარიანტი გ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // W = atan(x + y) + pow(z, 2) / (1 + fabs(x - y))
    double W = atan(x + y) + pow(z, 2) / (1 + fabs(x - y));
    
    cout << fixed << setprecision(4);
    cout << "W = " << W << endl;
}

// ============================================
// ფუნქცია 30: გამოთვალეთ W (ვარიანტი დ)
// ============================================
void exercise8d() {
    cout << "\n=== გამოთვალეთ W (ვარიანტი დ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // W = log10(x * y) + sqrt(z) - tan(x + y)
    double W = log10(x * y) + sqrt(z) - tan(x + y);
    
    cout << fixed << setprecision(4);
    cout << "W = " << W << endl;
}

// ============================================
// ფუნქცია 31: გამოთვალეთ P (ვარიანტი ა)
// ============================================
void exercise9a() {
    cout << "\n=== გამოთვალეთ P (ვარიანტი ა) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // P = (x + y) * exp(-z) / (1 + sin(x * y))
    double P = (x + y) * exp(-z) / (1 + sin(x * y));
    
    cout << fixed << setprecision(4);
    cout << "P = " << P << endl;
}

// ============================================
// ფუნქცია 32: გამოთვალეთ P (ვარიანტი ბ)
// ============================================
void exercise9b() {
    cout << "\n=== გამოთვალეთ P (ვარიანტი ბ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // P = sqrt(x * y * z) + log(x + y) / cos(z)
    double P = sqrt(x * y * z) + log(x + y) / cos(z);
    
    cout << fixed << setprecision(4);
    cout << "P = " << P << endl;
}

// ============================================
// ფუნქცია 33: გამოთვალეთ P (ვარიანტი გ)
// ============================================
void exercise9c() {
    cout << "\n=== გამოთვალეთ P (ვარიანტი გ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // P = pow(x, 3) + atan(y) / (1 + pow(z, 2)) - fabs(x - y)
    double P = pow(x, 3) + atan(y) / (1 + pow(z, 2)) - fabs(x - y);
    
    cout << fixed << setprecision(4);
    cout << "P = " << P << endl;
}

// ============================================
// ფუნქცია 34: გამოთვალეთ P (ვარიანტი დ)
// ============================================
void exercise9d() {
    cout << "\n=== გამოთვალეთ P (ვარიანტი დ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // P = exp(x + y) * sin(z) / (1 + log10(x * y))
    double P = exp(x + y) * sin(z) / (1 + log10(x * y));
    
    cout << fixed << setprecision(4);
    cout << "P = " << P << endl;
}

// ============================================
// ფუნქცია 35: გამოთვალეთ V (ვარიანტი ა)
// ============================================
void exercise10a() {
    cout << "\n=== გამოთვალეთ V (ვარიანტი ა) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // V = (x + y + z) / sqrt(1 + pow(x, 2) + pow(y, 2))
    double V = (x + y + z) / sqrt(1 + pow(x, 2) + pow(y, 2));
    
    cout << fixed << setprecision(4);
    cout << "V = " << V << endl;
}

// ============================================
// ფუნქცია 36: გამოთვალეთ V (ვარიანტი ბ)
// ============================================
void exercise10b() {
    cout << "\n=== გამოთვალეთ V (ვარიანტი ბ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // V = exp(x) * cos(y) + log(z + 1) / (1 + sin(x + y))
    double V = exp(x) * cos(y) + log(z + 1) / (1 + sin(x + y));
    
    cout << fixed << setprecision(4);
    cout << "V = " << V << endl;
}

// ============================================
// ფუნქცია 37: გამოთვალეთ V (ვარიანტი გ)
// ============================================
void exercise10c() {
    cout << "\n=== გამოთვალეთ V (ვარიანტი გ) ===" << endl;
    double x, y, z;
    cout << "შეიყვანეთ x, y, z: ";
    cin >> x >> y >> z;
    
    // V = atan(x + y) + pow(z, 3) / (1 + fabs(x - z)) - sqrt(y)
    double V = atan(x + y) + pow(z, 3) / (1 + fabs(x - z)) - sqrt(y);
    
    cout << fixed << setprecision(4);
    cout << "V = " << V << endl;
}

// ============================================
// მაგალითი პროგრამა 1-დან
// ============================================
void exampleProgram1() {
    cout << "\n=== მაგალითი პროგრამა 1 ===" << endl;
    double pi = 3.14;
    double x = 3.18, c = 1.87;
    double z = (cos(pi / 1.7) + pow(x, 3)) / (exp(-x) + c);
    double t = pow((5.3 + z * z), 1.0 / 5.0);
    
    cout << fixed << setprecision(4);
    cout << "t = " << t << endl;
}

// ============================================
// 20+ გამოსახულება სტანდარტული ფუნქციებით
// ============================================
void expressions20() {
    cout << "\n=== 20+ გამოსახულება სტანდარტული ფუნქციებით ===" << endl;
    double x = 2.5, y = 3.7, z = 1.2;
    
    cout << fixed << setprecision(4);
    cout << "1. T = pow(z,2)/(1+sin(pow(z,2)))-sqrt(x+2)" << endl;
    double expr1 = pow(z, 2) / (1 + sin(pow(z, 2))) - sqrt(x + 2);
    cout << "   შედეგი: " << expr1 << endl;
    
    cout << "\n2. a = sqrt(x) + exp(y) - log(z)" << endl;
    double expr2 = sqrt(x) + exp(y) - log(z);
    cout << "   შედეგი: " << expr2 << endl;
    
    cout << "\n3. b = fabs(x - y) + pow(z, 3)" << endl;
    double expr3 = fabs(x - y) + pow(z, 3);
    cout << "   შედეგი: " << expr3 << endl;
    
    cout << "\n4. c = sin(x) * cos(y) / tan(z)" << endl;
    double expr4 = sin(x) * cos(y) / tan(z);
    cout << "   შედეგი: " << expr4 << endl;
    
    cout << "\n5. d = atan(x) + log10(y) - ceil(z)" << endl;
    double expr5 = atan(x) + log10(y) - ceil(z);
    cout << "   შედეგი: " << expr5 << endl;
    
    cout << "\n6. e = floor(x) + pow(y, 2) * exp(-z)" << endl;
    double expr6 = floor(x) + pow(y, 2) * exp(-z);
    cout << "   შედეგი: " << expr6 << endl;
    
    cout << "\n7. f = sqrt(pow(x, 2) + pow(y, 2))" << endl;
    double expr7 = sqrt(pow(x, 2) + pow(y, 2));
    cout << "   შედეგი: " << expr7 << endl;
    
    cout << "\n8. g = (x + y) / (1 + sin(z))" << endl;
    double expr8 = (x + y) / (1 + sin(z));
    cout << "   შედეგი: " << expr8 << endl;
    
    cout << "\n9. h = log(x + y) + atan(x / y)" << endl;
    double expr9 = log(x + y) + atan(x / y);
    cout << "   შედეგი: " << expr9 << endl;
    
    cout << "\n10. i = exp(x) / (1 + pow(y, 2))" << endl;
    double expr10 = exp(x) / (1 + pow(y, 2));
    cout << "   შედეგი: " << expr10 << endl;
    
    cout << "\n11. j = cos(x) + sin(y) * sqrt(z)" << endl;
    double expr11 = cos(x) + sin(y) * sqrt(z);
    cout << "   შედეგი: " << expr11 << endl;
    
    cout << "\n12. k = pow(x, 3) + log(y) - fabs(z)" << endl;
    double expr12 = pow(x, 3) + log(y) - fabs(z);
    cout << "   შედეგი: " << expr12 << endl;
    
    cout << "\n13. l = (sin(x) + cos(y)) / (1 + exp(-z))" << endl;
    double expr13 = (sin(x) + cos(y)) / (1 + exp(-z));
    cout << "   შედეგი: " << expr13 << endl;
    
    cout << "\n14. m = sqrt(x * y) + atan(z) / log(x + 1)" << endl;
    double expr14 = sqrt(x * y) + atan(z) / log(x + 1);
    cout << "   შედეგი: " << expr14 << endl;
    
    cout << "\n15. n = exp(x + y) * sin(z) / (1 + pow(x, 2))" << endl;
    double expr15 = exp(x + y) * sin(z) / (1 + pow(x, 2));
    cout << "   შედეგი: " << expr15 << endl;
    
    cout << "\n16. o = log10(x * y) + pow(z, 2) - tan(x)" << endl;
    double expr16 = log10(x * y) + pow(z, 2) - tan(x);
    cout << "   შედეგი: " << expr16 << endl;
    
    cout << "\n17. p = ceil(x) + floor(y) * sqrt(z + 1)" << endl;
    double expr17 = ceil(x) + floor(y) * sqrt(z + 1);
    cout << "   შედეგი: " << expr17 << endl;
    
    cout << "\n18. q = fabs(x - y) + exp(z) / cos(x)" << endl;
    double expr18 = fabs(x - y) + exp(z) / cos(x);
    cout << "   შედეგი: " << expr18 << endl;
    
    cout << "\n19. r = pow(x, 2) * cos(y) + log(z + 1) / sin(x)" << endl;
    double expr19 = pow(x, 2) * cos(y) + log(z + 1) / sin(x);
    cout << "   შედეგი: " << expr19 << endl;
    
    cout << "\n20. s = atan(x + y) + sqrt(z) / (1 + fabs(x - y))" << endl;
    double expr20 = atan(x + y) + sqrt(z) / (1 + fabs(x - y));
    cout << "   შედეგი: " << expr20 << endl;
    
    cout << "\n21. t = (x + y + z) / sqrt(1 + pow(x, 2) + pow(y, 2))" << endl;
    double expr21 = (x + y + z) / sqrt(1 + pow(x, 2) + pow(y, 2));
    cout << "   შედეგი: " << expr21 << endl;
    
    cout << "\n22. u = exp(-x) * sin(y) + log10(z) - atan(x / y)" << endl;
    double expr22 = exp(-x) * sin(y) + log10(z) - atan(x / y);
    cout << "   შედეგი: " << expr22 << endl;
}

// ============================================
// მთავარი ფუნქცია
// ============================================
int main() {
    int choice;
    
    cout << "========================================" << endl;
    cout << "პრაქტიკული სამუშაო 4" << endl;
    cout << "წრფივი სტრუქტურის ალგორითმები" << endl;
    cout << "========================================" << endl;
    
    do {
        cout << "\nაირჩიეთ ვარჯანტი:" << endl;
        cout << "0. გამოსვლა" << endl;
        cout << "1. მაგალითი პროგრამა 1" << endl;
        cout << "2. 20+ გამოსახულება" << endl;
        cout << "3. გამოთვალეთ a და b (ა)" << endl;
        cout << "4. გამოთვალეთ a და b (ბ)" << endl;
        cout << "5. გამოთვალეთ a და b (გ)" << endl;
        cout << "6. გამოთვალეთ a და b (დ)" << endl;
        cout << "7. გამოთვალეთ z (ბ)" << endl;
        cout << "8. გამოთვალეთ z (გ)" << endl;
        cout << "9. გამოთვალეთ z (დ)" << endl;
        cout << "10. გამოთვალეთ T (ა)" << endl;
        cout << "11. გამოთვალეთ T (ბ)" << endl;
        cout << "12. გამოთვალეთ T (გ)" << endl;
        cout << "13. გამოთვალეთ y (ა)" << endl;
        cout << "14. გამოთვალეთ y (ბ)" << endl;
        cout << "15. გამოთვალეთ y (გ)" << endl;
        cout << "16. გამოთვალეთ y (დ)" << endl;
        cout << "17. გამოთვალეთ S (ა)" << endl;
        cout << "18. გამოთვალეთ S (ბ)" << endl;
        cout << "19. გამოთვალეთ S (გ)" << endl;
        cout << "20. გამოთვალეთ S (დ)" << endl;
        cout << "21. გამოთვალეთ R (ა)" << endl;
        cout << "22. გამოთვალეთ R (ბ)" << endl;
        cout << "23. გამოთვალეთ R (გ)" << endl;
        cout << "24. გამოთვალეთ R (დ)" << endl;
        cout << "25. გამოთვალეთ Q (ა)" << endl;
        cout << "26. გამოთვალეთ Q (ბ)" << endl;
        cout << "27. გამოთვალეთ Q (გ)" << endl;
        cout << "28. გამოთვალეთ Q (დ)" << endl;
        cout << "29. გამოთვალეთ W (ა)" << endl;
        cout << "30. გამოთვალეთ W (ბ)" << endl;
        cout << "31. გამოთვალეთ W (გ)" << endl;
        cout << "32. გამოთვალეთ W (დ)" << endl;
        cout << "33. გამოთვალეთ P (ა)" << endl;
        cout << "34. გამოთვალეთ P (ბ)" << endl;
        cout << "35. გამოთვალეთ P (გ)" << endl;
        cout << "36. გამოთვალეთ P (დ)" << endl;
        cout << "37. გამოთვალეთ V (ა)" << endl;
        cout << "38. გამოთვალეთ V (ბ)" << endl;
        cout << "39. გამოთვალეთ V (გ)" << endl;
        cout << "\nშეიყვანეთ არჩევანი: ";
        cin >> choice;
        
        switch(choice) {
            case 0: break;
            case 1: exampleProgram1(); break;
            case 2: expressions20(); break;
            case 3: exercise1a(); break;
            case 4: exercise1b(); break;
            case 5: exercise1c(); break;
            case 6: exercise1d(); break;
            case 7: exercise2b(); break;
            case 8: exercise2c(); break;
            case 9: exercise2d(); break;
            case 10: exercise3a(); break;
            case 11: exercise3b(); break;
            case 12: exercise3c(); break;
            case 13: exercise4a(); break;
            case 14: exercise4b(); break;
            case 15: exercise4c(); break;
            case 16: exercise4d(); break;
            case 17: exercise5a(); break;
            case 18: exercise5b(); break;
            case 19: exercise5c(); break;
            case 20: exercise5d(); break;
            case 21: exercise6a(); break;
            case 22: exercise6b(); break;
            case 23: exercise6c(); break;
            case 24: exercise6d(); break;
            case 25: exercise7a(); break;
            case 26: exercise7b(); break;
            case 27: exercise7c(); break;
            case 28: exercise7d(); break;
            case 29: exercise8a(); break;
            case 30: exercise8b(); break;
            case 31: exercise8c(); break;
            case 32: exercise8d(); break;
            case 33: exercise9a(); break;
            case 34: exercise9b(); break;
            case 35: exercise9c(); break;
            case 36: exercise9d(); break;
            case 37: exercise10a(); break;
            case 38: exercise10b(); break;
            case 39: exercise10c(); break;
            default: cout << "არასწორი არჩევანი!" << endl;
        }
    } while(choice != 0);
    
    return 0;
}

