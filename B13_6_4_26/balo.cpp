//Tichpx - balo
#include<bits/stdc++.h>
using namespace std;

int n,m,C[100][1000]={},a[100],b[100];
void TRACE(int n,int m)
{
	if(C[n][m]==0) return;
	while(C[n][m]==C[n-1][m]) n--;
	TRACE(n-1,m-a[n]);
	cout<<"\nchon vat kt "<<a[n]<<" gt "<<b[n];
}

int main()
{
	cin>>n>>m;
	for(int i=1;i<=n;i++) cin>>a[i]>>b[i];
	for(int i=1;i<=n;i++)
	for(int j=1;j<=m;j++)
	if(a[i]>j) C[i][j]=C[i-1][j];
	else C[i][j]=max(C[i-1][j],b[i]+C[i-1][j-a[i]]);
	cout<<"\nTong gia tri max "<<C[n][m]<<"\n";
	TRACE(n,m);
}

