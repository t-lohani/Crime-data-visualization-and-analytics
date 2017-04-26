import json

from bson import json_util
from flask import Flask
from flask import render_template
from pymongo import MongoClient

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'crime_db'
CRIME_DATA_COLLECTION = 'crime_data'
CRIME_YEAR_COLLECTION = 'crime_year'
CRIME_ANALYSIS_COLLECTION = 'test'

DATA_FIELDS = {'COUNTY_NAME': True, 'MURDER': True, 'RAPE': True, 'ROBBERY': True, 'AGASSLT': True, 'BURGLRY': True, 'LARCENY': True, 'MVTHEFT': True, 'ARSON': True, 'POPULATION': True, 'FIPS_ST': True, 'FIPS_CTY': True, 'FIPS_COUNTY': True, '_id': False}
YEAR_FIELDS = {'State Abbr': True, 'Year': True, 'Crime Solved': True, 'Victim Sex': True, 'Victim Age': True, 'Victim Race': True, 'Perpetrator Sex': True, 'Perpetrator Age': True, 'Perpetrator Race': True, 'Weapon': True, '_id': False}
ANALYSIS_FIELDS = {'id': True, 'rate': True, '_id': False}

connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
data_collection = connection[DBS_NAME][CRIME_DATA_COLLECTION]
year_collection = connection[DBS_NAME][CRIME_YEAR_COLLECTION]
analysis_collection = connection[DBS_NAME][CRIME_YEAR_COLLECTION]

data_projects = data_collection.find(projection=DATA_FIELDS)
year_projects = year_collection.find(projection=YEAR_FIELDS)
analysis_projects = analysis_collection.find(projection=YEAR_FIELDS)

# for project in projects:
#     print(project)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("dashboard.html")

@app.route("/crime_db/crime_data")
def crime_data():
    json_crime_data = []
    for data in data_projects:
        json_crime_data.append(data)
    json_crime_data = json.dumps(json_crime_data, default=json_util.default)
    connection.close()
    return json_crime_data

@app.route("/crime_db/crime_year")
def crime_year():
    json_crime_year = []
    for data in year_projects:
        json_crime_year.append(data)
    json_crime_year = json.dumps(json_crime_year, default=json_util.default)
    connection.close()
    return json_crime_year

@app.route("/crime_db/crime_analysis")
def crime_analysis():
    json_crime_analytics = []
    for data in analysis_projects:
        json_crime_analytics.append(data)
    json_crime_analytics = json.dumps(json_crime_analytics, default=json_util.default)
    connection.close()
    return json_crime_analytics

@app.route("/crime_analysis/2015")
def crime_analysis_home():
    return render_template("crime_analysis.html")

if __name__ == "__main__":
    app.run('localhost', '5050')