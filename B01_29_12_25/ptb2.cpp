//Tichpx
#include<bits/stdc++.h>
using namespace std;
typedef complex<double> sp;
int main()
{
	sp a,b,c,d,x1,x2;
	cout<<"a = "; cin>>a;
	cout<<"b = "; cin>>b;
	cout<<"c = "; cin>>c;
	b=-b/sp(2);   //ax^2-2bx+c=0
	d=b*b-a*c;
	d=sqrt(d);
	x1=(b-d)/a;
	x2=(b+d)/a;
	cout<<"x1 = "<<x1;
	cout<<"\nx2 = "<<x2;
}

