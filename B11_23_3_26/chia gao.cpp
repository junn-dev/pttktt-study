//Tichpx - chia gao
#include<bits/stdc++.h>
using namespace std;
int gao[20],res=1e9;
void TRY(int k,int a,int A,int b,int B,int c,int C)
{
	//if(res==0) return;
	if(k-1==9) res=min(res,max({A,B,C})-min({A,B,C}));
	else
	{
		if(a<3) TRY(k+1,a+1,A+gao[k],b,B,c,C);
		if(b<3) TRY(k+1,a,A,b+1,B+gao[k],c,C);
		if(c<3) TRY(k+1,a,A,b,B,c+1,C+gao[k]);
	}
}
int main()
{
	for(int i=1;i<10;i++) cin>>gao[i];
	TRY(1,0,0,0,0,0,0);
	cout<<res;
}

