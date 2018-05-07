from django.db import models

# Create your models here.

class Poll(models.Model):
    name = models.CharField(max_length=32, primary_key=True, unique=True)
    description = models.CharField(max_length=1024, null=True)
    display_name = models.CharField(max_length=256)
    
    def __str__(self):
        return self.display_name

    def to_json(self):
        json = {
            'name': self.name,
            'description': self.description,
            'display_name': self.display_name
        }

        return json

class Proposal(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.SET_NULL, null=True)
    address = models.CharField(max_length=256, primary_key=True, unique=True)
    name = models.CharField(max_length=256)
    supportFor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='images', null=True)
    description = models.CharField(max_length=1024, null=True)
    date_of_birth = models.DateField('date of birth', null=True)
    party = models.CharField(max_length=256, null=True)
    
    def __str__(self):
        return self.name
    
    def to_json(self):

        json = {
            'address': self.address,
            'poll_name': self.poll.name if(self.poll != None) else None,
            'name': self.name,
            'support_address': self.supportFor.address if(self.supportFor != None) else None,
            'support_name': self.supportFor.name if(self.supportFor != None) else None,
            'description': self.description,
            'date_of_birth': self.date_of_birth.strftime('%B/%d/%Y') if(self.date_of_birth != None) else None,
            'party': self.party
        }

        return json