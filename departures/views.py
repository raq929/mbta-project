import csv
import requests
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
            print(data_list[0]['TimeStamp'])
            return JsonResponse({
                    'departures': data_list,
                    'timeLoaded': data_list[0]['TimeStamp']
                })
        else:
            return JsonResponse(
                {'error': 'Could not load data'},
                status=r.status_code
            )
