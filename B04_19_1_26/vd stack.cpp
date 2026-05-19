//Tichpx
#include<bits/stdc++.h>
#include<stack>
using namespace std;

int main()
{
	stack<string> S;
	for(auto x:{"cho","meo","trau","bo","lua","ngua"}) S.push(x);
	
	cout<<"\nSize : "<<S.size();
	cout<<"\nTop  : "<<S.top();
	S.top()="ga";
	cout<<"\n\n";
	while(not S.empty()) {cout<<S.top()<<" "; S.pop();}
}

