//Tichpx
#include<bits/stdc++.h>
using namespace std;
#define long int
vector<int> sang(int n)
{
	vector<int> P;
	bool s[n+5]={};
	//fill(s,s+n+1,false);   //s[0]=s[1]=...=s[n]=true;
	for(int i=2;i<=n;i++)
	if(s[i]==0)
	{
		P.push_back(i);
		for(int j=i*i;j<=n;j+=i) s[j]=1;
	}
	return P;
}
int main()
{
	vector<int> P=sang(100);
	for(auto x:P) cout<<x<<" ";
}

