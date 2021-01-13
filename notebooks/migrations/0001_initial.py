# Generated by Django 2.2 on 2021-01-13 01:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notebook',
            fields=[
                ('id', models.SlugField(max_length=15, primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=64)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date_modified', '-date_created', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.SlugField(max_length=15, primary_key=True, serialize=False)),
                ('title', models.CharField(default='', max_length=256)),
                ('content', models.TextField(blank=True, default='')),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('notebook', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='notebooks.Notebook')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-date_modified', '-date_created', 'title'],
            },
        ),
    ]
