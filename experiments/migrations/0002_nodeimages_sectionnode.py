# Generated by Django 3.2 on 2021-06-17 03:09

from django.db import migrations, models
import experiments.models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='NodeImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=experiments.models.png_directory_path)),
            ],
        ),
        migrations.CreateModel(
            name='SectionNode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=60)),
                ('description', models.TextField()),
                ('x_position', models.IntegerField(default=0)),
                ('z_position', models.IntegerField(default=-20)),
                ('images', models.ManyToManyField(to='experiments.NodeImages')),
            ],
        ),
    ]
