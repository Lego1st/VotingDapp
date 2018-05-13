from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse, HttpResponseServerError, FileResponse, HttpResponseNotFound
from .models import *
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django import forms

# Create your views here.

class ImageUploadForm(forms.Form):
    image = forms.ImageField()

@csrf_exempt
def create_poll(request):

    name = request.POST.get('name')
    description = request.POST.get('description')
    display_name = request.POST.get('display_name', name)

    if(name == None or name == ''):
        return JsonResponse({'message': 'Missing name field'})
    
    if(display_name == ''):
        display_name = name
    
    if(Poll.objects.filter(pk=name).count() > 0):
        return JsonResponse({'message':"Poll's name already exists"})
    else:
        try:
            Poll.objects.create(name=name, description=description, display_name=display_name)
            return JsonResponse({'message': 'ok'})
        except e:
            return JsonResponse({'message': 'Cannot create poll'})

@csrf_exempt
def create_proposal(request):

    # print(request.POST)
    # print(request.FILES)

    address = request.POST.get('address')
    poll_name = request.POST.get('poll_name')
    name = request.POST.get('name')
    support_address = request.POST.get('support_address')
    description = request.POST.get('description')
    date_of_birth = request.POST.get('date_of_birth')
    party = request.POST.get('party')
    image = None
    form = ImageUploadForm(request.POST, request.FILES)
    if form.is_valid():
        image = form.cleaned_data['image']
    else:
        pass

    
    if(address == None or address == ''):
        return JsonResponse({'message':"Missing address field"})

    if(name == None or name == ''):
        return JsonResponse({'message':"Missing name field"})
    
    if(poll_name != None and poll_name != ''):
        try:
            poll = Poll.objects.get(pk=poll_name)
        except Poll.DoesNotExist:
            return JsonResponse({'message': 'Poll does not exist'})
    else:
        poll = None

    if(support_address != None and support_address != ''):
        try:
            support_for = Proposal.objects.get(pk=support_address)
        except Proposal.DoesNotExist:
            return JsonResponse({'message': 'Proposal does not exist'})
    else:
        support_for = None

    if(date_of_birth != None and date_of_birth != ''):
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%B/%d/%Y')
        except ValueError:
            return JsonResponse({'message': 'Wrong date format'})
    else:
        date_of_birth = None

    if(Proposal.objects.filter(pk=address).count() > 0):
        return JsonResponse({'message':"Proposal's address already exists"})
    else:
        # try:
        Proposal.objects.create(address=address, name=name, poll=poll, supportFor=support_for, description=description, date_of_birth=date_of_birth, party=party, image=image)
        return JsonResponse({'message':'ok'})
        # except :
        #     return HttpResponseServerError('Cannot create new proposal', content_type='text/plain')

@csrf_exempt
def get_proposal(request):
    # print(request.POST)
    address = request.POST.get('address')
    if(address == None):
        return JsonResponse({'message': "Missing address"})
    
    try:
        proposal = Proposal.objects.get(pk=address)
    except Proposal.DoesNotExist:
        return JsonResponse({'message': 'Proposal does not exist'})
    return JsonResponse({'message': 'ok', 'data': proposal.to_json()})

@csrf_exempt
def get_poll(request):
    name = request.POST.get('name')
    if(name == None):
        return JsonResponse({'message':"Missing name"})

    try:
        poll = Poll.objects.get(pk=name)
    except Poll.DoesNotExist:
        return JsonResponse({'message': 'Poll does not exist'})
    return JsonResponse({'message': 'ok', 'data': poll.to_json()})

@csrf_exempt
def get_all_poll(request):
    all_poll = Poll.objects.all();
    return JsonResponse({'message': 'ok', 'data': [poll.to_json() for poll in all_poll]}, safe=False)

