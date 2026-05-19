//Tichpx
#include<bits/stdc++.h>
using namespace std;
typedef pair<int,int> pii;
set<pii> out;

void dfs(int u,int v)
{
	if(out.count({u,v})) return;
	out.insert({u,v});
	if(u%2==0) dfs(v,u/2);
	if(v%2!=0) dfs(v/2+1,u);
}


int main()
{
	int x,y;
	cin>>x>>y;
	dfs(x,y);
	cout<<out.size();
}

