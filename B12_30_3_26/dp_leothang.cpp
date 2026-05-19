//Tichpx - leo thag
#include<bits/stdc++.h>
using namespace std;

int main()
{
	int n;
	cin>>n;
	long C[n+5]={1,1,2,4};
	for(int i=4;i<=n;i++) C[i]=2*C[i-1]-C[i-4];
	cout<<C[n];
}

