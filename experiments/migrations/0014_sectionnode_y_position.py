# Generated by Django 3.2 on 2021-06-24 23:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0013_alter_sectionnode_squishy'),
    ]

    operations = [
        migrations.AddField(
            model_name='sectionnode',
            name='y_position',
            field=models.IntegerField(default=150),
        ),
    ]
