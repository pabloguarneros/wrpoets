# Generated by Django 3.2 on 2021-06-30 21:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0022_auto_20210630_1935'),
    ]

    operations = [
        migrations.AddField(
            model_name='nodeimages',
            name='is_public',
            field=models.BooleanField(default=1),
        ),
    ]
