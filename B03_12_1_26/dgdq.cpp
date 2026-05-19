//Tichpx -
#include<bits/stdc++.h>
using namespace std;

long myfun(long a,long b)
{
	if(b==0) return a*a;
	long s=0;
	for(int i=1;i<=a*b;i++) s+=(a-i)*(b+i);
	return myfun(a/2,b/4)*s;
}

int main()
{

}

