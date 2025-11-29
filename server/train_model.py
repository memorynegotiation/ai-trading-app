# Toy trainer (demo only)
from sklearn.ensemble import RandomForestClassifier
import numpy as np, joblib
rng = np.random.RandomState(0)
N = 1000
dma = rng.randint(0,2,size=N)
oi = rng.normal(1e5,5e4,size=N)
vol = rng.normal(5e5,2e5,size=N)
rsi = rng.normal(50,15,size=N)
ma_diff = rng.normal(0,2,size=N)
X = np.vstack([dma, oi/1e5, vol/1e5, rsi/100, ma_diff]).T
y = np.where((dma==1)&(rsi<60), 0, np.where(rsi>70,2,1))
clf = RandomForestClassifier(n_estimators=50, random_state=0)
clf.fit(X,y)
joblib.dump(clf, "toy_model.joblib")
print("Saved toy_model.joblib")
