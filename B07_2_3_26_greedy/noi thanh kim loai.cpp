//Tichpx - noi than kim loai
#include<bits/stdc++.h>
using namespace std;

int main()
{
	priority_queue<long,vector<long>,greater<long>> Q;  //utien be
	long n,res=0,x;
	cin>>n;
	while(n--) {cin>>x;Q.push(x);}
	
	while(Q.size()>1)
	{
		x=Q.top(); Q.pop();
		x+=Q.top(); Q.pop();
		res+=x;
		Q.push(x);
	}
	cout<<res;
	 
}

