# Generated by Django 5.0.6 on 2024-05-27 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_subscription_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscriptiontype',
            name='daily_price',
            field=models.IntegerField(default=30),
            preserve_default=False,
        ),
    ]
