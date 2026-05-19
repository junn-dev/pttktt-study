//Tichpx - liet ke moi con duong ve 0
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n;
	cin>>n;
	stack<int> S;
	set<int> out={n};
	S.push(n);
	while(S.size())
	{
		int u=S.top(); 
		S.pop();
		for(int a=1;a*a<=u;a++)
		if(u%a==0)
		{
			int b=u/a,v=(a-1)*(b+1);
			if(out.find(v)==out.end())  //out.count(v)==0
			{
				S.push(v);
				out.insert(v);
			}
		}
	}
	for(auto x:out) cout<<x<<" ";
}

