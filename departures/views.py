import csv
import requests
import time
from django.http import JsonResponse

# Create your views here.
from django.views import View


class DeparturesView(View):
    def get(self, request):
        r = requests.get('http://developer.mbta.com/lib/gtrtfs/Departures.csv')
        if r.status_code == 200:
            decoded_content = r.content.decode('utf-8')
            cr = csv.DictReader(decoded_content.splitlines(), delimiter=',')
            data_list = list(cr)
            if len(data_list) > 0:
                time_loaded = data_list[0]['TimeStamp']
            else:
                # if there are no trains, there is no way to get the date loaded. Pass the current date in the same format (Epoch time as a string)
                time_loaded = str(int(time.time()))

            return JsonResponse({
                    'departures': data_list,
                    'timeLoaded': time_loaded
                })
        else:
            return JsonResponse(
                {'error': 'Could not load data'},
                status=r.status_code
            )
