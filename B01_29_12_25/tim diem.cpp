//Tichpx Tim diem
#include<bits/stdc++.h>
using namespace std;
typedef pair<double,double> Diem;
#define x first
#define y second
double kc(Diem A,Diem B)  //binh phuong khoang cach
{
	return (A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y);
}
int main()
{
	Diem A,B,C,M;
	double eps=1e-4;
	cin>>A.x>>A.y>>B.x>>B.y>>M.x>>M.y;
	while(abs(A.x-B.x)>eps or abs(A.y-B.y)>eps)
	{
		//C=Diem((A.x+B.x)/2,(A.y+B.y)/2);
		//C=make_pair((A.x+B.x)/2,(A.y+B.y)/2);
		C={(A.x+B.x)/2,(A.y+B.y)/2};
		kc(M,A)>kc(M,B)?A=C:B=C;
	}	
	cout<<setprecison(4)<<fixed<<A.x<<" "<<A.y;
}

