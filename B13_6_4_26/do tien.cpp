//Tichpx
#include<bits/stdc++.h>
using namespace std;
int n,m,a[100],C[100][1000]={};
void TRACE(int n,int m)
{
	if(C[n][m]==0) return;
	while(C[n][m]==C[n-1][m]) n--;
	TRACE(n,m-a[n]);
	cout<<a[n]<<" ";
}
int main()
{
	cin>>n>>m;
	for(int i=1;i<=n;i++) cin>>a[i];
	for(int j=1;j<=m;j++) C[0][j]=1e9;
	for(int i=1;i<=n;i++) 
	for(int j=1;j<=m;j++) 
	if(a[i]>j) C[i][j]=C[i-1][j];
	else C[i][j]=min(C[i-1][j],1+C[i][j-a[i]]);
	if(C[n][m]==1e9) cout<<"khong doi duoc";
	else
	{
		cout<<"\nSo to "<<C[n][m]<<"\n";
		TRACE(n,m);
	}	
}

