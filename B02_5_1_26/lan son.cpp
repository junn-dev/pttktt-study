//Tichpx - Lan son
#include<bits/stdc++.h>
using namespace std;

int x[1000006]={};

int main()
{
	int n,m,k,a,b,s=0;
	cin>>n>>m>>k;
	while(n--)
	{
		cin>>a>>b;
		x[a]++;
		x[b]--;
	}
	for(int i=1;i<m;i++) x[i]+=x[i-1];
	for(int i=0;i<m;i++) s+=x[i]>=k;
	cout<<s;
}

