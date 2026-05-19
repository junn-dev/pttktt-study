//Tichpx - Luong nuoc
#include<bits/stdc++.h>
using namespace std;

inline int mymax(int a,int b) {return a>b?a:b;}

int main()
{
	long s=0,n;
	cin>>n;
	vector<long> a(n,0),L(n,0),R(n,0);
	for(auto &x:a) cin>>x;
	partial_sum(a.begin(),a.end(),L.begin(),mymax);
	partial_sum(a.rbegin(),a.rend(),R.rbegin(),mymax);
	for(int i=1;i<n-1;i++) s+=max(0L,min(L[i-1],R[i+1])-a[i]);
	cout<<s;
}

