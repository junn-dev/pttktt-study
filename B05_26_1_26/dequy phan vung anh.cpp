//Tichpx - phan vung anh DFS
#include<bits/stdc++.h>
using namespace std;
#define FOR(i,a,b) for(int i=a;i<=b;i++)
typedef pair<int,int> pii;
int a[205][205],n,m;
void DFS(int u,int v,int &dem)
{
	a[u][v]=-1;  //da xet
	dem++;
	for(int i=-1;i<=1;i++)
	for(int j=-1;j<=1;j++)
	if(a[u+i][v+j]==0) DFS(u+i,v+j,dem);
}
int main()
{
	cin>>n>>m;
	FOR(i,1,n) 
	FOR(j,1,m) cin>>a[i][j];
	FOR(i,0,n+1) a[i][0]=a[i][m+1]=1;  //them cot 0 va m+1 toan 1
	FOR(j,0,m+1) a[0][j]=a[n+1][j]=1;  //them hang 0 va n+1 toan 1
	vector<int> res;
	FOR(i,1,n)
	FOR(j,1,m)
	if(a[i][j]==0) {int d=0;DFS(i,j,d); res.push_back(d);}
	cout<<res.size()<<"\n";
	sort(res.begin(),res.end());
	for(auto x:res) cout<<x<<" ";
}

