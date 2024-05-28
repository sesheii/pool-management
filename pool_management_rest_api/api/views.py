from datetime import datetime
from django.shortcuts import render
from rest_framework.views import APIView
from .models import Checkin, PoolUser, Subscription, SubscriptionType
from .serializers import CheckinSerializer, PoolUserSerializer, SubscriptionSerializer, SubscriptionTypeSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User, Group


class GetUsernameView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({'username': user.username})


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
    

class CreateSubscriptionType(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubscriptionTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListSubscriptionTypes(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription_types = SubscriptionType.objects.all()
        serializer = SubscriptionTypeSerializer(subscription_types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteSubscriptionType(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            subscription_type = SubscriptionType.objects.get(pk=pk)
            subscription_type.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SubscriptionType.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class UpdateSubscriptionView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, email):
        user = get_object_or_404(PoolUser, email=email)
        subscription_type_id = request.data.get('subscription_type_id')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        subscription_type = get_object_or_404(SubscriptionType, id=subscription_type_id)

        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        duration_days = (end_date_obj - start_date_obj).days

        price = subscription_type.daily_price * duration_days

        subscription, created = Subscription.objects.update_or_create(
            id=user.subscription.id if user.subscription else None,
            defaults={
                'subscription_type': subscription_type,
                'price': price,
                'start_date': start_date_obj,
                'end_date': end_date_obj
            }
        )

        user.subscription = subscription
        user.save()

        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CheckedInUsersCount(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        checked_in_users_count = Checkin.objects.filter(checked_in=True).count()
        return Response({'checked_in_users_count': checked_in_users_count})


class CheckUserCheckinStatus(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.query_params.get('email', None)
        if not email:
            return Response({'error': 'Email is required'}, status=400)

        try:
            user = PoolUser.objects.get(email=email)
        except PoolUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=404)

        try:
            checkin_status = Checkin.objects.get(user=user).checked_in
        except Checkin.DoesNotExist:
            checkin_status = False

        return Response({'email': email, 'checked_in': checkin_status})


class ToggleUserCheckinStatus(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.data.get('email', None)
        if not email:
            return Response({'error': 'Email is required'}, status=400)

        try:
            user = PoolUser.objects.get(email=email)
        except PoolUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=404)

        try:
            checkin_instance = Checkin.objects.get(user=user)
            checkin_instance.checked_in = not checkin_instance.checked_in
            checkin_instance.save()
        except Checkin.DoesNotExist:
            Checkin.objects.create(user=user, checked_in=True)

        return Response({'message': 'Checkin status updated successfully'})


class UserGroupsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        groups = Group.objects.filter(user=user)
        group_names = [group.name for group in groups]
        return Response(group_names, status=status.HTTP_200_OK)


class CreateUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                password=data['password']
            )
            return Response({'message': 'Користувач успішно створений!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
