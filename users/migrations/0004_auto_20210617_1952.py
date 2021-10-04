# Generated by Django 3.2 on 2021-06-17 19:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0008_alter_sectionnode_z_position'),
        ('users', '0003_auto_20210617_0822'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='portfolio',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='three_d_portfolio', to='rooms.lesson'),
        ),
        migrations.AlterField(
            model_name='user',
            name='blurb',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='lessons',
            field=models.ManyToManyField(blank=True, to='rooms.Lesson'),
        ),
        migrations.AlterField(
            model_name='user',
            name='linkedin',
            field=models.URLField(blank=True),
        ),
    ]
