//Tichpx - Fibonacci
#include<bits/stdc++.h>
using namespace std;

int main()
{
	long a=1,b=1,n;
	cin>>n;
	while(n--) b=a+b,a=b-a;	
	cout<<a;
}

