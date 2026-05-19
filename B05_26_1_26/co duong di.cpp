//Tichpx - co hay khong duong di tu s->f trong bai moi con duong ve 0
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int s,f;
	cin>>s>>f;
	stack<int> S;
	set<int> out={s};
	S.push(s);
	while(S.size())
	{
		int u=S.top(); 
		S.pop();
		for(int a=1;a*a<=u;a++)
		if(u%a==0)
		{
			int v=(a-1)*(u/a+1);
			if(v>=f and out.find(v)==out.end())  //out.count(v)==0
			{
				S.push(v);
				out.insert(v);
			}
			if(v==f) return !printf("di duoc");
		}
	}
	cout<<"khong di duoc";
}
