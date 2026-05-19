//Tichpx - liet ke moi con duong ve 0
#include<bits/stdc++.h>
using namespace std;
set<int> out;

void DFS(int u)
{
	if(out.count(u)!=0) return;
	out.insert(u);
	for(int a=1;a*a<=u;a++)
	if(u%a==0) DFS((a-1)*(u/a+1));
}

int main()
{
	int n;
	cin>>n;
	DFS(n);
	for(auto x:out) cout<<x<<" ";
}

