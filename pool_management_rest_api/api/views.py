from django.shortcuts import render
from rest_framework.views import APIView
from .models import PoolUser
from .serializers import PoolUserSerializer
from rest_framework.response import Response

# class PoolUserView(APIView):
#     def get(self, request):
#         # users = PoolUser.objects.all()
#         # serializer = PoolUserSerializer(users, many=True)
#         # return Response(serializer.data)
#         output = [
#             {
#                 'name': name,
#                 'email': phone_number,
#             } for output in PoolUser.objects.all()
#         ]
#         return Response(output)



class PoolUserView(APIView):
    def get(self, request):
        users = PoolUser.objects.all()
        serializer = PoolUserSerializer(users, many=True)
        return Response(serializer.data)
