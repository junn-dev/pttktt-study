//Tichpx - doi co so 2
#include<bits/stdc++.h>
using namespace std;

int main()
{
	string Hex="0123456789ABCDEFGH";
	stack<int> S;
	long n,cs=16;
	for(cin>>n;n!=0;n/=cs) S.push(n%cs);
	while(S.size()) {cout<<Hex[S.top()];S.pop();}
}

