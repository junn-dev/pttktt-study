//Tichpx - phan tu trung vi
#include<bits/stdc++.h>
using namespace std;

int main()
{
	priority_queue<int> L;   
	priority_queue<int,vector<int>, greater<int> > R;
	int n,x;
	cin>>n;
	for(int i=1;i<=n;i++)
	{
		cin>>x;
		i%2?L.push(x):R.push(x);
		if(i>1 and L.top()>R.top())
		{
			R.push(L.top());
			L.push(R.top());
			L.pop();
			R.pop();
		}
		cout<<L.top()<<" ";
	}
}

