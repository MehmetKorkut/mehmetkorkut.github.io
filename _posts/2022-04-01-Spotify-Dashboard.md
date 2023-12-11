---
title: "Harmonizing Data: A Data-Driven Symphony of My Spotify Statistics "
date: 2022-04-01T00:00:00+03:00
categories:
  - Portfolio
tags:
  - Python
  - Dashboard
  - Data Visualization
  - Tableau
---

<a href="https://colab.research.google.com/github/MehmetKorkut/Spotify_Dashboard/blob/main/Spotify_data_preparation.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>
<center>

# ***Visualizing Spotify Data with Python and Tableau***

![picture](https://wallpaperaccess.com/full/667773.jpg)

</center>

The code source in this project is from https://towardsdatascience.com/visualizing-spotify-data-with-python-tableau-687f2f528cdd. It belongs to Anne Bode. I only made a few changes because of the problems occured due to my data. The main reason why I did this is that I think it is fun to see my music data visually and learning tableau at the same time.
```
#packages
  import pandas as pd
  import numpy as np
  import requests
  
  #creating dataset
  # read your 1+ StreamingHistory files (depending on how extensive your streaming history is) into pandas dataframes
  df_stream0 = pd.read_json('StreamingHistory0.json')
  df_stream1 = pd.read_json('StreamingHistory1.json')
  df_stream2 = pd.read_json('StreamingHistory2.json')
  
  # merge streaming dataframes
  df_stream = pd.concat([df_stream0, df_stream1,df_stream2])
  
  # create a 'UniqueID' for each song by combining the fields 'artistName' and 'trackName'
  df_stream['UniqueID'] = df_stream['artistName'] + ":" + df_stream['trackName']
  
  df_stream.head()
  df_library=pd.read_csv('YourLibrary.csv')
  # add UniqueID column (same as above)
  df_library['UniqueID'] = df_library['Artist'] + ":" + df_library['Track']
  
  # add column with track URI stripped of 'spotify:track:'
  new = df_library["Uri"].str.split(":", expand = True)
  df_library['Track_Uri'] = new[2]
  df_library.drop(columns=['Document Index (generated)','tracks. Index (generated)','Number of Records per YourLibrary.json'],inplace=True)
  df_library.head()
  # create final dict as a copy df_stream
  df_tableau = df_stream.copy()
  
  # add column checking if streamed song is in library
  # not used in this project but could be helpful for cool visualizations
  df_tableau['In Library'] = np.where(df_tableau['UniqueID'].isin(df_library['UniqueID'].tolist()),1,0)
  
  # left join with df_library on UniqueID to bring in album and track_uri
  df_tableau = pd.merge(df_tableau, df_library[['Album','UniqueID','Track_Uri']],how='left',on=['UniqueID'])
  
  df_tableau.head()
  # save your IDs from new project in Spotify Developer Dashboard
  CLIENT_ID = 'a8c3529aca65472ea9058145146b25b5'
  CLIENT_SECRET = '0b444e5ae8004cdfa702025ab2214b3a'
  # generate access token
  
  # authentication URL
  AUTH_URL = 'https://accounts.spotify.com/api/token'
  
  # POST
  auth_response = requests.post(AUTH_URL, {
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
  })
  
  # convert the response to JSON
  auth_response_data = auth_response.json()
  
  # save the access token
  access_token = auth_response_data['access_token']
  # used for authenticating all API calls
  headers = {'Authorization': 'Bearer {token}'.format(token=access_token)}
  # base URL of all Spotify API endpoints
  BASE_URL = 'https://api.spotify.com/v1/'
  # create blank dictionary to store track URI, artist URI, and genres
  dict_genre = {}
  
  # convert track_uri column to an iterable list
  track_uris = df_library['Track_Uri'].to_list()
  
  # loop through track URIs and pull artist URI using the API,
  # then use artist URI to pull genres associated with that artist
  # store all these in a dictionary
  for t_uri in track_uris:
      
      dict_genre[t_uri] = {'artist_uri': "", "genres":[]}
      
      r = requests.get(BASE_URL + 'tracks/' + t_uri, headers=headers)
      r = r.json()
      a_uri = r['artists'][0]['uri'].split(':')[2]
      dict_genre[t_uri]['artist_uri'] = a_uri
      
      s = requests.get(BASE_URL + 'artists/' + a_uri, headers=headers)
      s = s.json()
      dict_genre[t_uri]['genres'] = s['genres']
  # convert dictionary into dataframe with track_uri as the first column
  df_genre = pd.DataFrame.from_dict(dict_genre, orient='index')
  df_genre.insert(0, 'track_uri', df_genre.index)
  df_genre.reset_index(inplace=True, drop=True)
  
  df_genre.head()
  df_genre_expanded = df_genre.explode('genres')
  df_genre_expanded.head()
  # save df_tableau and df_genre_expanded as csv files that we can load into Tableau
  df_tableau.to_csv('MySpotifyDataTable.csv')
  df_genre_expanded.to_csv('GenresExpandedTable.csv')
```
  
  print('done')
Until this part, I prepared and export the data for the usage in Tableau. After this, I used Tableau Public program to make some visualizations.
Check two dashboards from my previous Tableau Account 
[Dashboard 1](https://public.tableau.com/app/profile/mehmet.korkut/viz/spotify_dashboard1/Dashboard1)
[Dashboard 2](https://public.tableau.com/app/profile/mehmet.korkut/viz/spotify_dashboard2/Dashboard2)
