# Generated by Django 3.2 on 2021-06-24 23:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0012_auto_20210622_0629'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sectionnode',
            name='squishy',
            field=models.IntegerField(default=46),
        ),
    ]
