# Generated by Django 3.2 on 2021-07-01 00:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0024_auto_20210701_0007'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagetag',
            name='citation',
            field=models.TextField(default='Freepik'),
            preserve_default=False,
        ),
    ]