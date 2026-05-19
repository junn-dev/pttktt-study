//Tichpx - sinh hoan vi
#include<bits/stdc++.h>
using namespace std;
int d[1000]={};
void TRY(int *x,int k,int n)
{
	if(k==n) 
	{
		for(int i=0;i<n;i++) cout<<x[i]<<" ";
		cout<<"\n";
		return;
	}
	for(x[k]=1;x[k]<=n;x[k]++)
	{
		if(d[x[k]]==0)
		{
			d[x[k]]=1;
		  	TRY(x,k+1,n);
		  	d[x[k]]=0; //xoa vet de lui
		}
	}
}

int main()
{
	int x[1000],n;
	cin>>n;
	TRY(x,0,n);
}

