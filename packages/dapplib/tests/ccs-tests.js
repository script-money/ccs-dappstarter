const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Intergretion test', async () => {

  let config = null;
  before('setup contract', async () => {
    // Setup tasks for tests
    config = DappLib.getConfig();
  });

  after(() => {
    fkill(':3570');
  });

  describe('\n main process', async () => {
    it(`users can set ccstoken, ballot and memorials account`, async () => {
      const ADMIN = config.accounts[0]
      const USER1 = config.accounts[1]
      const USER2 = config.accounts[2]
      const USER3 = config.accounts[3]
      const USER4 = config.accounts[4]
      let user0Data = { account: ADMIN }
      let user1Data = { account: USER1 }
      let user2Data = { account: USER2 }
      let user3Data = { account: USER3 }
      let user4Data = { account: USER4 }
      await DappLib.initializeAccount(user0Data)
      await DappLib.initializeAccount(user1Data)
      await DappLib.initializeAccount(user2Data)
      await DappLib.initializeAccount(user3Data)
      await DappLib.initializeAccount(user4Data)
      let res0 = await DappLib.isAccountInitialized({ address: ADMIN })
      let res1 = await DappLib.isAccountInitialized({ address: USER1 })
      let res2 = await DappLib.isAccountInitialized({ address: USER2 })
      let res3 = await DappLib.isAccountInitialized({ address: USER3 })
      let res4 = await DappLib.isAccountInitialized({ address: USER4 })
      assert.equal(
        res0.result && res1.result && res2.result && res3.result && res4.result,
        true, "at least an account is not initialized")
    })


    it(`mints ccs tokens into user accounts and has the correct balance`, async () => {
      const ADMIN = config.accounts[0]
      const USER1 = config.accounts[1]
      const USER2 = config.accounts[2]
      const USER3 = config.accounts[3]
      const USER4 = config.accounts[4]
      const testData = {
        account: ADMIN,
        reciever_1: USER1,
        reciever_2: USER2,
        reciever_3: USER3,
        reciever_4: USER4,
        token_1: "100.0",
        token_2: "10.0",
        token_3: "10.0",
        token_4: "10.0",
      }
      const testData1 = { account: USER1 }
      const testData2 = { account: USER2 }
      const testData3 = { account: USER3 }
      const testData4 = { account: USER4 }
      await DappLib.mintTokensAndDistribute(testData)
      const res1 = await DappLib.getCCSBalance(testData1)
      const res2 = await DappLib.getCCSBalance(testData2)
      const res3 = await DappLib.getCCSBalance(testData3)
      const res4 = await DappLib.getCCSBalance(testData4)
      assert.equal(res1.result, 100.0, "Did not mint CCS tokens correctly")
      assert.equal(res2.result, 10.0, "Did not mint CCS tokens correctly")
      assert.equal(res3.result, 10.0, "Did not mint CCS tokens correctly")
      assert.equal(res4.result, 10.0, "Did not mint CCS tokens correctly")
    })

    it(`user1 can create activity`, async () => {
      const USER1 = config.accounts[1]
      const res1 = await DappLib.createActivity({
        account: USER1,
        title: "mercuryhackathon2021",
        startDate: new Date(2021, 9, 20),
        endDate: new Date(2021, 10, 31),
        content: "Build at IPFS or Flow, reward $3000 - $8000, has $150 attend reward. https://mercuryhackathon2021.com/",
        type_1: "DEV",
      })
      assert.notEqual(res1.result, null, "create activity transaction should return tx")
      const res2 = await DappLib.getCCSBalance({ account: USER1 })
      assert.equal(res2.result, 0.0, "After create activity, balance should be 0.0")
      const res3 = await DappLib.getActivity({ id: "0" })
      const activity = res3.result
      assert.equal(activity.id, 0, "activityId should be 0")
      assert.equal(activity.upVoteCount, 1, "upVoteCount should be 1")
      assert.equal(JSON.stringify(activity.voteResult), JSON.stringify({ [USER1]: true }),
        "voteResult should be {[USER1]: true}")
      assert.equal(activity.creator, USER1, "creator should be USER1")
      assert.equal(activity.closed, false, "activity should not be close")
      assert.notEqual(activity.metadata, null, "metadata should not be null")
    })


    it(`users can by ballots with CCSToken`, async () => {
      const USER2 = config.accounts[2]
      const USER3 = config.accounts[3]

      await DappLib.buyBallots({
        account: USER2,
        count: "1"
      })
      const res1 = await DappLib.getHoldings({ address: USER2 })
      assert.equal(res1.result, 1, "user2 should have 1 ballot")
      const res2 = await DappLib.getCCSBalance({ account: USER2 })
      assert.equal(res2.result, 9.0, "user2 should have 9.0 CCSToken")

      await DappLib.buyBallots({
        account: USER3,
        count: "5"
      })
      const res3 = await DappLib.getHoldings({ address: USER3 })
      assert.equal(res3.result, 5, "user3 should have 5 ballot")
      const res4 = await DappLib.getCCSBalance({ account: USER3 })
      assert.equal(res4.result, 5.0, "user3 should have 5.0 CCSToken")
    })


    it(`users can vote activity with CCSToken`, async () => {
      const USER1 = config.accounts[1]
      const USER2 = config.accounts[2]
      const USER3 = config.accounts[3]

      await DappLib.vote({
        account: USER2,
        activityId: "0",
        isUpVote: true
      })
      const res1 = await DappLib.getHoldings({ address: USER2 })
      assert.equal(res1.result, 0, "user2 should have 0 ballot")
      const res2 = await DappLib.getActivity({ id: "0" })
      assert.equal(res2.result.upVoteCount, 2, "upVoteCount should be 2")

      await DappLib.vote({
        account: USER3,
        activityId: "0",
        isUpVote: false
      })
      const res3 = await DappLib.getHoldings({ address: USER3 })
      assert.equal(res3.result, 4, "user3 should have 4 ballot")
      const res4 = await DappLib.getActivity({ id: "0" })
      assert.equal(res4.result.upVoteCount, 2, "upVoteCount should be 2")
      assert.equal(res4.result.downVoteCount, 1, "downVoteCount should be 1")

      try {
        await DappLib.vote({
          account: USER3,
          activityId: "0",
          isUpVote: true
        })
      } catch (error) {
        assert.notEqual(error, null, "user cannot vote same activity again, should raise error")
      }
    })


    it(`can get anyone's vote power, who no have memorials, voting power should be 0.01`, async () => {
      const ADMIN = config.accounts[0]
      const USER1 = config.accounts[1]
      const res1 = await DappLib.getVotingPower({ address: USER1 })
      assert.equal(res1.result, 0.01, "Account no memorials has 0.01 voting power")

      await DappLib.createAirdrop({
        account: ADMIN,
        title: "CryptoChaser's airdrop for early support",
        reciever_1: ADMIN,
        reciever_2: USER1,
        bonus: "99.99",
        metadata: JSON.stringify({
          content: "This is the special memorial for early chasers",
          type: "Airdrop"
        })
      })

      const res2 = await DappLib.getVotingPower({ address: ADMIN })
      assert.equal(res2.result, 100.0, "Admin has 100.0 voting power after airdrop")
      const res3 = await DappLib.getVotingPower({ address: USER1 })
      assert.equal(res3.result, 100.0, "Account has 100.0 voting power after airdrop")
    })


    it(`admin can close activity and mint NFT`, async () => {
      const ADMIN = config.accounts[0]
      const USER1 = config.accounts[1]
      const USER2 = config.accounts[2]
      const USER3 = config.accounts[3]
      const USER4 = config.accounts[4]

      await DappLib.closeActivity({
        account: ADMIN,
        activityId: "0",
        bonus: "0.1", // bonus should compute off-chain
        mintPositive: true
      })

      const res1 = await DappLib.getActivity({ id: "0" })
      assert.equal(res1.result.closed, true, "activity should be closed")
      await DappLib.buyBallots({ account: USER4, count: "1" })
      try {
        await DappLib.vote({
          account: USER4,
          activityId: "0",
          isUpVote: true
        })
      } catch (error) {
        assert(error.toString().includes("activity is closed"), "user cannot vote closed activity, should raise error")
      }

      // user1 and user2 should get NFT, user3 should not
      const res2 = await DappLib.getCollectionIds({ address: USER1 })
      assert.equal(res2.result.length, 2, "user1 should has two memorials")
      const res3 = await DappLib.getCollectionIds({ address: USER2 })
      assert.notEqual(res3.result.length, 0, "user2 should has NFT")
      const res4 = await DappLib.getCollectionIds({ address: USER3 })
      assert.equal(res4.result.length, 0, "user3 should not has NFT")
      const res5 = await DappLib.getVotingPower({ address: USER1 })
      assert.equal(res5.result, 100.1, "user1 has 100.1 voting power after mint memorise")
    })
  });
});