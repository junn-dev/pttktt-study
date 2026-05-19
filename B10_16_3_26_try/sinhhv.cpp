//Tichpx - sinh hoan vi
#include<bits/stdc++.h>
using namespace std;

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
		int ok=1;
		for(int i=0;i<k && ok==1;i++) if(x[k]==x[i]) ok=0;
		if(ok) TRY(x,k+1,n);
	}
}

int main()
{
	int x[1000],n;
	cin>>n;
	TRY(x,0,n);
}

