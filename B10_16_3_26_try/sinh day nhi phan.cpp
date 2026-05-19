//Tichpx
#include<bits/stdc++.h>
using namespace std;
void TRY(int *x,int k,int n)
{
	if(k==n) 
	{
		for(int i=0;i<n;i++) cout<<x[i]<<" ";
		cout<<"\n";
	}
	else for(int t=0;t<=1;t++) {x[k]=t; TRY(x,k+1,n);} 
}
int main()
{
	int x[100],n;
	cin>>n;
	TRY(x,0,n);
}

