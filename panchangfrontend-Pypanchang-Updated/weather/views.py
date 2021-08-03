import ssl

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import os
import requests
import yaml
from ephem import *
from datetime import datetime, timedelta
import datetime
from weather.models import ContactUs

a=0
sdate=0
edate=0

a_yaml_file = open(os.path.join(settings.BASE_DIR, 'config', "panchang_data.yaml"))
parsed_yaml_file = yaml.load(a_yaml_file, Loader=yaml.FullLoader)
a_yaml_file.close()

def home(request):
    return render(request,'result.html')


def panchaang_prediction(start_date, end_date, l1, l2):
    today_weather = ""
    result_onday = []
    try:
        url = os.path.join(settings.PANCHANG_API_URL, "panchang_prediction/")
        data = {"start_date": start_date, "end_date": end_date, "lat": l1, "lon": l2}
        # import pdb;pdb.set_trace()
        w_response = requests.post(url, data=data, verify=False)

        # import pdb; pdb.set_trace()
        if w_response.status_code == 200:
            response_data = json.loads(w_response.text)
            today_weather = response_data["today_weather"]
            result_onday = response_data["result_onday"]
        return today_weather, result_onday

    except ValueError as e:
        print(str(e))
        return today_weather, []


def get_weather_data_from_api(lat, lon):
    url = os.path.join(settings.PANCHANG_API_URL, "get_weather_data/")
    data = {"lat": lat, "lon": lon}
    w_response = requests.post(url, data=data, verify=False)

    # import pdb;pdb.set_trace()
    w_data = []
    if w_response.status_code == 200:
        # dt_obj = datetime.datetime.fromtimestamp(1140825600)
        response_data = json.loads(w_response.text)
        w_data = response_data['result']

    return w_data

@csrf_exempt
def search_lat_lng(request):
    # import pdb;pdb.set_trace()
    # data = request.data()
    query = request.POST.get('searchTerm')
    url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q={}".format(query)
    w_reponse = requests.get(url, verify=False)

    result_data = []
    if w_reponse.status_code == 200:
        # dt_obj = datetime.datetime.fromtimestamp(1140825600)
        response_data = json.loads(w_reponse.text)
        # daily_data = response_data['daily']
        if len(response_data)>0:
            for index, each in enumerate(response_data):
                lat_lon = ', '.join([each['lat'], each['lon']])
                result_data.append({"id": lat_lon, 'text': each['display_name']})
            # return lat, lon
    print(json.dumps(result_data))
    print(result_data)
    # result_data = {"data": result_data}
    return JsonResponse(json.dumps(result_data), safe=False)


def get_address_of_lat_lng(lat, lon):
    url = os.path.join(settings.PANCHANG_API_URL, "get_address_from_latlong/")
    data = {"lat": lat, "lon": lon}
    w_response = requests.post(url, data=data)
    # import pdb;pdb.set_trace()
    address = None
    if w_response.status_code == 200:
        # dt_obj = datetime.datetime.fromtimestamp(1140825600)
        response_data = json.loads(w_response.text)
        # daily_data = response_data['daily']
        if len(response_data)>0:
            if 'address' in response_data:
                address = response_data['address']
    return address


def isValidPinCode(pinCode):
    # Regex to check valid pin code
    # of India.
    regex = "^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$";

    # Compile the ReGex
    p = re.compile(regex);

    # If the pin code is empty
    # return false
    if (pinCode == ''):
        return False;

    # Pattern class contains matcher() method
    # to find matching between given pin code
    # and regular expression.
    m = re.match(p, pinCode);

    # Return True if the pin code
    # matched the ReGex else False
    if m is None:
        return False
    else:
        return True


def default_data(request, today):
    # import pdb;pdb.set_trace()
    lat, lon, weather_status, address = None, None, None, None
    panchang_weather_data = []
    w_data = []
    start_date = datetime.datetime.now()
    end_date = start_date + datetime.timedelta(days=7)
    try:
        lat = parsed_yaml_file['default']['lat']
        lon = parsed_yaml_file['default']['lon']

        startdate = start_date.strftime("%m/%d/%Y")
        enddate = end_date.strftime("%m/%d/%Y")
        weather_status, panchang_weather_data = panchaang_prediction(start_date, end_date, lat, lon)
        w_data = get_weather_data_from_api(lat, lon)
        address = get_address_of_lat_lng(lat, lon)

        request.session['session_date'] = today
        request.session['lat'] = lat
        request.session['lon'] = lon
        request.session['startdate'] = startdate
        request.session['enddate'] = enddate
        request.session['weather_status'] = weather_status
        request.session['panchang_weather_data'] = panchang_weather_data
        request.session['w_data'] = w_data
        request.session['address'] = address
        request.session['home_address'] = address

    except Exception as e:
        print(str(e))
    return lat, lon, startdate, enddate, weather_status, address, panchang_weather_data, w_data


