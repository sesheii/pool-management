from django.shortcuts import render
from rest_framework.views import APIView
from .models import PoolUser
from .serializers import PoolUserSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password


class PoolUserView(APIView):
    def get(self, request):
        users = PoolUser.objects.all()
        serializer = PoolUserSerializer(users, many=True)
        return Response(serializer.data)


class ValidateLogin(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = get_object_or_404(PoolUser, email=email)

            if check_password(password, user.password):
                # Пароль вірний, логін успішний
                # Тут ви можете створити та повернути токен доступу
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                # Пароль невірний
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except PoolUser.DoesNotExist:
            # Користувач не знайдений
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class CreatePoolUser(APIView):
    def post(self, request):
        serializer = PoolUserSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            # Перевірка на існування користувача з такою ж електронною поштою
            if PoolUser.objects.filter(email=email).exists():
                return Response({"message": "Користувач з такою електронною поштою вже існує"}, status=status.HTTP_400_BAD_REQUEST)

            # Якщо користувача не знайдено, хешуємо пароль та зберігаємо дані
            serializer.validated_data['password'] = make_password(serializer.validated_data['password'])
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import PoolUser
from .serializers import PoolUserSerializer

class PoolUserDetailByEmailView(APIView):
    def get(self, request, email):
        try:
            user = PoolUser.objects.get(email=email)
        except PoolUser.DoesNotExist:
            return Response(
                {"detail": f"Користувач з email '{email}' не знайдений."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PoolUserSerializer(user)
        return Response(serializer.data)
