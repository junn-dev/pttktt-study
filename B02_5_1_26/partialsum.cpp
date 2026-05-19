//Tichpx
#include<bits/stdc++.h>
using namespace std;

myfun(int a,int b)
{
	return a*b;
}

int main()
{
	int a[]={4,7,2,8,4,8,3,2},b[20]={},n=sizeof(a)/sizeof(int);
	
	//partial_sum(a,a+n,b,myfun);
	partial_sum(a,a+n,b,[](int a,int b){return a*b;});
	for(auto x:a) cout<<x<<" ";
	cout<<"\n";
	for(auto x:b) cout<<x<<" ";
}

