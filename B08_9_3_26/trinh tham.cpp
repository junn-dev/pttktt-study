//Tichpx - trinh tham
#include<bits/stdc++.h>
using namespace std;

int main()
{
	priority_queue<pair<int,int>> Q;
	int n,k,x;
	cin>>n>>k;
	for(int i=1;i<=n;i++)
	{
		cin>>x;
		Q.push({x,i});
		if(i>=k)
		{
			while(i-Q.top().second>=k) Q.pop();
			cout<<Q.top().first<<" ";
		}
	}
}

