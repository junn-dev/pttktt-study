//Tichpx - cat hinh vuong
#include<bits/stdc++.h>
using namespace std;
int C[105][105],n,m,P[105][105];  //matran P luu vet cat

void TRACE(int n,int m,string p="\n")
{
	if(n==m) cout<<p<<n<<"*"<<m;
	else if(P[n][m]>0)
	{
		TRACE(P[n][m],m,p+"\t");
		cout<<p<<n<<"*"<<m;
		TRACE(n-P[n][m],m,p+"\t");
	}
	else
	{
		TRACE(n,-P[n][m],p+"\t");
		cout<<p<<n<<"*"<<m;
		TRACE(n,m+P[n][m],p+"\t");
	}
	
}
int main()
{
	cin>>n>>m;
	for(int i=1;i<=n;i++) {C[i][1]=i;	P[i][1]=1;}	
	for(int j=1;j<=m;j++) {C[1][j]=j;   P[1][j]=-1;}	
	for(int i=1;i<=n;i++)	
	for(int j=1;j<=m;j++)
	if(i==j) C[i][j]=1;
	else 
	{
		C[i][j]=1e9;
		for(int k=1;k<=i/2;k++) 			
			if(C[i][j]>C[k][j]+C[i-k][j]) {C[i][j]=C[k][j]+C[i-k][j]; P[i][j]=k;}
		for(int k=1;k<=j/2;k++) 			
			if(C[i][j]>C[i][k]+C[i][j-k]) {C[i][j]=C[i][k]+C[i][j-k]; P[i][j]=-k;}
	}
	cout<<C[n][m]<<"\n";
	TRACE(n,m);
}

