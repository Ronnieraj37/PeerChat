// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PeerChat{
    
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    struct User{
        string Name;
        string About;
        string uniqueId;
        address Address;
        string Image;
    }

    struct Message{
        address sender;
        bool isText;
        string message;
        uint256 timestamp;
    }

    struct Friend{
        string name;
        address friendAddress;
    }

    mapping( address => Friend[]) private friendList;
    mapping( address => User[]) private friendRequests;
    mapping(address => mapping(address => bool)) public isFriendRequest; 
    mapping(address => mapping(address => bool)) private isFriend;
    mapping(address => mapping(address => bool)) private isBlocked;
    mapping( address => User ) private userList;
    mapping( bytes32 => Message[]) private allMessages;
    mapping( string => address) public uniqueUser;

    function searchUser(string calldata _num) external view returns(User memory){
        return userList[uniqueUser[_num]];
    }

    function checkUserExists(address publicKey) public view returns(bool){
        return bytes(userList[publicKey].Name).length > 0; 
    }

    function registerUser(string calldata _name , string calldata _about, string calldata _uniqueId) external {
        require( checkUserExists(msg.sender) == false , "User Already Exists");
        require( bytes(_name).length > 0 , "UserName Cannot Be Empty");
        require( uniqueUser[_uniqueId] == 0x0000000000000000000000000000000000000000,"User Already Exists");
        userList[msg.sender].Name = _name ;
        userList[msg.sender].uniqueId = _uniqueId ;
        userList[msg.sender].About = bytes(_about).length > 0 ? _about : "Hey I'm using PeerChat"  ;
        userList[msg.sender].Address = msg.sender ;
        uniqueUser[_uniqueId] = msg.sender ;
    }

    function getUserDetails(address _user) external view returns(User memory) {
        require( checkUserExists(_user) , "User Doesn't Exists");
        return(userList[_user]);
    }

    function addFriend(address _friend) external {
        require( checkUserExists(msg.sender) , "Create Account First");
        require(checkUserExists(_friend) , "User Doesn't Exists");
        require( isBlocked[_friend][msg.sender] == false, "You Are Blocked");
        require(msg.sender != _friend, "Cannot Add Youself as Friend");
        require( isFriend[msg.sender][_friend] == false, "Already Friend");
        require( isFriend[_friend][msg.sender] == false, "Already Friend");
        require( isFriendRequest[_friend][msg.sender] == false,"Friend Request Already Sent");
        friendRequests[_friend].push(userList[msg.sender]);
        isFriendRequest[_friend][msg.sender] = true;
    }
    function acceptRequest(address _friend) external{
        require( checkUserExists(msg.sender) , "Create Account First");
        require(checkUserExists(_friend) , "User Doesn't Exists");
        require( isBlocked[_friend][msg.sender] == false, "You Are Blocked");
        require(msg.sender != _friend, "Cannot Add Youself as Friend");
        require( isFriend[msg.sender][_friend] == false, "Already Friend");
        require( isFriend[_friend][msg.sender] == false, "Already Friend");
        Friend memory friend = Friend( userList[_friend].Name, _friend);
        friendList[msg.sender].push(friend);
        friend = Friend( userList[msg.sender].Name , msg.sender);
        friendList[_friend].push(friend);
        isFriend[_friend][msg.sender] = true;
        isFriend[msg.sender][_friend] = true;
        isFriendRequest[msg.sender][_friend] = false;
        for(uint256 i =0 ;i< friendRequests[msg.sender].length ;i++){
            if( _friend == friendRequests[msg.sender][i].Address){
                friendRequests[msg.sender][i] = friendRequests[msg.sender][friendRequests[msg.sender].length -1];
                friendRequests[msg.sender].pop();
                break;
            }
        }
    }

    function rejectFriendRequest(address _friend) external{
        require(checkUserExists(_friend) , "User Doesn't Exists");
        require( isFriend[msg.sender][_friend] == false, "Already Friend");
        require( isFriend[_friend][msg.sender] == false, "Already Friend");
        isFriendRequest[msg.sender][_friend] = false;
        for(uint256 i =0 ;i< friendRequests[msg.sender].length ;i++){
            if( _friend == friendRequests[msg.sender][i].Address){
                friendRequests[msg.sender][i] = friendRequests[msg.sender][friendRequests[msg.sender].length -1];
                friendRequests[msg.sender].pop();
                break;
            }
        }
    }

    function friendRequestList()external view returns(User[] memory) {
        return friendRequests[msg.sender];
    }

    function removeFriend(address pubKey1 ) public {
        require( isFriend[pubKey1][msg.sender], "No Such Friend Found!");
        require( isFriend[msg.sender][pubKey1], "No Such Friend Found!");
        isFriend[pubKey1][msg.sender] = false; 
        isFriend[msg.sender][pubKey1] = false;
        for( uint256 i = 0; i< friendList[pubKey1].length ;i++){
            if(friendList[pubKey1][i].friendAddress == msg.sender ){
                friendList[pubKey1][i] = friendList[pubKey1][friendList[pubKey1].length - 1];
                friendList[pubKey1].pop();
                break;
            }
        }
        for( uint256 i = 0; i< friendList[msg.sender].length ;i++){
            if(friendList[msg.sender][i].friendAddress == pubKey1 ){
                friendList[msg.sender][i] = friendList[msg.sender][friendList[msg.sender].length - 1];
                friendList[msg.sender].pop();
                break;
            }
        }
    }

    function blockUser(address _address) external {
        require(checkUserExists(_address) , "User Doesn't Exists");
        for(uint256 i =0 ;i< friendRequests[msg.sender].length ;i++){
            if( _address == friendRequests[msg.sender][i].Address){
                friendRequests[msg.sender][i] = friendRequests[msg.sender][friendRequests[msg.sender].length -1];
                friendRequests[msg.sender].pop();
                break;
            }
        }
        isBlocked[msg.sender][_address] = true;
    }

    function getFriendList() external view returns(Friend[] memory){
        return friendList[msg.sender];
    }

    function _getChatCode(address pubKey1 , address pubKey2) internal pure returns(bytes32){
        if(pubKey1 > pubKey2){
            return keccak256(abi.encodePacked(pubKey1,pubKey2));
        } else {
            return keccak256(abi.encodePacked(pubKey2,pubKey1));
        }   
    }

    function sendMessage(address friendKey , string calldata _msg) external {
        require( isBlocked[friendKey][msg.sender] == false ,"You are Blocked");
        require( checkUserExists(msg.sender), "Register First!!" );
        require( checkUserExists(friendKey), "Friend Doesn't have an Account" );
        require( isFriend[msg.sender][friendKey], "Add to Friends to Message");
        // All checks done ? 
        bytes32 chatCode = _getChatCode(msg.sender , friendKey);
        Message memory newMsg = Message(msg.sender, true, _msg, block.timestamp); 
        allMessages[chatCode].push(newMsg);
    }

    function sendImage(address friendKey , string calldata _hash) external {
        require( isBlocked[friendKey][msg.sender] == false ,"You are Blocked");
        require( checkUserExists(msg.sender), "Register First!!" );
        require( checkUserExists(friendKey), "Friend Doesn't have an Account" );
        require( isFriend[msg.sender][friendKey], "Add to Friends to Message");
        // All checks done ? 
        bytes32 chatCode = _getChatCode(msg.sender , friendKey);
        Message memory newMsg = Message(msg.sender, false, _hash, block.timestamp); 
        allMessages[chatCode].push(newMsg);
    }

    function readMessage( address friendKey) external view returns(Message[] memory){
        bytes32 chatCode = _getChatCode(msg.sender , friendKey); 
        return allMessages[chatCode];
    }
    //add profile photo
    function addPhoto( string calldata _hash) external {
        userList[msg.sender].Image = _hash;
    }
} 