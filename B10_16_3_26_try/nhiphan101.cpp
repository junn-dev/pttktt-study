//Tichpx - sinh day np khong chua 101
#include<bits/stdc++.h>
using namespace std;
int dem=0;
void TRY(int *x,int k,int n)
{
	if(k==n) 
	{
		for(int i=0;i<n;i++) cout<<x[i]<<" ";
		cout<<"\n";
		dem++;
	}
	else 
	{
		x[k]=0; TRY(x,k+1,n);
		if(k<2 or not(x[k-1]==0 and x[k-2]==1)) 
		{
			x[k]=1;
			TRY(x,k+1,n);
		}
	}
}
int main()
{
	int x[100],n;
	cin>>n;
	TRY(x,0,n);
	cout<<"\nSo cach "<<dem;
}

