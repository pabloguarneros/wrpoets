# Generated by Django 3.2 on 2021-07-05 06:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0031_lesson_explorable'),
    ]

    operations = [
        migrations.RenameField(
            model_name='lesson',
            old_name='isPublic',
            new_name='public',
        ),
    ]
