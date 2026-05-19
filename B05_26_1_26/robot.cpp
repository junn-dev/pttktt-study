//Tichpx
#include<bits/stdc++.h>
using namespace std;
typedef pair<int,int> pii;
int main()
{
	int x,y;
	cin>>x>>y;
	stack<pii> S;
	set<pii> out;
	S.push({x,y});
	out.insert({x,y});
	while(S.size())
	{
		int u=S.top().first,v=S.top().second;  //auto {u,v}=S.top(); 
		S.pop();
		if(u%2==0)
		{
			pii z={v,u/2};
			if(out.count(z)==0) {S.push(z); out.insert(z);}
		}         
		if(v%2!=0)
		{
			pii z={v/2+1,u};
			if(out.count(z)==0) {S.push(z); out.insert(z);}
		}         
	}
	cout<<out.size();
}

