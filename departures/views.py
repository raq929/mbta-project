import csv
import requests
from django.http import JsonResponse

# Create your views here.
from django.views import View


class DeparturesView(View):
  def get(self, request):
    r = requests.get('http://developer.mbta.com/lib/gtrtfs/Departures.csv')
    decoded_content = r.content.decode('utf-8')
    cr = csv.DictReader(decoded_content.splitlines(), delimiter=',')
    data_list = list(cr)

    return JsonResponse({ 'departures': data_list })
