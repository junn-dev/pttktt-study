//Tichpx
#include<bits/stdc++.h>
using namespace std;

int main()
{
	char x[100000],*q=x;
	scanf("%s",x);
	int d[150]={};
	for(char c='a';c<='z';c++)
	{
		for(int i=0;i<d[c];i++) *q++=c; 
	}
	printf("%s",x);
}

