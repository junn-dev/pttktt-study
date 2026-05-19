//Tichpx - tam hau
#include<bits/stdc++.h>
using namespace std;

int x[1000],n,dem=0;
map<int,int> Cot,Chinh,Phu;
void TRY(int k)
{
	if(k==n) 
	{
		cout<<"\n"<<++dem<<" ";
		for(int i=0;i<n;i++) cout<<"("<<i+1<<","<<x[i]+1<<") ";
		return;
	}
	for(int t=0;t<n;t++)
	if(Cot[t]==0 and Chinh[k-t]==0 and Phu[k+t]==0)
	{
		Cot[t]=Chinh[k-t]=Phu[k+t]=1;
		x[k]=t;
		TRY(k+1);
		Cot[t]=Chinh[k-t]=Phu[k+t]=0; //lui
	}
}
int main()
{
	cin>>n;
	//Chinh[0]=1;
	//Phu[n-1]=1;	
	TRY(0);	
}
