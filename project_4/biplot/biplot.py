import numpy as np
from numpy.linalg import eig
from sklearn.decomposition import PCA
import pandas as pd

import csv

# np.random.seed(5)

# NOTE
input_file = 'songs.csv'
songs = pd.read_csv(input_file, header=0)
attrs = list(songs.columns.values)
songs_df = pd.DataFrame(data=songs, columns=attrs)
# print(songs_df.head())

# pca = PCA(n_components=2)
# pca = pca.fit(songs_df)
# songs_transformed = pca.transform(songs_df)
# print(type(songs_transformed))
# # print(songs_transformed[:5, :])

# # pd.DataFrame(songs_transformed).to_csv('pcaPD.csv')
# songs_transformed.tofile('np_ndarr_pca.csv', sep=',')


# NOTE
pca = PCA(n_components=8)
pcomponent = pca.fit_transform(songs)
exp_var = pca.explained_variance_ratio_
cum_exp_var = np.cumsum(pca.explained_variance_ratio_)
principalDf = pd.DataFrame(pcomponent)
pcomponent = np.transpose(principalDf).values.tolist()

pcomponent_mm = pcomponent

pca_data = np.transpose(pcomponent_mm[0:2]).tolist()
print(pca.components_)
# print(type(pca_data), pca_data)


# # pd.DataFrame(pca_data).to_csv('dict_pcaDP.csv', index=False, header=False)
file = open('list_pcaPD.csv', 'w+', newline='')
attrs = ['component1', 'component2']
with file:
    write = csv.writer(file)
    write.writerow(attrs)
    write.writerows(pca_data)

# NOTE Compute Principal Components from Scratch (https://www.machinelearningplus.com/machine-learning/principal-components-analysis-pca-better-explained/)
# input_file = 'songs.csv'
df = pd.read_csv(input_file)
X = df
X_standard = X-X.mean()
df_cov = X_standard.cov()
eigenvalues, eigenvectors = eig(df_cov)
# print(eigenvalues[:8])
# print(eigenvectors.shape)
print(eigenvectors)

# X_pca = np.dot(X_standard, eigenvectors)
# df_pca_calc = pd.DataFrame(X_pca)
# print(df_pca_calc.round(2))
# print(df_pca_calc.round(2).head())
