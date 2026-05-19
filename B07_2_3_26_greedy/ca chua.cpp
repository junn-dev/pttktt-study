//Tichpx
#include<bits/stdc++.h>
using namespace std;

int main()
{
	long n,k,res=0;
	cin>>n>>k;
	long a[n];
	for(auto &x:a) cin>>x;
	sort(a,a+n,greater<long>());
	for(int i=0;i<n && a[i]>i*k;i++) res+=a[i]-i*k;
	cout<<res;
}

