//Tichpx
#include<bits/stdc++.h>
using namespace std;

long gt(int n) {return n?gt(n-1)*n:1;}

long Fib(int n) {return n<2?1:Fib(n-1)+Fib(n-2);}

void sx(int n,int *a)  //sx a0...a[n-1] tang dan
{
	if(n==0) return;
	sx(n-1,a);         //a[0] den a[n-2]
	for(int i=n-2;i>=0 && a[i]>a[i+1];i--) swap(a[i],a[i+1]);
}
int main()
{
	cout<<gt(5);
	cout<<"\n"<<Fib(10);
	int a[]={234,62,235,3,432,634,63,523},n=sizeof(a)/sizeof(int);
	sx(n,a);
	cout<<"\n";
	for(auto x:a) cout<<x<<" ";
	
}

