# Generated by Django 3.2 on 2021-11-13 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ChoiceSentence',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentence', models.CharField(max_length=650)),
                ('hidden_query', models.CharField(max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='Completion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentence', models.CharField(max_length=650)),
                ('choices', models.ManyToManyField(blank=True, related_name='nlp_sentence_choices', to='atlahua.ChoiceSentence')),
            ],
        ),
        migrations.CreateModel(
            name='Query',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.CharField(max_length=250)),
                ('completions', models.ManyToManyField(blank=True, related_name='nlp_completion', to='atlahua.Completion')),
            ],
        ),
    ]
