# Generated by Django 5.0.6 on 2024-05-27 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_pooluser_age'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='checkin',
            name='checkin_time',
        ),
        migrations.RemoveField(
            model_name='checkin',
            name='checkout_time',
        ),
        migrations.AddField(
            model_name='checkin',
            name='checked_in',
            field=models.BooleanField(default=False),
        ),
    ]
