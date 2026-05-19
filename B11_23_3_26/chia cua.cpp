//Tichpx - chia cua
#include<bits/stdc++.h>
using namespace std;


int n,a[100],T=0,res=1e9;

void TRY(int k,int A,int B)
{
	if(k==n) {res=B-A; return;}
	if(A+a[k]<=T/2) TRY(k+1,A+a[k],B);
	if(B+a[k]<(T+res)/2) TRY(k+1,A,B+a[k]);
}

int main()
{
	cin>>n;
	for(int i=0;i<n;i++) {cin>>a[i]; T+=a[i];}
	TRY(0,0,0);
	cout<<res;
}

