//Tichpx - co hay khong duong di tu s->f trong bai moi con duong ve 0
#include<bits/stdc++.h>
using namespace std;
map<int,int> M;  //mang cha VD 30->28:  M[28]=30
void path(int s,int f)
{
//	list<int> L;
//	while(f!=s) {L.push_front(f); f=M[f];}
//	cout<<s;
//	for(auto x:L) cout<<"->"<<x;
	if(s==f) cout<<s;
	else {path(s,M[f]); cout<<"->"<<f;}
}
int main()
{
	int s,f;
	cin>>s>>f;
	stack<int> S;
	S.push(s);
	while(S.size())
	{
		int u=S.top(); 
		S.pop();
		for(int a=1;a*a<=u;a++)
		if(u%a==0)
		{
			int v=(a-1)*(u/a+1);
			if(v>=f and M.find(v)==M.end())  //out.count(v)==0
			{
				S.push(v);
				M[v]=u;
			}
			if(v==f) {cout<<"di duoc\n"; path(s,f); return 0;}
		}
	}
	cout<<"khong di duoc";
}
