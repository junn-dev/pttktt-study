//Tichpx - leo thang
#include<bits/stdc++.h>
using namespace std;

int x[100],n,dem=0;

void TRY(int k,int T) //k la so buoc x[0]...x[k-1] voi T la so bac con lai
{
	if(T==0) 
	{
		cout<<"\n"<<++dem<<" : "<<n<<" = ";
		for(int i=0;i<k;i++) cout<<x[i]<<" ";
	}
	for(int z=1;z<=3 and z<=T; z++)
	{
		x[k]=z;
		TRY(k+1,T-z);
	}
}

int main()
{
	cin>>n;
	TRY(0,n);
}

