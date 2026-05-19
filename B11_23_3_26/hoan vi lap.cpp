//Tichpx - hoan vi lap
#include<bits/stdc++.h>
using namespace std;
map<char,int> F;

void TRY(string x,int n)
{
	if(x.size()==n) cout<<x<<"\n";
	else for(auto &f:F)
	if(f.second>0)
	{
		f.second--;
		TRY(x+f.first,n);
		f.second++;
	}
}

int main()
{
	string s;
	cin>>s;
	for(auto c:s) F[c]++; //dem tan suat
	TRY("",s.size());
}

