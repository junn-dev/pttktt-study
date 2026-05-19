//Tichpx
#include<bits/stdc++.h>
using namespace std;

int C[100][100]={},n,m;
string x,y;
void TRACE(int n,int m)
{
	if(C[n][m]==0) return;
	while(C[n][m]==C[n-1][m]) n--;
	while(C[n][m]==C[n][m-1]) m--;
	TRACE(n-1,m-1);
	cout<<x[n];
}
int main()
{
	cin>>x; n=x.length(); x="$"+x;  //thuat toan phan tich tu x1
	cin>>y; m=y.length(); y="$"+y; 
	for(int i=1;i<=n;i++)
	for(int j=1;j<=m;j++)
	if(x[i]==y[j]) C[i][j]=1+C[i-1][j-1];
	else C[i][j]=max(C[i-1][j],C[i][j-1]);
	cout<<"\ndo dai xccdn "<<C[n][m]<<"\n";
	TRACE(n,m);
}

