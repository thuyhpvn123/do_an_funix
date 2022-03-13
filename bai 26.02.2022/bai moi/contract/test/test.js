const Main = artifacts.require('./Main.sol');
const truffleAssert = require('truffle-assertions');
let Ses={
    session0: "0x4D4821446b61B66525C221B9b3e384F4CE3Eb3CC",
    session1: "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53"
}
contract ('Main',function(accounts){
    const success = '0x01'
    it('Main contract is initiated successfully',async ()=>{
        main = await Main.deployed();
    })
    it("Success on initial set admin address",async ()=>{
        let admin = await main.admin();
        assert(admin !== undefined,"Admin should be defined");
        assert.equal(await admin, accounts[0], "Admin address should be the account deployed contract ")
    }) 
    it("Success on adding hash of sessions",async()=>{
        await main.addSession(Ses.session0)
        let session_0 = await main.sessions(0)
        assert.equal(session_0,Ses.session0, "Should be another Session Address that is added in Main contract" )
        await main.addSession(Ses.session1)
        let session_1 = await main.sessions(1)
        assert.equal(session_1,Ses.session1, "Should be another Session Address that is added in Main contract" )

    })
    it("Success on getting array and the number of hash sessions added",async()=>{
        let session = await main.getSessions.call()
        assert.equal(session[0][0],Ses.session0, "hash of session added should be another address" )
        assert.equal(session[0][1],Ses.session1, "hash of session added should be another address" )
        assert.equal(session[1],2, "Number of session added should be 2" )
    })
    it("Success on getting the number of hash sessions added",async()=>{
        let sessionNum = await main.getSessionNum.call()
        assert.equal(sessionNum,2, "Number of session added should be 2" )
    })
    it("Success on getting admin address",async()=>{
        let adminAdd = await main.getAdminInfo.call()
        assert.equal(await adminAdd.toString(),accounts[0], "Admin address should be the account deployed contract " )
    })
    it("Success on register new participant",async()=>{
        await main.register("thuy","thuy@gmail.com",{from : accounts[1]}) 
        let participant0 = await main.participants(accounts[1])
        assert.equal(await participant0.name,"thuy", "Name of participant should be 'thuy' " )
        assert.equal(await participant0.email,"thuy@gmail.com", "Email of participant should be 'thuy@gmail.com' " )
        assert.equal(await participant0.addr,accounts[1], "Address of participant should be right " )
        assert.equal(await participant0.deviation.toNumber(),0, "Deviation of participant should be 0 " )
        assert.equal(await participant0.sessionNumber.toNumber(),0, "Number of session of participant should be 0 " )
        await main.register("linh","linh@gmail.com",{from : accounts[2]}) 
        let participant1 = await main.participants(accounts[2])
        assert.equal(await participant1.name,"linh", "Name of participant should be 'linh' " )
        assert.equal(await participant1.email,"linh@gmail.com", "Email of participant should be 'linh@gmail.com' " )
        assert.equal(await participant1.addr,accounts[2], "Address of participant should be right " )
        assert.equal(await participant1.deviation.toNumber(),0, "Deviation of participant should be 0 " )
        assert.equal(await participant1.sessionNumber.toNumber(),0, "Number of session of participant should be 0 " )

    })
    it("Success on edit new participant info",async()=>{
        await main.update("thuy1","thuy1@gmail.com",{from : accounts[1]}) 
        participant0 = await main.participants(accounts[1])
        assert.equal(await participant0.name,"thuy1", "Name of participant should be 'thuy1' " )
        assert.equal(await participant0.email,"thuy1@gmail.com", "Email of participant should be 'thuy1@gmail.com' " )
   })
   it("Success on setting status of a session",async()=>{
        await main.statusSession(Ses.session0,1,{from : accounts[0]}) 
        let sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.status,1 )
        await main.statusSession(Ses.session0,2,{from : accounts[0]})
        sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.status,2 )
        await main.statusSession(Ses.session0,3,{from : accounts[0]})
        sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.status,3 )
    })
    it("Success on a participant can give price many times for a session",async()=>{
        await main.statusSession(Ses.session0,1,{from : accounts[0]}) 
        await main.statusSession(Ses.session1,1,{from : accounts[0]}) 
        await main.price(Ses.session0,100,{from : accounts[1]}) 
        sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.proposedPrice,100 )
        await main.price(Ses.session0,200,{from : accounts[1]}) 
        sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.proposedPrice,200 )
    })
    it("Success on a participant can give price for many sessions",async()=>{
        await main.price(Ses.session0,300,{from : accounts[2]}) 
        sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.proposedPrice,250 )
        await main.price(Ses.session1,300,{from : accounts[2]}) 
        let sesDetail1 = await main.detailSession(Ses.session1)
        assert.equal(sesDetail1.proposedPrice,300 )
    })
    it("Success on getting proposed price",async()=>{
        let proPriceSes0 = await main.getProposedPrice.call(Ses.session0)
        assert.equal(proPriceSes0,250 )
        let proPriceSes1 = await main.getProposedPrice.call(Ses.session1)
        assert.equal(proPriceSes1,300 )
    })
    it("Success on calculating the last price",async()=>{
        await main.statusSession(Ses.session0,2,{from : accounts[0]}) 
        await main.statusSession(Ses.session1,2,{from : accounts[0]}) 
        await main.calculateLastPrice(Ses.session0,{from : accounts[0]}) 
        sesDetail = await main.detailSession(Ses.session0)
        assert.equal(sesDetail.lastPrice,250 )
        await main.calculateLastPrice(Ses.session1,{from : accounts[0]}) 
        sesDetail1 = await main.detailSession(Ses.session1)
        assert.equal(sesDetail1.lastPrice,300 )
    })
    it("Success on getting info of a participant by his address ",async()=>{
        let Participant0 = await main.getProfileAdd.call(accounts[1])
        assert.equal(Participant0[0],0 )
        assert.equal(Participant0[1],accounts[1] )
        assert.equal(Participant0[2],"thuy1" )
        assert.equal(Participant0[3],"thuy1@gmail.com" )
        assert.equal(Participant0[4],20)
        assert.equal(Participant0[5],1 )
    })

    it("Success on getting list of participants of a session",async()=>{
        let listOfParSes0 = await main.getListOfPar.call(Ses.session0) 
        assert.equal(listOfParSes0[0],0 )
        assert.equal(listOfParSes0[1], 1)
    })
    it("Success on getting all prices that participants gave for a session",async()=>{
        let listOfGivenP = await main.getGivenPrices.call(Ses.session0)
        assert.equal(listOfGivenP[0],200)
        assert.equal(listOfGivenP[1],300)
    })
    it("Success on getting total number of participant that joined sessions",async()=>{
        let totalPar = await main.getTotalParNum.call()
        assert.equal(totalPar,2)
    })
    it("Success on getting status of a session",async()=>{
        let statusSes0 = await main.getStatusSession.call(Ses.session0)
        assert.equal(statusSes0,2)
        await main.statusSession(Ses.session1,3,{from : accounts[0]}) 
        let statusSes1 = await main.getStatusSession.call(Ses.session1)
        assert.equal(statusSes1,3)

    })
    it("Success on getting info of a participant by his id",async()=>{
        await main.statusSession(Ses.session0,3,{from : accounts[0]}) 
        let Participant1 = await main.getProfileAdd.call(accounts[1])
        assert.equal(Participant1[0],0 )
        assert.equal(Participant1[1],accounts[1] )
        assert.equal(Participant1[2],"thuy1" )
        assert.equal(Participant1[3],"thuy1@gmail.com" )
        assert.equal(Participant1[4],20 )
        assert.equal(Participant1[5],1 )
    })

















})
