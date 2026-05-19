//Tichpx - thap HN
#include<bits/stdc++.h>
using namespace std;

void thap(int n,char A,char B,char C)
{
	if(n>1) thap(n-1,A,C,B);
	cout<<"\nChuyen "<<n<<" tu "<<A<<" sang "<<B;
	if(n>1) thap(n-1,C,B,A);
}

int main()
{
	thap(10,'A','B','C');
}

