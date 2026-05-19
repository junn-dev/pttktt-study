//Tichpx - tam hau
#include<bits/stdc++.h>
using namespace std;

int x[1000],n,dem=0;
bool check(int k,int t)
{
	for(int i=0;i<k;i++)
	{
		if(x[i]==t) return 0;
		if(k-i==abs(t-x[i])) return 0;
	}
	return 1;
}
void TRY(int k)
{
	if(k==n) 
	{
		cout<<"\n"<<++dem<<" ";
		for(int i=0;i<n;i++) cout<<"("<<i+1<<","<<x[i]+1<<") ";
		return;
	}
	for(int t=0;t<n;t++)
	if(check(k,t))
	{
		x[k]=t;
		TRY(k+1);
	}
}
int main()
{
	cin>>n;	
	TRY(0);	
}

