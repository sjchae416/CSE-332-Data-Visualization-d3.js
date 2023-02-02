from sklearn.manifold import MDS
from sklearn.metrics.pairwise import euclidean_distances
import pandas as pd

import csv


# NOTE
input_file = 'songs.csv'
songs = pd.read_csv(input_file, header=0)
distances = euclidean_distances(songs, songs)
# print(type(distances))
# print(distances.shape)
# print(distances)


embedding = MDS(n_components=2)
distances_transformed = embedding.fit_transform(distances)
print(type(distances_transformed))
print(distances_transformed.shape)
print(distances_transformed)


# pd.DataFrame(distances_transformed).to_csv('np_ndarr_distances.csv', index=False, header=False)
file = open('np_ndarr_distances.csv', 'w+', newline='')
attrs = ['x', 'y']
with file:
    write = csv.writer(file)
    write.writerow(attrs)
    write.writerows(distances_transformed)
