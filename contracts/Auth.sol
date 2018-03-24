pragma solidity 0.4.21;
pragma experimental ABIEncoderV2;

contract Authorize {
    mapping (address => string) private registeredAddress;
    address creator;
    address ballotAddress;
    Ballot ballot;

    function Authorize() public {
        creator = msg.sender;
    }

    function setBallotAddress(address ballotAdr) public {
        require(msg.sender == creator);

        ballotAddress = ballotAdr;
        ballot = Ballot(ballotAddress);
    }

    function register(string ID, string state) public returns (bool) {
        require(bytes(ID).length == 9);
        require(bytes(registeredAddress[msg.sender]).length == 0);
        require(ballotAddress != address(0));

        registeredAddress[msg.sender] = ID;
        ballot.giveRightToVote(state, msg.sender);

        return true;
    }
    
    function getRegisteredID() public view returns (string) {
        return registeredAddress[msg.sender];
    }
}

contract Ballot {
    struct Proposal {
        string name;
        address id;
        bytes32 voteCount;
        mapping (string => string) info;
    }

    struct VotePoll {
        string name;
        address[] proposalIDs;
        mapping (address => Proposal) proposalMap;
        mapping (address => bool) canVote;
    }

    address authAddress;
    address votePollCreater;

    string[] votePollNames;
    mapping (string => VotePoll) votePollMap;

    function Ballot(address authorizeContractAddress, address pollCreater) public{
        authAddress = authorizeContractAddress;
        votePollCreater = pollCreater;
    }

    modifier callerIsAuthorize() {
        require(msg.sender == authAddress);
        _;
    }

    modifier callerIsPollCreater() {
        require(msg.sender == votePollCreater);
        _;
    }

    function giveRightToVote(string state, address voterAddress) public {
        votePollMap[state].canVote[voterAddress] = true;
    }

    function addVotePoll(string name, string[] proposalNames, address[] proposalIDs) public {
        require(proposalNames.length == proposalIDs.length);

        uint proposalCount = proposalNames.length;
        votePollNames.push(name);
        votePollMap[name] = VotePoll({name: name, proposalIDs: proposalIDs});
        // for(uint i = 0; i < proposalCount; i++) {
        //     votePollMap[name].proposalMap[proposalIDs[i]] = Proposal({name: proposalNames[i], voteCount: 0, id: proposalIDs[i]});
        // }
    }

    function getVotePollCount() public view returns (uint) {
        return votePollNames.length;
    }

    function getVotePollName(uint idx) public view returns (string) {
        require(idx < votePollNames.length);
        return votePollNames[idx];
    }
}