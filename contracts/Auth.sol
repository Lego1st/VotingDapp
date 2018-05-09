pragma solidity ^0.4.17;
// pragma experimental ABIEncoderV2;

contract Authorize {
    mapping (address => string) private registeredAddress;
    address public creator;
    address public ballotAddress;
    Ballot ballot;
    uint EXPECTED_ID_LENGTH = 9;

    constructor() public {
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

    function register(string ID, bytes32 state) public ballotAddressIsSet {
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
    struct VotePoll {
        // Poll name
        bytes32 name;
        // Danh sách các proposal có trong poll này.
        address[] proposals;
        // Mappping quản lý xem một address nhất định có quyền vote trong poll này không.
        mapping(address => bool) hasRightToVote;
        // Mapping quản lý xem address đã vote chưa.
        mapping(address => bool) hasVoted;
        // Mapping lưu số vote của các proposal.
        mapping(address => uint) voteCount;
        // Bool quản lý xem poll đã được kết thúc chưa.
        bool ended;
        // Uint quản lý số người thắng.
        uint winnersCount;
    }

    bytes32 SECOND_BALLOT_POLL_NAME = "final";

    address public owner;
    address public auth;
    
    bytes32[] public votePollName;
    mapping(bytes32 => VotePoll) public votePollMap;
    // Mapping lưu xem address thuộc về votePoll nào. Giới hạn một address chỉ có thể thuộc về một votePoll.
    mapping(address => bytes32) public userState;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier hasThisPollName(bytes32 pollName) {
        bool found = false;
        for(uint i = 0; i < votePollName.length; i++) {
            if (keccak256(votePollName[i]) == keccak256(pollName)) {
                found = true;
                break;
            }
        }

        require(found == true);
        _;
    }

    modifier hasThisProposal(bytes32 pollName, address proposal) {
        bool found = false;
        for(uint i = 0; i < votePollName.length; i++) {
            if (votePollMap[pollName].proposals[i] == proposal) {
                found = true;
                break;
            }
        }

        require(found == true);
        _;
    }

    modifier isAuth() {
        require(msg.sender == auth);
        _;
    }

    modifier canVote(bytes32 pollName) {
        require(votePollMap[pollName].hasRightToVote[msg.sender] == true);
        _;
    }

    modifier pollNotEnded(bytes32 pollName) {
        require(votePollMap[pollName].ended == false);
        _;
    }
    
    constructor(address _owner) public {
        owner = _owner;
    }

    // Set địa chỉ của Auth để Auth có thể giveRightToVote.
    function setAuth(address _auth) public {
        auth = _auth;
    }

    function addVotePoll(bytes32 pollName, uint winnersCount) isOwner public {
        // Kiểm tra xem tên này đã dùng chưa.
        for(uint i = 0; i < votePollName.length; i++) {
            if (keccak256(votePollName[i]) == keccak256(pollName))
                return;
        }

        votePollName.push(pollName);
        votePollMap[pollName] = VotePoll({name: pollName, proposals: new address[](0), ended: false, winnersCount: winnersCount});
    }

    function addProposalToVotePoll(bytes32 pollName, address proposalAddress) isOwner hasThisPollName(pollName) public {
        // Kiểm tra xem address này đã được add chưa.
        for(uint i = 0; i < votePollMap[pollName].proposals.length; i++) {
            if (votePollMap[pollName].proposals[i] == proposalAddress)
                return;
        }
                
        votePollMap[pollName].proposals.push(proposalAddress);
    }

    function giveRightToVote(bytes32 pollName, address voter) isAuth hasThisPollName(pollName) pollNotEnded(pollName) public {
        votePollMap[pollName].hasRightToVote[voter] = true;

        // Lưu lại address này thuộc pollName nào.
        userState[voter] = pollName;
    }

    function vote(bytes32 pollName, address proposal) hasThisPollName(pollName) 
    hasThisProposal(pollName, proposal) canVote(pollName) pollNotEnded(pollName) public {
        votePollMap[pollName].hasVoted[msg.sender] = true;
        votePollMap[pollName].voteCount[proposal] += 1;
    }  

    function endPoll(bytes32 pollName) isOwner hasThisPollName(pollName) public {
        votePollMap[pollName].ended = true;
    }

    function getVotePollCount() public view returns(uint) {
        return votePollName.length;
    }

    function getVotePollInfo(bytes32 pollName) public view returns(uint proposalCount, bool ended) {
        // require(idx < votePollName.length);

        VotePoll storage poll = votePollMap[pollName];
        return(poll.proposals.length, poll.ended);
    }

    function getVotePollProposalInfo(uint votePollIdx, uint proposalIdx) public view returns (address proposal, uint voteCount) {
        require(votePollIdx < votePollName.length);

        VotePoll storage poll = votePollMap[votePollName[votePollIdx]];
        require(proposalIdx < poll.proposals.length);

        address adr = poll.proposals[proposalIdx];
        return(adr, poll.voteCount[adr]);
    }

    function hasVoteRight() public view returns(bool) {
        //TODO: Yêu cầu address này phải thuộc về một votePoll nào đó.
        return votePollMap[userState[msg.sender]].hasRightToVote[msg.sender] && !votePollMap[userState[msg.sender]].ended;
    }

    function hasVoted() public view returns(bool) {
        //TODO: Yêu cầu address này phải thuộc về một votePoll nào đó.
        return votePollMap[userState[msg.sender]].hasVoted[msg.sender];
    }

    function startSecondBallot() isOwner public {
        // End tất cả các votePoll hiện có.
        for(uint idx = 0; idx < votePollName.length; idx++) {
            endPoll(votePollName[idx]);
        }

        addVotePoll(SECOND_BALLOT_POLL_NAME, 1);

        // Cấp quyền cho các candidate thắng ở vòng 1.
        for(uint pollIdx = 0; pollIdx < votePollName.length; pollIdx++) {
            VotePoll storage poll = votePollMap[votePollName[pollIdx]];
            for(uint i = 0; i < poll.winnersCount; i++) {
                uint bestIdx = 0;
                for(uint j = i; j < poll.proposals.length; j++) {
                    if(poll.voteCount[poll.proposals[bestIdx]] < poll.voteCount[poll.proposals[j]])
                        bestIdx = j;
                }

                // Cho phép candidate này vote trong vòng cuối.
                giveRightToVote(SECOND_BALLOT_POLL_NAME, poll.proposals[bestIdx]);

                // Đổi chỗ candidate này lên đầu. 
                address tmp = poll.proposals[bestIdx];
                poll.proposals[bestIdx] = poll.proposals[i];
                poll.proposals[i] = tmp;
            }
        }
    }
}   