@csrf_exempt
def update_proposal(request):

    address = request.POST.get('address')
    poll_name = request.POST.get('poll_name')
    name = request.POST.get('name')
    support_address = request.POST.get('support_address')
    avatar = request.POST.get('avatar')
    description = request.POST.get('description')
    date_of_birth = request.POST.get('date_of_birth')
    party = request.POST.get('party')

    
    if(address == None or address == ''):
        return JsonResponse({'message': "Missing address field"})
    
    if(poll_name != None and poll_name != ''):
        try:
            poll = Poll.objects.get(pk=poll_name)
        except Poll.DoesNotExist:
            return JsonResponse({'message': 'Poll does not exist'})
    else:
        poll = None
    
    if(support_address != None and support_address != ''):
        try:
            support_for = Proposal.objects.get(pk=support_address)
        except Proposal.DoesNotExist:
            return JsonResponse({'message': 'Proposal does not exist'})
    else:
        support_for = None
        
    if(date_of_birth != None and date_of_birth != ''):
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%B/%d/%Y')
        except ValueError:
            return JsonResponse({"message": 'Wrong date format'})
    
    try:
        proposal = Proposal.objects.get(pk=address)
    except Proposal.DoesNotExist:
        return JsonResponse({'message': 'Proposal does not exist'})
    if(name != None and name != ''):
        proposal.name = name
    if(poll != None):
        proposal.poll = poll
    if(support_for != None):
        proposal.supportFor = support_for
    if(description != None and description != ''):
        proposal.description = description
    if(date_of_birth != None and date_of_birth != ''):
        proposal.date_of_birth = date_of_birth
    if(party != None and party != ''):
        proposal.party = party
    proposal.save()
    
    return JsonResponse({'message': 'ok'})

@csrf_exempt
def update_poll(request):

    name = request.POST.get('name')
    description = request.POST.get('description')
    display_name = request.POST.get('display_name', name)
    
    if(name == None or name == ''):
        return JsonResponse({'message':"Missing name field"})

    try:
        poll = Poll.objects.get(pk=name)
    except Poll.DoesNotExist:
        return JsonResponse({'message': 'Poll does not exist'})
    if(description != None and description != ""):
        poll.description = description
    if(display_name != None and display_name != ""):
        poll.display_name = display_name
    poll.save()
    return JsonResponse({'message': 'ok'})

@csrf_exempt
def get_list_proposals(request):

    poll_name = request.POST.get('poll_name')
    if(poll_name == None or poll_name == ''):
        return JsonResponse({'message': "Missing poll's name"})
    
    poll = get_object_or_404(Poll, pk=poll_name)
    proposal_list = poll.proposal_set.all()

    json = {'display_name': poll.display_name}
    proposal_list_json = []
    for proposal in proposal_list:
        proposal_list_json.append(proposal.to_json())
    json['proposal_list'] = proposal_list_json
    
    return JsonResponse({'message': 'ok', 'data': json}, safe=False)

@csrf_exempt
def update_image(request):
    address = request.POST.get('address')
    form = ImageUploadForm(request.POST, request.FILES)
    if form.is_valid():
        image = form.cleaned_data['image']
    else:
        return JsonResponse({'message': 'Image fail'})

    p = get_object_or_404(Proposal, pk=address)
    try:
        p = Proposal.objects.get(pk=address)
    except Proposal.DoesNotExist:
        return JsonResponse({'message': 'Proposal does not exist'})
    p.image = image
    p.save()

    return JsonResponse({'message': 'ok'})

@csrf_exempt
def get_image(request):
    proposal_address = request.POST.get('address')
    if(proposal_address == None or proposal_address == ''):
        return JsonResponse({'message': 'Missing address field'})
    try:
        proposal = Proposal.objects.get(pk=proposal_address)
    except Proposal.DoesNotExist:
        return JsonResponse({'message': 'Proposal does not exist'})
    try:
        image_path = proposal.image.path
    except ValueError:
        return JsonResponse({'message': "Image doesn't exist"})
    image_file = open(image_path, 'rb').read()
    return HttpResponse(image_file, content_type="image/png")

@csrf_exempt
def get_image_url(request, address):

    try:
        proposal = Proposal.objects.get(pk=address)
    except:
        return JsonResponse({"message": "Proposal does not exist"})
    try:
        image_path = proposal.image.path
    except ValueError:
        return JsonResponse({"message": "Image doesn't exist"})
    image_file = open(image_path, 'rb').read()
    return HttpResponse(image_file, content_type="image/png")

