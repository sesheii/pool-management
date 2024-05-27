from datetime import time
from django.db import models


class SubscriptionType(models.Model):
    name = models.CharField(max_length=50)
    daily_price = models.IntegerField()
    start_time = models.TimeField(default=time(0, 0)) 
    end_time = models.TimeField(default=time(0, 0))

    def __str__(self):
        return self.name

class Subscription(models.Model):
    subscription_type = models.ForeignKey(SubscriptionType, on_delete=models.CASCADE)
    price = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField()

class PoolUser(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    age = models.IntegerField()
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, null=True, blank=True)

class Checkin(models.Model):
    user = models.ForeignKey(PoolUser, on_delete=models.CASCADE)
    checkin_time = models.DateTimeField()
    checkout_time = models.DateTimeField(null=True)
