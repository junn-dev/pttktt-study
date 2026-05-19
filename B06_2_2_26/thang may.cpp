//Tichpx - thang may
#include<bits/stdc++.h>
using namespace std;

int main()
{
	map<int,int> M;
	queue<int> Q;
	int n,m,k,s,f;
	cin>>n>>m>>k>>s>>f;
	Q.push(s);
	M[s]=1;
	while(Q.size() and M[f]==0)
	{
		int u=Q.front();
		Q.pop();
		for(int x:{m,-k})
		if(u+x>0 and u+x<=n and M[u+x]==0)
		{
			M[u+x]=M[u]+1;
			Q.push(u+x);
		}
	}
	cout<<M[f]-1;	
}

