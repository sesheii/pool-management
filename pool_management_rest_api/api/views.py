from django.shortcuts import render
from rest_framework.views import APIView
from .models import PoolUser
from .serializers import CheckinSerializer, PoolUserSerializer, SubscriptionSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class AllPoolUsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = PoolUser.objects.all()
        serializer = PoolUserSerializer(users, many=True)
        return Response(serializer.data)


class CreatePoolUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PoolUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeletePoolUserByEmail(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, email):
        try:
            user = PoolUser.objects.get(email=email)
        except PoolUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"message": f"User with email {email} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class FilteredPoolUsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.query_params.get('email', None)
        if email:
            users = PoolUser.objects.filter(email__icontains=email)
        else:
            users = PoolUser.objects.all()
        
        serializer = PoolUserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        user = get_object_or_404(PoolUser, email=email)
        user_serializer = PoolUserSerializer(user)
        subscription_serializer = SubscriptionSerializer(user.subscription)
        checkins = user.checkin_set.all()
        checkin_serializer = CheckinSerializer(checkins, many=True)

        data = {
            'user': user_serializer.data,
            'subscription': subscription_serializer.data,
            'checkins': checkin_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)