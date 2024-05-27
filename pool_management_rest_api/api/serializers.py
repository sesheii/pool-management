from rest_framework import serializers
from .models import PoolUser, Subscription, SubscriptionType, Checkin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class SubscriptionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionType
        fields = ['id', 'name', 'daily_price', 'start_time', 'end_time']

class SubscriptionSerializer(serializers.ModelSerializer):
    subscription_type = SubscriptionTypeSerializer()

    class Meta:
        model = Subscription
        fields = ['id', 'subscription_type', 'price', 'start_date', 'end_date']

class PoolUserSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(required=False)

    class Meta:
        model = PoolUser
        fields = ['id', 'first_name', 'last_name', 'email', 'age', 'subscription']

class CheckinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkin
        fields = ['id', 'user']

