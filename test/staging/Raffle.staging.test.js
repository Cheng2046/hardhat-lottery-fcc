const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains, networkConfig } = require("../../helper-hardhat-config");

//!only run when we're on a testnet

developmentChains.includes(network.name) //network.name = hardhat, localhost
  ? describe.skip
  : describe("Raffle Staging Tests", function () {
      let raffle, raffleEntranceFee, deployer, accounts;
      // it come from the hre object lol
      beforeEach(async function () {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });
      describe("fulfillRandomWords", () => {
        it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
          console.log("Setting up test...");
        
          const startingTimeStamp = await raffle.getLastestTimeStamp();

          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked event fired!");
              console.log("Wait 30 seconds");
              try {
                setTimeout(async () => {
                  const recentWinner = await raffle.getRecentWinner();
                  const raffleState = await raffle.getRaffleState();
                  const winnerEndingBalance = await accounts[0].getBalance();
                  const endingTimeStamp = await raffle.getLastestTimeStamp();
                  const numPlayers = await raffle.getNumberOfPlayers();
                  console.log(
                    `Winner ending Balance is ${ethers.utils.formatEther(winnerEndingBalance)}`
                  );

                  // await expect(raffle.getPlayer(0)).to.be.reverted;
                  assert.equal(numPlayers.toString(), "0");
                  assert.equal(recentWinner.toString(), accounts[0].address);
                  assert.equal(raffleState.toString(), "0");
                  assert.equal(
                    winnerEndingBalance.toString(),
                    winnerStartingBalance.add(raffleEntranceFee).toString()
                  );
                  assert.equal(endingTimeStamp > startingTimeStamp, true);
                  resolve();
                }, "30000");

                // add our assert here
              } catch (e) {
                reject(e);
              }
            });

            console.log("Entering Raffle...");

            const tx = await raffle.enterRaffle({ value: raffleEntranceFee });
            await tx.wait(1);
            console.log("Ok, time to wait...");
            const winnerStartingBalance = await accounts[0].getBalance();
            console.log(
              `Winner starting Balance is ${ethers.utils.formatEther(winnerStartingBalance)}`
            );
       
            //! this code will not complete until our listener has finished listening!
          });
        });
      });
    });
