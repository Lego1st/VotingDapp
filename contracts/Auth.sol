pragma solidity 0.4.21;
pragma experimental ABIEncoderV2;

contract Authorize {
    mapping (address => string) private registeredAddress;
    address public creator;
    address public ballotAddress;
    Ballot ballot;
    uint EXPECTED_ID_LENGTH = 9;

    function Authorize() public {
        creator = msg.sender;
    }

    modifier ballotAddressIsSet() {
        require(ballotAddress != address(0));
        _;
    }

    function setBallotAddress(address ballotAdr) public {
        require(msg.sender == creator);

        ballotAddress = ballotAdr;
        ballot = Ballot(ballotAddress);
    }

    function register(string ID, string state) public ballotAddressIsSet {
        // Check for ID length.
        require(bytes(ID).length == EXPECTED_ID_LENGTH);
        // Check to make sure this address has not reg any ID.
        require(bytes(registeredAddress[msg.sender]).length == 0);

        registeredAddress[msg.sender] = ID;
        ballot.giveRightToVote(state, msg.sender);
    }
    
    function getRegisteredID() public view returns (string) {
        return registeredAddress[msg.sender];
    }
}

contract Ballot {
    struct Proposal {
        string name;
        address id;
        uint voteCount;
        string[] infoKeys;
        mapping (string => string) infoMap;
    }

    struct VotePoll {
        string name;
        uint winnersCount;
        address[] winnersList;
        bool ended;
        address[] proposalIDs;
        mapping (address => Proposal) proposalMap;
        mapping (address => bool) canVote;
        mapping (address => address) voted;
    }

    address public authAddress;
    address public votePollCreater;

    string[] public votePollNames;
    mapping (string => VotePoll) public votePollMap;

    function Ballot() public {
        votePollCreater = msg.sender;
    }

    function setAuthAddress(address adr) public callerIsPollCreater {
        authAddress = adr;
    }

    // Modifiers.
    modifier authorizeAddressIsSet() {
        require(authAddress != address(0));
        _;
    }

    modifier callerIsAuthorize() {
        require(msg.sender == authAddress);
        _;
    }

    modifier callerIsPollCreater() {
        require(msg.sender == votePollCreater);
        _;
    }

    modifier hasThisPollName(string pollName) {
        // Check if we have a VotePoll with this name.
        bool hasThisName = false;
        for(uint i = 0; i < votePollNames.length; i++) {
            if (keccak256(pollName) == keccak256(votePollNames[i])) {
                hasThisName = true;
                break;
            }
        }

        require(hasThisName);
        _;
    }

    modifier hasThisProposalID(string pollName, address proposalID) {
        // Check if we have this proposalID in pollName.
        bool hasThisID = false;
        for(uint i = 0; i < votePollMap[pollName].proposalIDs.length; i++) {
            if(proposalID == votePollMap[pollName].proposalIDs[i]) {
                hasThisID = true;
                break;
            }
        }

        require(hasThisID);
        _;
    }

    modifier hasVoteRight(string pollName) {
        require(votePollMap[pollName].canVote[msg.sender]);
        _;
    }

    modifier pollHasNotEnded(string pollName) {
        require(votePollMap[pollName].ended == false);
        _;
    }
    // End modifiers.


    function giveRightToVote(string pollName, address voterAddress) public authorizeAddressIsSet callerIsAuthorize hasThisPollName(pollName) pollHasNotEnded(pollName) {
        // TODO: allow pollCreater to giveRightToVote.

        votePollMap[pollName].canVote[voterAddress] = true;
    }


    // Add VotePolls information for Ballot.
    function addVotePoll(string pollName, uint winnersCount) public callerIsPollCreater pollHasNotEnded(pollName) {
        // TODO: add check if pollName already exist.

        votePollNames.push(pollName);
        votePollMap[pollName] = VotePoll({name: pollName, ended: false, winnersCount: winnersCount, winnersList: new address[](0), proposalIDs: new address[](0)});
    }

    function addProposalToVotePoll(string pollName, string proposalName, address proposalID) public hasThisPollName(pollName) callerIsPollCreater pollHasNotEnded(pollName) {
        votePollMap[pollName].proposalIDs.push(proposalID);
        votePollMap[pollName].proposalMap[proposalID] = Proposal({name: proposalName, id: proposalID, voteCount: 0, infoKeys: new string[](0)});
    }

    function addAdditionalInfoToProposal(string pollName, address proposalID, string infoKey, string infoValue) public hasThisPollName(pollName) hasThisProposalID(pollName, proposalID) callerIsPollCreater pollHasNotEnded(pollName) {
        // TODO: allow candidate to add their info.

        votePollMap[pollName].proposalMap[proposalID].infoKeys.push(infoKey);
        votePollMap[pollName].proposalMap[proposalID].infoMap[infoKey] = infoValue;
    }
    // End add information methods.

    function vote(string pollName, address proposalID) public hasThisPollName(pollName) hasThisProposalID(pollName, proposalID) hasVoteRight(pollName) pollHasNotEnded(pollName) {
        // Check if this user has voted.
        bool hasVoted = (votePollMap[pollName].voted[msg.sender] != address(0));

        // Doesn't allow re-vote.
        require(hasVoted == false);

        // Increase voteCount of the proposal that this user chosed to vote for.
        votePollMap[pollName].proposalMap[proposalID].voteCount += 1;
        // Save which proposal this user voted for.
        votePollMap[pollName].voted[msg.sender] = proposalID;
    }   

    function end(string pollName) public hasThisPollName(pollName) pollHasNotEnded(pollName) callerIsPollCreater {
        // End this poll.
        votePollMap[pollName].ended = false;

        // Calculate result for this poll.
        // First sort the result.
        // TODO: partial sort to sort only the ${winnersCount} highest proposal.
        for(uint i = votePollMap[pollName].proposalIDs.length; i > 0; i--) {
            uint bestProposal = 0;
            for(uint j = 0; j < i; j++) {
                if (votePollMap[pollName].proposalMap[votePollMap[pollName].proposalIDs[bestProposal]].voteCount < votePollMap[pollName].proposalMap[votePollMap[pollName].proposalIDs[j]].voteCount)
                    bestProposal = j;
            }

            address tmp = votePollMap[pollName].proposalIDs[i];
            votePollMap[pollName].proposalIDs[i] = votePollMap[pollName].proposalIDs[bestProposal];
            votePollMap[pollName].proposalIDs[bestProposal] = tmp;
        }

        // Get ${winnersCount} highest proposal to be the winners.
        uint proposalsCount = votePollMap[pollName].proposalIDs.length;
        for(uint k = 0; k < votePollMap[pollName].winnersCount; k++) {
            votePollMap[pollName].winnersList.push(votePollMap[pollName].proposalIDs[proposalsCount - k - 1]);
        }
    }           


    // Get info from Ballot.
    function getVotePollsCount() public view returns (uint) {
        return votePollNames.length;
    }

    function getVotePollInfo(uint pollIdx) public view returns (string name, uint winnersCount, bool ended, uint proposalsCount) {
        require(pollIdx < votePollNames.length);

        VotePoll poll = votePollMap[votePollNames[pollIdx]];
        return(poll.name, poll.winnersCount, poll.ended, poll.proposalIDs.length);
    }

    function getWinner(uint pollIdx, uint winnerIdx) public view returns (address winnerAddress) {
        require(pollIdx < votePollNames.length);
        require(winnerIdx < votePollMap[votePollNames[pollIdx]].winnersCount);

        VotePoll poll = votePollMap[votePollNames[pollIdx]];
        return poll.winnersList[winnerIdx];
    }

    function checkIfUserCanVote(string pollName) public view hasThisPollName(pollName) returns (bool) {
        return votePollMap[pollName].canVote[msg.sender];
    }

    function checkIfUserHasVoted(string pollName) public view hasThisPollName(pollName) hasVoteRight(pollName) returns (bool) {
        return (votePollMap[pollName].voted[msg.sender] != address(0));
    }

    function getUserVotedProposal(string pollName) public view hasThisPollName(pollName) hasVoteRight(pollName) returns (address) {
        return votePollMap[pollName].voted[msg.sender];
    }

    function getProposalsCount(uint pollIdx) public view returns (uint) {
        require(pollIdx < votePollNames.length);

        return votePollMap[votePollNames[pollIdx]].proposalIDs.length;
    }

    function getProposalsInfo(uint pollIdx, uint proposalIdx) public view returns (string name, address id, uint voteCount, uint infoKeysCount) {
        require(pollIdx < votePollNames.length);
        require(proposalIdx < votePollMap[votePollNames[pollIdx]].proposalIDs.length);

        address proposalID = votePollMap[votePollNames[pollIdx]].proposalIDs[proposalIdx];
        Proposal proposal = votePollMap[votePollNames[pollIdx]].proposalMap[proposalID];
        return (proposal.name, proposal.id, proposal.voteCount, proposal.infoKeys.length);
    }

    function getProposalInfoKey(uint pollIdx, uint proposalIdx, uint infoKeyIdx) public view returns (string infoValue) {
        require(pollIdx < votePollNames.length);
        require(proposalIdx < votePollMap[votePollNames[pollIdx]].proposalIDs.length);

        address proposalID = votePollMap[votePollNames[pollIdx]].proposalIDs[proposalIdx];
        Proposal proposal = votePollMap[votePollNames[pollIdx]].proposalMap[proposalID];
        require(infoKeyIdx < proposal.infoKeys.length);

        string infoKey = proposal.infoKeys[infoKeyIdx];
        return proposal.infoMap[infoKey];
    }
    // End get Ballot info.
}

contract FinalBallot is Ballot {
    struct Voter {
        address id;
        string name;
        mapping (string => string) infoMap;
    }

    address[] voterAddresses;
    mapping (address => Voter) voterMap;
    address firstBallotAddress;
    Ballot firstBallot;

    modifier hasFirstBallotAddress() {
        require(firstBallotAddress != address(0));
        _;
    }

    function setFirstBallotAddress(address ballotAddress) public {
        firstBallotAddress = ballotAddress;
        firstBallot = Ballot(firstBallotAddress);
    }

    function start() public hasFirstBallotAddress {
        // Get result from first ballot.
        // Get number of vote poll.
        uint pollCount = firstBallot.getVotePollsCount();

        for(uint i = 0; i < pollCount; i++) {
            
        }
    }
}