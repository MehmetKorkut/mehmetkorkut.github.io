---
title: "IBM Project:Deciphering Destinies: A Data-Driven Dilemma - Choosing Between Manhattan and Toronto"
date:2021-10-01T00:00:00+03:00
categories:
  - Portfolio
tags:
  - Machine Learning
  - Python
  - K-means Clustering
---

[Check this link for the article and other codes in Github Repository](https://github.com/MehmetKorkut/-Coursera_Capstone)


<center>
  <h1 style= "color:#FFC300">
      Segmenting and Clustering Neighborhoods in Toronto 
  </h1> 
<img src="toronto.png">
#Packages
    !pip install geopy folium
    import pandas as pd
    import numpy as np
    from bs4 import BeautifulSoup 
    import requests
    from geopy.geocoders import Nominatim 
    import requests 
    from pandas.io.json import json_normalize 
    import matplotlib.cm as cm
    import matplotlib.colors as colors
    from sklearn.cluster import KMeans
    import folium 
    print("All packages are imported!")
### Creating a Soup object
    url="https://en.wikipedia.org/wiki/List_of_postal_codes_of_Canada:_M"
    data=requests.get(url).text
    soup = BeautifulSoup(data,"html5lib")
 ### Creating the dataset 
**1-Create an empty list**
  
 **2- Find table in soup object and pass Not Assigned cells, get PostalCode, Borough and Neighbourhood and append them into cell**
  
 **3-Append cell into table_contents**
  
**4-Convert list to a dataframe**
  
**5-Replace some names in Borough column**
    table_contents=[]
    table=soup.find('table')
    for row in table.findAll('td'):
        cell = {}
        if row.span.text=='Not assigned':
            pass
        else:
            cell['PostalCode'] = row.p.text[:3]
            cell['Borough'] = (row.span.text).split('(')[0]
            cell['Neighborhood'] = (((((row.span.text).split('(')[1]).strip(')')).replace(' /',',')).replace(')',' ')).strip(' ')
            table_contents.append(cell)
  
# print(table_contents)
    df=pd.DataFrame(table_contents)
    df['Borough']=df['Borough'].replace({'Downtown TorontoStn A PO Boxes25 The Esplanade':'Downtown Toronto Stn A',
                                                 'East TorontoBusiness reply mail Processing Centre969 Eastern':'East Toronto Business',
                                                 'EtobicokeNorthwest':'Etobicoke Northwest','East YorkEast Toronto':'East York/East Toronto',
                                                 'MississaugaCanada Post Gateway Processing Centre':'Mississauga'})
    df
    df.shape
    There are 103 rows and 3 columns in dataset.
 ### Adding Latitude and the Longitude coordinates of each neighborhood. 
    geodata = pd.read_csv("Geospatial_Coordinates.csv")
    geodata
  **Firstly, change the name of the column Postal Code to PostalCode in order to have same name for the common column between datasets**
  
**Secondly, using pandas merge function to add Latitude and Longitude to the main dataset df**
    geodata=geodata.rename(columns={'Postal Code':'PostalCode'})
    df= pd.merge(df,geodata,on='PostalCode')
    df.head()
**Checking if the merging is correct, it can be seen taht Latitude and Longitude of M5G Postal Code are same in both datasets**
    print( df[df['PostalCode']=='M5G'])
    print(geodata[geodata['PostalCode']=='M5G'])
### Using Geopy Library to get latitude and longitude values of Toronto
    address = 'Toronto, Ontario'
    geolocator = Nominatim(user_agent="toronto_explorer")
    location = geolocator.geocode(address)
    latitude = location.latitude
    longitude = location.longitude
    print('The geograpical coordinate of Toronto are {}, {}.'.format(latitude, longitude))
# Map of Toronto
    map_toronto = folium.Map(location=[latitude, longitude], zoom_start=12)
    
    for lat, lng, borough, neighborhood in zip(df['Latitude'], df['Longitude'], df['Borough'], df['Neighborhood']):
        label = '{}, {}'.format(neighborhood, borough)
        label = folium.Popup(label, parse_html=True)
        folium.CircleMarker(
            [lat, lng],
            radius=5,
            popup=label,
            color='blue',
            fill=True,
            fill_color='#3186cc',
            fill_opacity=0.7,
            parse_html=False).add_to(map_toronto)  
        
    map_toronto
### Filtering for Borough includes Toronto
    toronto_data =  df[df['Borough'].str.contains("Toronto")]
    toronto_data.head()
### Map of filtered data (Boroughs include Toronto--center)
    map_toronto = folium.Map(location=[latitude, longitude], zoom_start=11)
  
# add markers to map
    for lat, lng, label in zip(toronto_data['Latitude'], toronto_data['Longitude'], toronto_data['Neighborhood']):
        label = folium.Popup(label, parse_html=True)
        folium.CircleMarker(
            [lat, lng],
            radius=5,
            popup=label,
            color='blue',
            fill=True,
            fill_color='#3186cc',
            fill_opacity=0.7,
            parse_html=False).add_to(map_toronto)  
      
    map_toronto
          CLIENT_ID = 'NY5GVWOPLWYA4EJNZLIKNYI14RV1SQHJMFZN2JDS5H0AYHP1' # your Foursquare ID
          CLIENT_SECRET = 'S5SGMCXEI5GB10OXX50XHI04RKNQBPELSGXPKRHSBN4K1OGA' # your Foursquare Secret
          VERSION = '20180605' # Foursquare API version
          LIMIT = 100 # A default Foursquare API limit value
  ### Function that gets venues in Toronto within a radius of 500 meters
    def getNearbyVenues(names, latitudes, longitudes, radius=500):
      
      venues_list=[]
      for name, lat, lng in zip(names, latitudes, longitudes):
          print(name)
              
          # create the API request URL
          url = 'https://api.foursquare.com/v2/venues/explore?&client_id={}&client_secret={}&v={}&ll={},{}&radius={}&limit={}'.format(
              CLIENT_ID, 
              CLIENT_SECRET, 
              VERSION, 
              lat, 
              lng, 
              radius, 
              LIMIT)
              
          # make the GET request
          results = requests.get(url).json()["response"]['groups'][0]['items']
          
          # return only relevant information for each nearby venue
          venues_list.append([(
              name, 
              lat, 
              lng, 
              v['venue']['name'], 
              v['venue']['location']['lat'], 
              v['venue']['location']['lng'],  
              v['venue']['categories'][0]['name']) for v in results])
  
      nearby_venues = pd.DataFrame([item for venue_list in venues_list for item in venue_list])
      nearby_venues.columns = ['Neighborhood', 
                    'Neighborhood Latitude', 
                    'Neighborhood Longitude', 
                    'Venue', 
                    'Venue Latitude', 
                    'Venue Longitude', 
                    'Venue Category']
      
      return(nearby_venues)
    toronto_venues = getNearbyVenues(names=toronto_data['Neighborhood'],
                                       latitudes=toronto_data['Latitude'],
                                       longitudes=toronto_data['Longitude']
                                      )
    print(toronto_venues.shape)
    toronto_venues.head()
    toronto_venues.groupby('Neighborhood').count()
    print('There are {} uniques categories.'.format(len(toronto_venues['Venue Category'].unique())))
  ## Analyzing Neighborhoods
  Creating dummies to look at what is in these neighbourhoods
  # one hot encoding
    toronto_onehot = pd.get_dummies(toronto_venues[['Venue Category']], prefix="", prefix_sep="")
    toronto_onehot['Neighborhood'] = toronto_venues['Neighborhood'] 
  # move neighborhood column to the first column
    fixed_columns = [toronto_onehot.columns[-1]] + list(toronto_onehot.columns[:-1])
    toronto_onehot = toronto_onehot[fixed_columns]
    
    toronto_onehot.head()
    toronto_grouped = toronto_onehot.groupby('Neighborhood').mean().reset_index()
    toronto_grouped
    print(toronto_grouped.shape)
  ### Checking Top 5 venues in each neighborhood by looking at frequencies
    num_top_venues = 5
    
    for hood in toronto_grouped['Neighborhood']:
        print("----"+hood+"----")
        temp = toronto_grouped[toronto_grouped['Neighborhood'] == hood].T.reset_index()
        temp.columns = ['venue','freq']
        temp = temp.iloc[1:]
        temp['freq'] = temp['freq'].astype(float)
        temp = temp.round({'freq': 2})
        print(temp.sort_values('freq', ascending=False).reset_index(drop=True).head(num_top_venues))
        print('\n')
  ### Function that gives top 5 venues in each neighborhood
    def return_most_common_venues(row, num_top_venues):
        row_categories = row.iloc[1:]
        row_categories_sorted = row_categories.sort_values(ascending=False)
        
        return row_categories_sorted.index.values[0:num_top_venues]
    ### Turning this information into a dataset
    num_top_venues = 10
    
    indicators = ['st', 'nd', 'rd']
  
  # create columns according to number of top venues
    columns = ['Neighborhood']
    for ind in np.arange(num_top_venues):
        try:
            columns.append('{}{} Most Common Venue'.format(ind+1, indicators[ind]))
        except:
            columns.append('{}th Most Common Venue'.format(ind+1))
  
  # create a new dataframe
    neighborhoods_venues_sorted = pd.DataFrame(columns=columns)
    neighborhoods_venues_sorted['Neighborhood'] = toronto_grouped['Neighborhood']
  
  for ind in np.arange(toronto_grouped.shape[0]):
        neighborhoods_venues_sorted.iloc[ind, 1:] = return_most_common_venues(toronto_grouped.iloc[ind, :], num_top_venues)
  
    neighborhoods_venues_sorted.head()
  # Clustering Neighborhoods
  # set number of clusters
    kclusters = 5
  
  toronto_grouped_clustering = toronto_grouped.drop('Neighborhood', 1)
  
  # run k-means clustering
    kmeans = KMeans(n_clusters=kclusters, random_state=0).fit(toronto_grouped_clustering)
  
  # check cluster labels generated for each row in the dataframe
    kmeans.labels_[0:10] 
  ### Merging datasets
    neighborhoods_venues_sorted.insert(0, 'Cluster Labels', kmeans.labels_)
    toronto_merged = toronto_data
    toronto_merged = toronto_merged.join(neighborhoods_venues_sorted.set_index('Neighborhood'), on='Neighborhood')
  
  toronto_merged.head() 
  # Cluster Map
  There are a lot of similar neighborhoods which is seen in purple. In addition, there are few different ones which are blue,yellow and red. This means that most of the neighborhoods are same in terms of venues. If I want to choose one, I should look at the location of office and venues which I most like specifiaclly.
    map_clusters = folium.Map(location=[latitude, longitude], zoom_start=11)
  
  # set color scheme for the clusters
    x = np.arange(kclusters)
    ys = [i + x + (i*x)**2 for i in range(kclusters)]
    colors_array = cm.rainbow(np.linspace(0, 1, len(ys)))
    rainbow = [colors.rgb2hex(i) for i in colors_array]
  
  # add markers to the map
    markers_colors = []
    for lat, lon, poi, cluster in zip(toronto_merged['Latitude'], toronto_merged['Longitude'], toronto_merged['Neighborhood'], toronto_merged['Cluster Labels']):
        label = folium.Popup(str(poi) + ' Cluster ' + str(cluster), parse_html=True)
        folium.CircleMarker(
            [lat, lon],
            radius=5,
            popup=label,
            color=rainbow[cluster-1],
            fill=True,
            fill_color=rainbow[cluster-1],
            fill_opacity=0.7).add_to(map_clusters)
         
  map_clusters
  # Examining Clusters
  ### Cluster 1
    toronto_merged.loc[toronto_merged['Cluster Labels'] == 0, toronto_merged.columns[[1] + list(range(5, toronto_merged.shape[1]))]]
  ### Cluster 2
    toronto_merged.loc[toronto_merged['Cluster Labels'] == 1, toronto_merged.columns[[1] + list(range(5, toronto_merged.shape[1]))]]
  ### Cluster 3
    toronto_merged.loc[toronto_merged['Cluster Labels'] == 2, toronto_merged.columns[[1] + list(range(5, toronto_merged.shape[1]))]]
  ### Cluster 4
    toronto_merged.loc[toronto_merged['Cluster Labels'] == 3, toronto_merged.columns[[1] + list(range(5, toronto_merged.shape[1]))]]
  ### Cluster 5
    toronto_merged.loc[toronto_merged['Cluster Labels'] == 4, toronto_merged.columns[[1] + list(range(5, toronto_merged.shape[1]))]]
