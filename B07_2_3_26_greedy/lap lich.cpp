//Tichpx
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pii;

bool ss(pii u,pii v) {return u.second<v.second;}

int main()
{
	int n,res=0,t=-INT_MAX;
	cin>>n;
	pii A[n];
	for(auto &a:A) cin>>a.first>>a.second;
	sort(A,A+n,ss);
	for(auto a:A) if(a.first>t) {res++; t=a.second;}
	cout<<res;
}

