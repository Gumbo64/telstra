import matplotlib.pyplot as plt
import json
import os
import numpy as np

with open('data.json', 'r') as f:
    data = json.load(f)
    

base = np.array([-33.98185607089227, 151.1200563884071])

y = [point["latitude"] for point in data]
x = [point["longitude"] for point in data]
latitudes = np.array([point["latitude"] for point in data])
longitudes = np.array([point["longitude"] for point in data])
# c = np.log(np.sqrt((latitudes - base[0])**2 + (longitudes - base[1])**2))
# c = [point["distance"] for point in data]

# plt.scatter(x, y, c=c, cmap='jet', s=1)
plt.scatter(x, y, s=1)
plt.colorbar()
plt.gca().set_aspect('equal', adjustable='box')
plt.show()