//Tichpx - chuan ten
#include<bits/stdc++.h>
using namespace std;

int main()
{
	char x[10000],*p=x;
	scanf("%[^\n]",x);
	Dau: 
		if(*p==' ') {p++; goto Dau;}
		else if(*p=='\0') goto Ket;
		else {cout<<char(toupper(*p++)); goto Than;}
	Than:
		if(*p==' ') {cout<<*p++; goto Dau;}
		else if(*p=='\0') goto Ket;
		else {cout<<char(tolower(*p++)); goto Than;}
	Ket: return 0;
}

