pragma solidity ^0.8.0;
// SPDX-License-Identifier: GPL-3.0
// Interface of Main contract to call from Session contract
contract Main {
    function addSession(address session) public {}
    function register( string memory _name, string memory _email) public{}
    function update(string memory _newName, string memory _newEmail) public{}
    function statusSession(address _session,uint _status) public {}
    function price(address _session, uint _price) public{}
    function getDetailSession(address _addr) public view returns(uint,uint){}
    function getProposedPrice(address _session)public returns(uint){}
    function closeSession(address _addr)public {}
    function getLastPrice(address _addr) external returns(uint){}
    function getListOfPar(address _session)public returns(address [] memory){}
    function getGivenPrices(address _session) public  returns(uint [] memory){}
    function getProfile(uint _id) public returns(uint ,address,string memory,string memory){}
    
}

contract Session {
    // Variable to hold Main Contract Address when create new Session Contract
    address public mainContract;
    // Variable to hold Main Contract instance to call functions from Main
    Main MainContract;

    // TODO: Variables
     
    address public admin;
    struct Item{
        uint itemID ;
        string itemName;
        string description;
    }
    
    Item public item;
    uint public proposedPrice;
    uint public lastPrice;
    enum State{ CREATED, STARTED, STOPPED, CLOSED }
    State public state = State.CREATED;    
    address [] public participants;
    uint [] public givenPrices;
    address[] public imageHashes;
    constructor(address _mainContract,uint _itemID, string memory _itemName, string memory _description) public {
        // Get Main Contract instance
        mainContract = _mainContract;
        MainContract = Main(_mainContract);
        
        // TODO: Init Session contract
        admin = msg.sender;
        item.itemID = _itemID;
        item.itemName = _itemName;
        item.description = _description;
        
        // Call Main Contract function to link current contract.
        MainContract.addSession(address(this));
    }

    // TODO: Functions
    function setHash(address _imageHash) public{
        imageHashes.push(_imageHash);

    }
    function getHash() public view returns(address [] memory ){
        return imageHashes;
    }
    function startSession() public inState(State.CREATED) onlyAdmin{
        state = State.STARTED;
        MainContract.statusSession(address(this),1);
    }
    
    function updateProductInfo(uint _newItemId, string memory _newName, string memory _newDescription) public onlyAdmin{
        if(keccak256(abi.encodePacked(_newItemId)) != keccak256(abi.encodePacked(item.itemID))){
           item.itemID = _newItemId;
        }
        if(keccak256(abi.encodePacked(_newName)) != keccak256(abi.encodePacked(item.itemName))){
         item.itemName = _newName;
        }
        if(keccak256(abi.encodePacked(_newDescription)) != keccak256(abi.encodePacked(item.description))){
            item.description = _newDescription;
        }
    }
    function getProposedPrice()public inState(State.STARTED) returns(uint){
        proposedPrice = MainContract.getProposedPrice(address(this));
    }   
    function stopSession()public inState(State.STARTED){
        MainContract.closeSession(address(this));
        state = State.STOPPED;
        MainContract.statusSession(address(this),2);
    }
    function getPriceAndClose()public inState(State.STOPPED) returns(uint){
        lastPrice= MainContract.getLastPrice(address(this));
        state = State.CLOSED;
        MainContract.statusSession(address(this),3);
    }
    function getListOfPar()public returns(address[] memory){
        participants= MainContract.getListOfPar(address(this));
        
    }
    function getGivenPrices()public{
        givenPrices = MainContract.getGivenPrices(address(this));
    }
    modifier onlyAdmin(){
        require(msg.sender == admin, "Only Admin can call this");
        _;
    }
    modifier inState(State _state){
        require(state == _state,'Invalid state');
        _;
    }
}
