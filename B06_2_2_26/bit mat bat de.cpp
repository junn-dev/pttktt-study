//Tichpx
#include<bits/stdc++.h>
#include<queue>
using namespace std;

int main()
{
	queue<int> Q;
	int n,k;
	cin>>n>>k;
	for(int i=1;i<=n;i++) Q.push(i);
	
	while(Q.size()>1) //while(n--) //for(int j=1;j<n;j++)
	{
		for(int i=1;i<k;i++) {Q.push(Q.front()); Q.pop();}
		Q.pop();
	}
	cout<<Q.back();
}

