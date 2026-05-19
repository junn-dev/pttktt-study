//Tichpx
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n,res=-1e9;
	cin>>n;
	long a,c=0;
	for(int i=1;i<=n;i++)
	{
		cin>>a;
		c=max(c,0L)+a;
		res=max(res,c);
	}
	cout<<res;
}

