const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("PeerChat",() =>{
  
  let peerChat;
  let roshan, pragya , praju ;

  beforeEach(async () => {
    [roshan, ujju , praju] = await ethers.getSigners();
    const PeerChat = await ethers.getContractFactory("PeerChat");
    peerChat = await PeerChat.deploy();
    await peerChat.deployed();
  });

  describe("Deployment", () => {
    it("It is owner", async () => {
      expect(await peerChat.owner()).to.equal(roshan.address);
    });
  });

  describe("User Added", () => {
    let transaction ;
    beforeEach(async()=>{
      transaction = await peerChat.registerUser("Roshan" , "" , "8919");
      await transaction.wait();
      transaction = await peerChat.connect(ujju).registerUser("Ujju" , "" , "9133");
      await transaction.wait();
      transaction = await peerChat.connect(praju).registerUser("Praju" , "" , "8142");
      await transaction.wait();
    })
    it("Roshan Check", async () => {
      const result = await peerChat.getUserDetails(roshan.address);
      expect(result.Name).to.equal("Roshan");
    })
    it("Ujju Check", async () => {
      const result = await peerChat.getUserDetails(ujju.address);
      expect(result.Name).to.equal("Ujju");
    })
    it("Praju Check", async () => {
      const result = await peerChat.getUserDetails(praju.address);
      expect(result.Name).to.equal("Praju");
    })
    it("Add Requests", async () => {
      const result = await peerChat.addFriend(ujju.address);
      //const accept = await peerChat.connect(ujju).acceptRequest(roshan.address);
      const friendRequest = await peerChat.connect(ujju).friendRequestList();
      const sender = await peerChat.getUserDetails(roshan.address);
      expect(friendRequest[0].Address).to.equal(sender.Address);
    })
    it("Accept Request", async() => {
      const result = await peerChat.addFriend(ujju.address);
      const friendRequest = await peerChat.connect(ujju).friendRequestList();
      const accept = await peerChat.connect(ujju).acceptRequest(friendRequest[0].Address);
      const friends1 = await peerChat.connect(ujju).getFriendList();
      const friends2 = await peerChat.connect(roshan).getFriendList();
      expect(friends1[0].Address).to.equal(friends2[0].Address);
    })
  });
});
