import requests
import json
import random

def execute_request(url, headers, data):
    try:
        response = requests.post(url, headers=headers, json=data)
        return response.json()
    except Exception as e:
        return str(e)

# Example usage
url = 'https://tapi.telstra.com/presentation/v1/tcom/geo/payphones/list'
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'source': 'tcom',
    'Origin': 'https://www.telstra.com.au',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Referer': 'https://www.telstra.com.au/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site'
}

class point:
    def __init__(self, latitude, longitude, address, state, postcode, phone_attributes, cabinet_id, fnn, cli, type, icon):
        self.latitude = latitude
        self.longitude = longitude
        self.address = address
        self.state = state
        self.postcode = postcode
        self.phone_attributes = phone_attributes
        self.cabinet_id = cabinet_id
        self.fnn = fnn
        self.cli = cli
        self.type = type
        self.icon = icon
    def __hash__(self):
        return hash((self.latitude, self.longitude, self.address, self.state, self.postcode, self.phone_attributes, self.cabinet_id, self.fnn, self.cli, self.type, self.icon))
    def __eq__(self, other):
        return (self.latitude, self.longitude) == (other.latitude, other.longitude)
    def as_dict(self):
        return {
            "latitude": self.latitude,
            "longitude": self.longitude,
            "address": self.address,
            "state": self.state,
            "postcode": self.postcode,
            "phone_attributes": self.phone_attributes,
            "cabinet_id": self.cabinet_id,
            "fnn": self.fnn,
            "cli": self.cli,
            "type": self.type,
            "icon": self.icon,
        }

points = set()

def lat_lon_generator(lat_start, lat_end, lon_start, lon_end, step):
    lat = lat_start
    while lat <= lat_end:
        lon = lon_start
        while lon <= lon_end:
            yield lat, lon
            lon += step
        lat += step

# Example usage of the generator
lat_start, lat_end = -44, -10
lon_start, lon_end = 112, 154
step = 20  # Adjust the step size as needed

lat_lon_gen = lat_lon_generator(lat_start, lat_end, lon_start, lon_end, step)

for lat, lon in lat_lon_gen:
    print(f"Fetching data for lat: {lat}, lon: {lon}")
    for i in range(0, 10000, 100):
        print(i, len(points))
        data = {
            'point': {'lat': lat, 'lon': lon},
            'radius': 100000000000,
            'pagination': {'size': 100, 'from': i}
        }

        response = execute_request(url, headers, data)
        r_points = response["results"][0]["value"][0]["featureList"]
        p_s = [point(p["latitude"], p["longitude"], p["address"], p["state"], p["postcode"], p["phone_attributes"], p["cabinet_id"], p["fnn"], p["cli"], p["type"], p["icon"]) for p in r_points]
        
        if p_s:
            new_points_found = True
            points.update(p_s)
    

points = [p.as_dict() for p in points]
with open('data.json', 'w') as file:
    json.dump(points, file, indent=4)

