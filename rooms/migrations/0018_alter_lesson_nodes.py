# Generated by Django 3.2 on 2021-06-30 03:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0017_alter_lesson_nodes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='nodes',
            field=models.ManyToManyField(related_name='lesson_for_nodes', to='rooms.SectionNode'),
        ),
    ]
