//Tichpx
#include<bits/stdc++.h>
using namespace std;
int a[1000],n,M,res=1e9;

void TRY(int k,int t,int T)  //T so tien con lai
{
	if(k==n)
	{
		if(T%a[n]==0) res=min(res,t+T/a[n]);
	}
	else for(int z=0;z+t<res and z*a[k]<=T;z++) 
	TRY(k+1,t+z,T-z*a[k]);
}
int main()
{
	cin>>n>>M;
	for(int i=1;i<=n;i++) cin>>a[i];
	TRY(1,0,M);
	if(res==1e9) cout<<"khong doi duoc";
	else cout<<res;
}

