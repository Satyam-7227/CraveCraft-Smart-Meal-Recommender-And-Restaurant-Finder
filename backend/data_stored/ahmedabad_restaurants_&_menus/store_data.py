import pandas as pd
from models.user_model import restaurant_data,menu_data

restaurant_df = pd.read_csv('data_stored/fixed_all_ahmedabad_swiggy_restaurants_310_No_Lat_Lag.csv',  encoding='latin1')
menu_df = pd.read_csv('data_stored/fixed_all_ahmedabad_swiggy_restaurants_310_menus.csv',  encoding='latin1')

restaurant_data.insert_many(restaurant_df.to_dict(orient="records"))
menu_data.insert_many(menu_df.to_dict(orient="records"))