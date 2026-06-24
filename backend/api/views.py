from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime

devices = {}

@api_view(['POST'])
def update_data(request):

    device_id = request.data.get("device_id")

    data = dict(request.data)

    data["last_seen"] = datetime.now().timestamp()

    devices[device_id] = data

    return Response({
        "message": "updated"
    })


@api_view(['GET'])
def latest_data(request):

    current_time = datetime.now().timestamp()

    output = []

    for device in devices.values():

        age = current_time - device["last_seen"]

        device_copy = dict(device)

        device_copy["online"] = age < 10

        device_copy["last_seen_seconds"] = int(age)


        output.append(device_copy)

    return Response(output)