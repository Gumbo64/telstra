import json

# Open and read the JSON file
with open('data1.json', 'r') as file:
    data = json.load(file)

# Remove the "distance" field from all entries
for entry in data:
    if 'distance' in entry:
        del entry['distance']

# Write the modified data to a new JSON file
with open('data1_modified.json', 'w') as file:
    json.dump(data, file, indent=4)



