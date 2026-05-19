//Tichpx - Dong nuoc
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n,m,k;
	cin>>n>>m>>k;
	queue<pair<int,int>>Q;
	map<pair<int,int>,int> M;
	Q.push({0,0});
	M[{0,0}]=0;
	while(Q.size())
	{
		int x=Q.front().first,y=Q.front().second,z=x+y;
		Q.pop();
		pair<int,int> Next[]={{0,y},{n,y},{x,0},{x,m},{max(0,z-m),min(z,m)},{min(z,n),max(0,z-n)}};
		for(auto v:Next)
		if(M.find(v)==M.end())
		{
			Q.push(v);
			M[v]=M[{x,y}]+1;
			if(v.first==k or v.second==k) return !printf("%d",M[v]); 
		}
	}
	printf("khogn dong duoc");
}

