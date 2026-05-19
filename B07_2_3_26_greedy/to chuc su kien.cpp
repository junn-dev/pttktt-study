//Tichpx - to chuc su kien
#include<bits/stdc++.h>
using namespace std;

typedef pair<int,int> pii;
#define kt first
#define bd second

int main()
{
	int n,res=0,t=-INT_MAX,z=-INT_MAX;
	cin>>n;
	pii A[n];
	for(auto &a:A) cin>>a.bd>>a.kt;
	sort(A,A+n);
	for(auto a:A)
	{
		if(t<z) swap(t,z); 
		if(a.bd>t) {res++; t=a.kt;}
		else if(a.bd>z) {res++; z=a.kt;}
	}
	cout<<res;
}

