//Tichpx
#include<bits/stdc++.h>
using namespace std;

struct ss
{
	bool operator()(int a,int b)
	{
		return a%2>b%2;
	}
};

int main()
{
	//priority_queue<int> Q;  //mac dinh uu tien lon
//	priority_queue<int,vector<int>,less<int> > Q;  //mac dinh uu tien lon
	priority_queue<int,vector<int>,ss> Q;  //mac dinh uu tien lon
	for(int x:{43,72,29,81,32,643,75,215,124}) Q.push(x);
	while(Q.size())
	{
		cout<<Q.top()<<" ";
		Q.pop();
	}
	
}

