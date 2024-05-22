from django.shortcuts import render
from rest_framework.views import APIView
from .models import PoolUser
from .serializers import PoolUserSerializer
from rest_framework.response import Response


class PoolUserView(APIView):
    def get(self, request):
        users = PoolUser.objects.all()
        serializer = PoolUserSerializer(users, many=True)
        return Response(serializer.data)


class ValidateLogin(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')


        if username == 'admin' and password == 'password':
            return Response({'message': 'Успішний вхід'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Невірні дані для входу'}, status=status.HTTP_401_UNAUTHORIZED)