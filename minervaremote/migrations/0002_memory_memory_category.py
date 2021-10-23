# Generated by Django 3.2 on 2021-10-23 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('minervaremote', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='memory',
            name='memory_category',
            field=models.IntegerField(choices=[(1, 'Farming'), (2, 'Pet')], default=1, null=True),
        ),
    ]
