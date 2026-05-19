//Tichpx
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n; 
	cin>>n; 
	int a[n]; 
	for(auto &x:a) cin>>x; 
	sort(a,a+n,greater<int>());
	int m; 
	cin>>m; 
	int b[m]; 
	for(auto &x:b) cin>>x; 
	sort(b,b+m,greater<int>());
	int res=0;
	for(int i=0;i<n;i++)   //O(n+m)
	{
		while(j<m && b[j]>=a[i]) j++;
		if(j<m) {res++; j++;}
	}
	cout<<res;
}

