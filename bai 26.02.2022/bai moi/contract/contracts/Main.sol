pragma solidity ^0.8.0;
// SPDX-License-Identifier: GPL-3.0
contract Main {

    // Structure to hold details of Bidder
    struct IParticipant {
        uint participantID;
        string name;
        string email;
        uint deviation ;
        uint deviationNew;
        uint sessionNumber;
        address addr;
    }

    address public admin;
    mapping( address=>IParticipant) public participants;
    IParticipant [10] public Iparticipants;
       
    struct Session{
        address addr;
        uint totalPrice;
        uint totalPercent;
        uint proposedPrice ;
        uint lastPrice;
        address [] participantsOfSes;
        mapping(uint =>uint) priceOfAPar; // map from ID of participant to their latest price
        mapping(address => uint []) parPrices;
        uint [] givenPrices;
        uint status; //  State{ CREATED, STARTED, STOPPED, CLOSED }
    }
    mapping (address=>Session) detailSession;
    address [] public sessions; 
    uint public count = 0;
    
    event Register(string name, string email);
    event UpdateInfo(string name, string email);
    event ProposedPrice(uint proposedPrice);
    event CloseSession( uint lastPrice);

    constructor(){
        admin = msg.sender;

    }
        modifier onlyAdmin(){
        require(msg.sender == admin,'Only Admin can call this');
        _;
    }

    // Add a Session Contract address into Main Contract. Use to link Session with Main
    function addSession(address _session) public {
        sessions.push(_session);
        // TODO
    }
    function getSessions() public view returns(address [] memory, uint){
        return (sessions,sessions.length);
    }
    function getSessionNum() public view returns(uint){
        return sessions.length;
    }

    function getAdminInfo() public returns(address){
        return admin;
    }

    // TODO: Functions
    function register( string memory _name, string memory _email) public {  
        require(participants[msg.sender].addr == address(0),"This address was registered already");
        IParticipant storage sender = participants[msg.sender];
        sender.name = _name;
        sender.email = _email;
        sender.deviation = 0;
        sender.sessionNumber = 0;
        sender.addr = msg.sender;
        sender.participantID = count; 
        
       
        Iparticipants[participants[msg.sender].participantID].name = _name;//map info to Iparticipants
        Iparticipants[participants[msg.sender].participantID].email = _email;
        Iparticipants[participants[msg.sender].participantID].participantID = count;
        Iparticipants[participants[msg.sender].participantID].addr = msg.sender;
        count ++;
        emit Register(sender.name,sender.email);
    }
    function update(string memory _newName, string memory _newEmail) public {
        if(keccak256(abi.encodePacked(_newName)) != keccak256(abi.encodePacked(participants[msg.sender].name))){
            participants[msg.sender].name = _newName;
            Iparticipants[participants[msg.sender].participantID].name = _newName;
        }
        if(keccak256(abi.encodePacked(_newEmail)) != keccak256(abi.encodePacked(participants[msg.sender].email))){
            participants[msg.sender].email = _newEmail;
            Iparticipants[participants[msg.sender].participantID].email = _newEmail;
        }
        emit UpdateInfo(participants[msg.sender].name,participants[msg.sender].email);
    }
    function statusSession(address _session,uint _status) public {
        detailSession[_session].status = _status ;
    }
    
    function price(address _session, uint _price) public{
        require(participants[msg.sender].addr != address(0),'Participant have not registered');
        require(detailSession[_session].status==1,'Invalid State');
        detailSession[_session].addr = _session;
        IParticipant storage currentPar = participants[msg.sender];
        Session storage currentSes = detailSession[_session];
        if(currentSes.priceOfAPar[currentPar.participantID]<_price){
        uint _numberMove = _price - currentSes.priceOfAPar[currentPar.participantID]; 
        currentSes.totalPrice += _numberMove *(100 - currentPar.deviation);
        }else{
        uint _numberMove = currentSes.priceOfAPar[currentPar.participantID] - _price;
            currentSes.totalPrice -= _numberMove *(100 - currentPar.deviation);
        }
        detailSession[_session].parPrices[msg.sender].push(_price);
         
        uint parPercent = 100 - currentPar.deviation ;
        if(currentSes.parPrices[msg.sender].length==1){
            currentSes.totalPercent += parPercent;
            currentPar.sessionNumber++;
            Iparticipants[currentPar.participantID].sessionNumber = currentPar.sessionNumber;//map to Iparticipants
            currentSes.participantsOfSes.push(msg.sender);
        }
        currentSes.proposedPrice = currentSes.totalPrice/currentSes.totalPercent;
        currentSes.priceOfAPar[currentPar.participantID] = _price;
        //count all given prices
        emit ProposedPrice(currentSes.proposedPrice);
    }
    function getProposedPrice(address _session)public returns(uint){
        return (detailSession[_session].proposedPrice);
    }
    function calculateLastPrice(address _session)public {
        require(detailSession[_session].status==2,'Invalid State');
        Session storage currentSes = detailSession[_session];
        currentSes.lastPrice = currentSes.proposedPrice;
        uint lastP = currentSes.lastPrice ;
        for (uint i=0; i<count;i++){
            if((lastP>=currentSes.priceOfAPar[i])){
                Iparticipants[i].deviationNew =(lastP - currentSes.priceOfAPar[i])* 100/lastP  ;
            }else{
                Iparticipants[i].deviationNew =(currentSes.priceOfAPar[i]- lastP)* 100 /lastP ;
            }
            participants[Iparticipants[i].addr].deviationNew = Iparticipants[i].deviationNew; //map to participants
        }
        for(uint i; i<count;i++){
            Iparticipants[i].deviation =( Iparticipants[i].deviation * (Iparticipants[i].sessionNumber-1) + Iparticipants[i].deviationNew)/(Iparticipants[i].sessionNumber);
            participants[Iparticipants[i].addr].deviation = Iparticipants[i].deviation;//map to participants
        }
        for(uint i=0;i<=currentSes.participantsOfSes.length;i++){
            currentSes.givenPrices.push(currentSes.priceOfAPar[i]);
        }
        emit CloseSession(currentSes.lastPrice);
        
        
    }
    function getLastPrice(address _session) public returns(uint){
        require(detailSession[_session].status==3,'Invalid State');
        return (detailSession[_session].lastPrice);
    }
    function getListOfPar(address _session) public  returns(address [] memory){
        require(detailSession[_session].status==1,'Invalid State');
        return(detailSession[_session].participantsOfSes);
    }
    function getGivenPrices(address _session) public  returns(uint [] memory){
        require(detailSession[_session].status==3,'Invalid State');
        return(detailSession[_session].givenPrices);
    }
    function getProfileId(uint _id) view public returns(uint ,address,string memory,string memory,uint,uint){
        // require(msg.sender== admin || msg.sender == Iparticipants[_id].addr,"Only admin or the owner of account call this");
        return(Iparticipants[_id].participantID,Iparticipants[_id].addr,Iparticipants[_id].name,Iparticipants[_id].email,Iparticipants[_id].deviation,Iparticipants[_id].sessionNumber);
    }
    function getProfileAdd(address _addr) view public returns(uint ,address,string memory,string memory,uint,uint){
    // require(msg.sender== admin || msg.sender == Iparticipants[_id].addr,"Only admin or the owner of account call this");
        return(participants[_addr].participantID,participants[_addr].addr,participants[_addr].name,participants[_addr].email,participants[_addr].deviation,participants[_addr].sessionNumber);
    }

    function getTotalParNum() public view returns(uint){
        return count;
    }

    function getStatusSession(address _session) public onlyAdmin returns(uint){
        return detailSession[_session].status;
    }
    
}
