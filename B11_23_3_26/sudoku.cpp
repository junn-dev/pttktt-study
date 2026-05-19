//Tichpx - sudoku
#include<bits/stdc++.h>
using namespace std;
int a[10][10],n=9;

void in()
{
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++) cout<<a[i][j]<<" ";
		cout<<"\n";
	}
}
bool check(int x,int y,int t)
{
	for(int i=0;i<n;i++) if(a[i][y]==t or a[x][i]==t) return 0;
	for(int i=x/3*3;i<x/3*3+3;i++)
	for(int j=y/3*3;j<y/3*3+3;j++) if(a[i][j]==t) return 0;
	return 1;
}
void TRY(int x,int y)
{
	if(x>8) {in(); return;}
	if(a[x][y]!=0) TRY(x+(y==8),(y+1)%9);
	else for(int t=1;t<=n;t++)
	if(check(x,y,t))
	{
		a[x][y]=t;
		TRY(x+(y==8),(y+1)%9);
		a[x][y]=0; //dat lai 0 de quay lui
	}
}
int main()
{
	for(int i=0;i<n;i++)
		for(int j=0;j<n;j++) cin>>a[i][j];
	TRY(0,0);
}

