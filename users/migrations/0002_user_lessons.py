# Generated by Django 3.2 on 2021-06-17 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0008_alter_sectionnode_z_position'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='lessons',
            field=models.ManyToManyField(to='rooms.Lesson'),
        ),
    ]
