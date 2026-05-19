//Tichpx - giao hang
#include<bits/stdc++.h>
using namespace std;

int main()
{
	long res=0,n,a,b;
	vector<int> A[100005];  //cac vec to tao ra mac dinh rong
	priority_queue<int> Q;
	cin>>n;
	while(n--)
	{
		cin>>a>>b;
		A[a].push_back(b);
	}
	for(int i=1e5;i>0;i--)
	{
		for(auto x:A[i]) Q.push(x);
		if(Q.size()) {res+=Q.top();Q.pop();	}
	}
	cout<<res;
}

