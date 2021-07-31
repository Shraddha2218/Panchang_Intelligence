from django.db import models

# Create your models here.


class ContactUs(models.Model):
    name = models.CharField(max_length=30)
    email = models.EmailField()
    description = models.TextField()
    type = models.TextField(default="Feedback")
