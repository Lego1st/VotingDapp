from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse, HttpResponseServerError
from .models import *
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def create_poll(request):

    name = request.POST.get('name')
    description = request.POST.get('description')
    display_name = request.POST.get('display_name', name)
    
    if(name == None):
        return HttpResponseBadRequest("Missing name field")

    if(Poll.objects.filter(pk=name).count() > 0):
        return HttpResponseBadRequest("Poll's name already exists")
    else:
        try:
            Poll.objects.create(name=name, description=description, display_name=display_name)
            return HttpResponse('Poll created: {}'.format(name))
        except e:
            return HttpResponseServerError('Cannot create new poll')

@csrf_exempt
def create_proposal(request):

    address = request.POST.get('address')
    poll_name = request.POST.get('poll_name')
    name = request.POST.get('name')
    support_address = request.POST.get('support_address')
    avatar = request.POST.get('avatar')
    description = request.POST.get('description')
    date_of_birth = request.POST.get('date_of_birth')
    party = request.POST.get('party')
    
    if(address == None):
        return HttpResponseBadRequest("Missing address field")
    if(name == None):
        return HttpResponseBadRequest("Missing name field")
    
    if(poll_name != None):
        poll = get_object_or_404(Poll, pk=poll_name)
    else:
        poll = None
    
    if(support_address != None):
        support_for = get_object_or_404(Proposal, pk=support_address)
    else:
        support_for = None
    if(date_of_birth != None):
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%m/%d/%Y')
        except ValueError:
            return HttpResponseBadRequest("Wrong date format")

    if(Proposal.objects.filter(pk=address).count() > 0):
        return HttpResponseBadRequest("Proposal's address already exists")
    else:
        try:
            Proposal.objects.create(address=address, name=name, poll=poll, supportFor=support_for, avatar=avatar, description=description, date_of_birth=date_of_birth, party=party)
            return HttpResponse("Created proposal: {}".format(address))
        except e:
            return HttpResponseServerError('Cannot create new proposal')

@csrf_exempt
def get_proposal(request):

    address = request.POST.get('address')
    if(address == None):
        return HttpResponseBadRequest("Missing address")
    
    proposal = get_object_or_404(Proposal, pk=address)
    return JsonResponse(proposal.to_json())

@csrf_exempt
def get_poll(request):

    name = request.POST.get('name')
    if(name == None):
        return HttpResponseBadRequest("Missing name")

    poll = get_object_or_404(Poll, pk=name)
    return JsonResponse(poll.to_json())

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
    
    if(address == None):
        return HttpResponseBadRequest("Missing address field")
    if(name == None):
        return HttpResponseBadRequest("Missing name field")
    
    if(poll_name != None):
        poll = get_object_or_404(Poll, pk=poll_name)
    else:
        poll = None
    
    if(support_address != None):
        support_for = get_object_or_404(Proposal, pk=support_address)
    else:
        support_for = None
    if(date_of_birth != None):
        try:
            date_of_birth = datetime.strptime(date_of_birth, '%m/%d/%Y')
        except ValueError:
            return HttpResponseBadRequest("Wrong date format")
    
    proposal = Proposal.objects.filter(pk=address)
    if(proposal.count() == 0):
        return HttpResponseBadRequest("Proposal doesn't exist")

    proposal.update(name=name, poll=poll, supportFor=support_for, avatar=avatar, description=description, date_of_birth=date_of_birth, party=party)
    return HttpResponse("Updated proposal {}".format(address))

@csrf_exempt
def update_poll(request):

    name = request.POST.get('name')
    description = request.POST.get('description')
    display_name = request.POST.get('display_name', name)
    
    if(name == None):
        return HttpResponseBadRequest("Missing name field")

    poll = Poll.objects.filter(pk=name)
    if(poll.count() == 0):
        return HttpResponseBadRequest("Poll doesn't exist")

    poll.update(description=description, display_name=display_name)
    return HttpResponse("Updated poll {}".format(name))

@csrf_exempt
def get_list_proposals(request):

    poll_name = request.POST.get('poll_name')
    if(poll_name == None):
        return HttpResponseBadRequest("Missing poll's name")
    
    poll = get_object_or_404(Poll, pk=poll_name)
    proposal_list = poll.proposal_set.all()

    json = []
    for proposal in proposal_list:
        json.append(proposal.to_json())
    
    return JsonResponse(json, safe=False)