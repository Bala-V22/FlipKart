# Generated by Django 4.1.5 on 2023-09-01 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("project", "0005_cartitem"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="username",
            field=models.CharField(max_length=150),
        ),
    ]
