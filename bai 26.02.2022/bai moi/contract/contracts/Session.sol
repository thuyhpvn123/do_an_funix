pragma solidity ^0.8.0;

// Interface of Main contract to call from Session contract
contract Main {
    function addSession(address session) public {}
    function getSessions() public view returns(address [] memory, uint){}
    function getSessionNum() public view returns(uint){}
    function getAdminInfo() public returns(address){}
    function register( string memory _name, string memory _email) public{}
    function update(string memory _newName, string memory _newEmail) public{}
    function statusSession(address _session,uint _status) public {}
    function price(address _session, uint _price) public{}
    function getProposedPrice(address _session)public returns(uint){}
    function calculateLastPrice(address _addr)public {}
    function getLastPrice(address _addr) external returns(uint){}
    function getListOfPar(address _session)public returns(address [] memory){}
    function getGivenPrices(address _session) public  returns(uint [] memory){}
    function getProfileId(uint _id) view public returns(uint ,address,string memory,string memory,uint,uint){}
    function getProfileAdd(address _addr) view public returns(uint ,address,string memory,string memory,uint,uint){}
    function getTotalParNum() public view returns(uint){}
    function getStatusSession(address _session) public returns(uint){}
    
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
    constructor(address _mainContract,address _admin, string memory _itemName, string memory _description) public {
        // Get Main Contract instance
        mainContract = _mainContract;
        MainContract = Main(_mainContract);
                // item.itemID = _itemID;
        item.itemID = MainContract.getSessionNum();
        item.itemName = _itemName;
        item.description = _description;
        admin =_admin;
        // TODO: Init Session contract
        
        
        // Call Main Contract function to link current contract.
        MainContract.addSession(address(this));
        
    }
    function setIdSession() public{
        item.itemID = MainContract.getSessionNum();
    }
    function getProductInfo() view public returns(uint,string memory,string memory ){
        return (item.itemID,item.itemName,item.description);
    }
    function setHash(address _imageHash)  public onlyAdmin{
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
    function getProposedPrice()public inState(State.STARTED) onlyAdmin returns(uint){
        proposedPrice = MainContract.getProposedPrice(address(this));
        return proposedPrice;
    }   
    function stopSession()public onlyAdmin inState(State.STARTED){
        MainContract.statusSession(address(this),2);
        state = State.STOPPED;
        MainContract.calculateLastPrice(address(this));
        
    }
    function getPriceAndClose()public inState(State.STOPPED) onlyAdmin returns(uint){
        MainContract.statusSession(address(this),3);
        state = State.CLOSED;
        lastPrice= MainContract.getLastPrice(address(this));
        return lastPrice;
    }
    function getListOfPar()public onlyAdmin returns(address[] memory){
        participants= MainContract.getListOfPar(address(this));
        return participants;
    }
    function getGivenPrices()public onlyAdmin{
        givenPrices = MainContract.getGivenPrices(address(this));
    }
    function getStatusSession()public view returns(State){
        return state;
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
