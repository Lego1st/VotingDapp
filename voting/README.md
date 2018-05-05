# Ballot data base API

## Installation
```
python3
django2.0.4
```

## Quick start
To run service: `python manage.py runserver`
```python
import requests
server_url = "localhost:8000/"

#create new poll
poll_data = {
    'name': 'ny',
    'display_name': 'New York'
}
response = requests.post(server_url+'create_poll/', data=poll_data)

#create new proposal
proposal_data = {
    'address': '0x18f624Fd1b9e8a9294C20d19489020FfF51768D3'
    'name': 'Donald Trump',
    'date_of_birth': 'Jun/14/1946'
}
response = requests.post(server_url+'create_proposal/', data=proposal_data)
```
## API
```
<server url>/create_proposal/
<server url>/create_poll/
<server url>/get_proposal/
<server url>/get_poll/
<server url>/update_proposal/
<server url>/update_poll/
<server url>/get_list_proposals/
```
**create_proposal**
Parameters:
- address: str (required). The address of the proposal.
- poll_name: str (not required). The name of the poll this proposal belong to.
- name: str (required). The name of the proposal.
- support_address: str (not required). The address of the president candidate this proposal support for (null if this proposal is a president candidate).
- avatar: str (not required). The image path to the avatar image of this proposal.
- description: str (not required).
- date_of_birth: str (not required). In the format of mm/dd/yyy, ex: 01/11/1971
- party: str (not required). The party this proposal belong to.

Return:
- response.status_code == 400 if Missing required field/Wrong date format/Proposal's address existed.
- response.status_code == 404 if The poll_name or support_address is not found.
- response.status_code == 500 if Cannot create the proposal.
- response.status_code == 200, Proposal created.

**create_poll**
Parameters:
- name: str (required). The nickname of the poll.
- description: str (not required).
- display_name: str (not required). The full name of the poll. if not provdided display_name = name.

Return:
- response.status_code == 400 if Missing required field/Poll's name existed.
- response.status_code == 500 if Cannot create the poll.
- response.status_code == 200, Poll created.

**get_proposal**
Parameters:
- address: str (required). The address of the proposal.

Return:
- response.status_code == 400 if Missing required field
- response.status_code == 404 if The address is not found.
- response.status_code == 200 with a json object.

**get_poll**
Parameters:
- name: str (required). The address of the poll.

Return:
- response.status_code == 400 if Missing required field
- response.status_code == 404 if The name is not found.
- response.status_code == 200 with a json object.

**update_proposal**
Parameters:
- address: str (required). The address of the proposal.
- poll_name: str (not required). The name of the poll this proposal belong to.
- name: str (required). The name of the proposal.
- support_address: str (not required). The address of the president candidate this proposal support for (null if this proposal is a president candidate).
- avatar: str (not required). The image path to the avatar image of this proposal.
- description: str (not required).
- date_of_birth: str (not required). In the format of mm/dd/yyy, ex: 01/11/1971
- party: str (not required). The party this proposal belong to.

Return:
- response.status_code == 400 if Missing required field/Wrong date format/Proposal's address existed.
- response.status_code == 404 if The poll_name or support_address is not found or the proposal doesn't exist
- response.status_code == 500 if Cannot update the proposal.
- response.status_code == 200, Proposal updated.

**update_poll**
Parameters:
- name: str (required). The nickname of the poll.
- description: str (not required).
- display_name: str (not required). The full name of the poll. if not provdided display_name = name.

Return:
- response.status_code == 400 if Missing required field.
- response.status_code == 404 if The poll doesn't exist
- response.status_code == 500 if Cannot update the poll.
- response.status_code == 200, Poll updated.

**get_list_proposals**
Parameters:
- poll_name: str (required). The address of the poll.

Return:
- response.status_code == 400 if Missing required field
- response.status_code == 404 if The name is not found.
- response.status_code == 200 with a list of json objects of proposals