def newhome(request):
    # import pdb;pdb.set_trace()
    today = datetime.datetime.now()
    # weather_status = "cloudy"
    if request.method == 'POST':
        # import pdb;pdb.set_trace()
        pincode = request.POST.get('home-input-lat-long', None) #request.POST['home-input-lat-long']
        startdate = request.POST.get('home-start-date')
        enddate = request.POST.get('home-end-date')
        latitute = request.POST.get('home-input-lat', None)
        longitute = request.POST.get('home-input-long', None)
        if latitute and longitute and startdate and enddate:
            # lat, lon = get_lat_lng_from_pincode(pincode)
            lat = float(latitute)
            lon = float(longitute)
            start_date = datetime.datetime.strptime(startdate, "%m/%d/%Y")
            end_date = datetime.datetime.strptime(enddate, "%m/%d/%Y")
            weather_status, panchang_weather_data = panchaang_prediction(start_date, end_date, lat, lon)
            address = get_address_of_lat_lng(lat, lon)
            w_data = get_weather_data_from_api(lat, lon)
            request.session['lat'] = lat
            request.session['lon'] = lon
            request.session['startdate'] = startdate
            request.session['enddate'] = enddate
            # request.session['weather_status'] = weather_status
            request.session['panchang_weather_data'] = panchang_weather_data
            request.session['w_data'] = w_data
            request.session['address'] = address
        elif latitute and longitute:
            lat = float(latitute)
            lon = float(longitute)
            # lat, lon = get_lat_lng_from_pincode(pincode)
            start_date = datetime.datetime.strptime(request.session['startdate'], "%m/%d/%Y")
            end_date = datetime.datetime.strptime(request.session['enddate'], "%m/%d/%Y")
            weather_status, panchang_weather_data = panchaang_prediction(start_date, end_date, lat, lon)
            address = get_address_of_lat_lng(lat, lon)
            w_data = get_weather_data_from_api(lat, lon)

            request.session['lat'] = lat
            request.session['lon'] = lon
            # request.session['weather_status'] = weather_status
            request.session['panchang_weather_data'] = panchang_weather_data
            request.session['w_data'] = w_data
            request.session['address'] = address
        elif startdate and enddate:
            # lat, lon = get_lat_lng_from_pincode(pincode, "%m/%d/%Y")
            start_date = datetime.datetime.strptime(startdate, "%m/%d/%Y")
            end_date = datetime.datetime.strptime(enddate, "%m/%d/%Y")
            weather_status, panchang_weather_data = panchaang_prediction(start_date, end_date, request.session['lat'], request.session['lon'])

            request.session['startdate'] = startdate
            request.session['enddate'] = enddate
            # request.session['weather_status'] = weather_status
            request.session['panchang_weather_data'] = panchang_weather_data
        else:
            pass
        # return render(request, 'home.html',
        #               {'today': today, 'weather_status': weather_status, 'panchang_weather_data': panchang_weather_data,
        #                'w_data': w_data, 'address': address, 'lat': lat, 'lon': lon, 'startdate': startdate, 'enddate': enddate})
    else:
        #import pdb;pdb.set_trace()
        session_date = today.strftime("%m/%d/%Y")
        if 'session_date' not in request.session or not request.session['session_date'] == session_date:
            lat, lon, startdate, enddate, weather_status, address, panchang_weather_data, w_data = default_data(request, session_date)
    return render(request,'home.html',
                  {'today': today.strftime("%m/%d/%Y, %H:%M:%S"), 'weather_status': request.session['weather_status'],
                   'panchang_weather_data': request.session['panchang_weather_data'], 'w_data': request.session['w_data'],
                   'address': request.session['address'], 'lat': request.session['lat'],
                   'lon': request.session['lon'], 'startdate': request.session['startdate'],
                   'enddate': request.session['enddate']})


def about(request):
    return render(request,'About_us.html')


def compare(request):
    return render(request,'compare.html')


def references(request):
    return render(request,'references.html')


def contact(request):
    if request.method == "POST":
        name = request.POST.get('inputName', None)
        email = request.POST.get('inputEmail', None)
        msg = request.POST.get('inputMessage', None)
        type = request.POST.get('inputType',None)

        send_data = ContactUs(name=name, email=email, description=msg, type=type)
        send_data.save()
        print("Data has been saved to database")

    return render(request,'contact.html')


def policy(request):
    return render(request,'policy.html')


