//Tichpx
#include<bits/stdc++.h>
using namespace std;


string cs(int n)
{
	if(n<2) return string(1,char(n+'0'));
	return cs(n/2)+cs(n%2);
}

int main()
{
	cout<<"\nde quy"<<cs(143);
}

