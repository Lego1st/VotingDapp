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
        return HttpResponseBadRequest("Missing name field", content_type='text/plain')
    
    if(display_name == ''):
        display_name = name
    
    if(Poll.objects.filter(pk=name).count() > 0):
        return HttpResponseBadRequest("Poll's name already exists", content_type='text/plain')
    else:
        try:
            Poll.objects.create(name=name, description=description, display_name=display_name)
            return HttpResponse('Poll created: {}'.format(name), content_type='text/plain')
        except e:
            return HttpResponseServerError('Cannot create new poll', content_type='text/plain')

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
        print(image)
    else:
        HttpResponseBadRequest("image fail")

    
    if(address == None or address == ''):
        return HttpResponseBadRequest("Missing address field", content_type='text/plain')
    if(name == None or name == ''):
        return HttpResponseBadRequest("Missing name field", content_type='text/plain')
    
    if(poll_name != None and poll_name != ''):
        poll = get_object_or_404(Poll, pk=poll_name)
    else:
        poll = None

    if(support_address != None and support_address != ''):
        support_for = get_object_or_404(Proposal, pk=support_address)
    else:
        support_for = None
    if(date_of_birth != None and date_of_birth != ''):
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%B/%d/%Y')
        except ValueError:
            return HttpResponseBadRequest("Wrong date format", content_type='text/plain')
    else:
        date_of_birth = None

    if(Proposal.objects.filter(pk=address).count() > 0):
        return HttpResponseBadRequest("Proposal's address already exists", content_type='text/plain')
    else:
        # try:
        Proposal.objects.create(address=address, name=name, poll=poll, supportFor=support_for, description=description, date_of_birth=date_of_birth, party=party, image=image)
        return JsonResponse({'message':'Proposal created: {}, {}'.format(address, name)})
        # except :
        #     return HttpResponseServerError('Cannot create new proposal', content_type='text/plain')

@csrf_exempt
def get_proposal(request):
    # print(request.POST)
    address = request.POST.get('address')
    if(address == None):
        return HttpResponseBadRequest("Missing address", content_type='text/plain')
    
    proposal = get_object_or_404(Proposal, pk=address)
    return JsonResponse(proposal.to_json())

@csrf_exempt
def get_poll(request):
    name = request.POST.get('name')
    if(name == None):
        return HttpResponseBadRequest("Missing name", content_type='text/plain')

    poll = get_object_or_404(Poll, pk=name)
    return JsonResponse(poll.to_json())

@csrf_exempt
def get_all_poll(request):
    all_poll = Poll.objects.all();
    poll_list = {'poll_list' : [poll.to_json() for poll in all_poll]}
    return JsonResponse(poll_list)

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

    
    if(address == None or address != ''):
        return HttpResponseBadRequest("Missing address field", content_type='text/plain')
    
    if(poll_name != None or poll_name != ''):
        poll = get_object_or_404(Poll, pk=poll_name)
    else:
        poll = None
    
    if(support_address != None or poll_name != ''):
        support_for = get_object_or_404(Proposal, pk=support_address)
    else:
        support_for = None
    if(date_of_birth != None and date_of_birth != ''):
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%B/%d/%Y')
        except ValueError:
            return HttpResponseBadRequest("Wrong date format", content_type='text/plain')
    
    proposal = get_object_or_404(Proposal, pk=address)
    
    if(name != None or name != ''):
        proposal.name = name
    if(poll != None):
        proposal.poll = poll
    if(support_for != None):
        proposal.supportFor = support_for
    if(description != None or description != ''):
        proposal.description = description
    if(date_of_birth != None or description != ''):
        proposal.date_of_birth = date_of_birth
    if(party != None or description != ''):
        proposal.party = party
    proposal.save()
    
    return HttpResponse("Updated proposal {}".format(address), content_type='text/plain')

@csrf_exempt
def update_poll(request):

    name = request.POST.get('name')
    description = request.POST.get('description')
    display_name = request.POST.get('display_name', name)
    
    if(name == None):
        return HttpResponseBadRequest("Missing name field", content_type='text/plain')

    poll = get_object_or_404(Poll, pk=name)
    if(description != None):
        poll.description = description
    if(display_name != None):
        poll.display_name = display_name
    poll.save()
    return HttpResponse("Updated poll {}".format(name), content_type='text/plain')

@csrf_exempt
def get_list_proposals(request):

    poll_name = request.POST.get('poll_name')
    if(poll_name == None):
        return HttpResponseBadRequest("Missing poll's name", content_type='text/plain')
    
    poll = get_object_or_404(Poll, pk=poll_name)
    proposal_list = poll.proposal_set.all()

    json = {'display_name': poll.display_name}
    proposal_list_json = []
    for proposal in proposal_list:
        proposal_list_json.append(proposal.to_json())
    json['proposal_list'] = proposal_list_json
    
    return JsonResponse(json, safe=False)

@csrf_exempt
def update_image(request):
    address = request.POST.get('address')
    form = ImageUploadForm(request.POST, request.FILES)
    if form.is_valid():
        image = form.cleaned_data['image']
    else:
        HttpResponseBadRequest("image fail", content_type='text/plain')

    p = get_object_or_404(Proposal, pk=address)
    p.image = image
    p.save()

    return HttpResponse("Updated proposal's image {}".format(address), content_type='text/plain')

@csrf_exempt
def get_image(request):
    proposal_address = request.POST.get('address')
    if(proposal_address == None):
        return HttpResponseBadRequest("Missing proposal's address")
    proposal = get_object_or_404(Proposal, pk=proposal_address)
    try:
        image_path = proposal.image.path
    except ValueError:
        return HttpResponseNotFound("Image doesn't exist", content_type='text/plain')
    image_file = open(image_path, 'rb').read()
    return HttpResponse(image_file, content_type="image/png")

@csrf_exempt
def get_image_url(request, address):

    proposal = get_object_or_404(Proposal, pk=address)
    try:
        image_path = proposal.image.path
    except ValueError:
        return HttpResponseNotFound("Image doesn't exist", content_type='text/plain')
    image_file = open(image_path, 'rb').read()
    return HttpResponse(image_file, content_type="image/png")

