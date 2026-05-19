//Tichpx - phan tu trung vi
#include<bits/stdc++.h>
using namespace std;

int main()
{
	multiset<int,greater<int> > L;   //multi_set
	multiset<int> R;
	int n,x;
	cin>>n;
	for(int i=1;i<=n;i++)
	{
		cin>>x;
		i%2?L.insert(x):R.insert(x);
		if(i>1 and *L.begin()>*R.begin())
		{
			R.insert(*L.begin());
			L.insert(*R.begin());
			L.erase(L.begin());
			R.erase(R.begin());
		}
		cout<<*L.begin()<<" ";
	}
}

