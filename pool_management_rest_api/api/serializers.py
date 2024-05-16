from rest_framework import serializers
from .models import PoolUser, Subscription, SubscriptionType, Checkin

class SubscriptionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionType
        fields = ['id', 'name']

class SubscriptionSerializer(serializers.ModelSerializer):
    subscription_type = SubscriptionTypeSerializer()

    class Meta:
        model = Subscription
        fields = ['id', 'subscription_type', 'start_date', 'end_date']

class PoolUserSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer()

    class Meta:
        model = PoolUser
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'age', 'role', 'subscription']

class CheckinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checkin
        fields = ['id', 'user', 'checkin_time', 'checkout_time']
