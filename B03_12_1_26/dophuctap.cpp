//Tichpx
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n;
	double x,s=1;
	cin>>n>>x;
	for(int i=1;i<=n*n;i+=2)s+=(x-i)*(x+i);    //O(n^n/2)
	for(int i=1;i<=n;i<<=1)s+=(x-i)*(x+i);    //O(log2(n))               i<<=1 <=> i*=2
	for(int i=n;i=>0;i/=3)s+=(x-i)*(x+i);    //O(log3(n+1)) = O(log3(n)  i<<=1 <=> i*=2
	for(int i=n*n*n; i>0; i-=5) s+=2;        //O(n^3/5) = O(n^3)
 	
}

