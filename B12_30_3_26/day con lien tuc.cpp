//Tichpx
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n;
	cin>>n;
	long a[n+5]={};
	for(int i=1;i<=n;i++)
	{
		cin>>a[i];
		a[i]+=max(a[i-1],0L);
	}
	cout<<*max_element(a+1,a+n+1);
}

