const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Tests", async function() {
        let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer, interval
        const chainId = network.config.chainId

        beforeEach(async function() {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture("all")
            raffle = await ethers.getContract("Raffle", deployer)
            vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            raffleEntranceFee = await raffle.getEntranceFee()
            interval = await raffle.getInterval()
        })

        describe("constructor", async function() {
            inputToConfig("initializes the raffle correctly", async function() {
                const raffleState = await raffle.getRaffleState()
                const interval = await raffle.getInterval()
                assert.equal(raffleState.toString(), "0")
                assert.equal(interval.toString(), networkConfig[chainId]["interval"])
            })
        })

        describe("enterRaffle", async function() {
            it("reverts when you dont pay enough", async function() {
                await expect(raffle.enterRaffle()).to.be.revertedWith("Raffle__SendMoreToEnterRaffle")
            })
            it("records players when they enter", async function() {
                await raffle.enterRaffle({value: raffleEntranceFee})
                const playerFromContract = await raffle.getPlayer(0)
                assert.equal(playerFromContract, deployer)
            })
            it("emits event on enter", async function() {
                await expect(raffle.enterRaffle({value: raffleEntranceFee})).to.emit(raffle,"RaffleEnter")
            })
            it("doesnt allow entrance when raffle is closed", async function() {
                await raffle.enterRaffle({value: raffleEntranceFee})
                await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                await network.provider.send("evm_mine",[])
                //we pretend to be achainlink keeper
                await raffle.performUpkeep([])
                await expect(raffle.enterRaffle({value: raffleEntranceFee})).to.be.revertedWith("Raffle__RaffleNotOpen")

            })
            describe("checkUpKeep", async function() {
                it("returns false if people havent sent ETH", async function() {
                    await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
                    await network.provider.send("evm_mine", [])
                    const {upkeepNeeded } = await raffle.callStatic.checkUpkeep([])
                    assert(!upkeepNeeded)
                })
                it("returns false if raffle isn't open", async () => {
                    await raffle.enterRaffle({ value: raffleEntranceFee })
                    await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                    await network.provider.request({ method: "evm_mine", params: [] })
                    await raffle.performUpkeep([]) // changes the state to calculating
                    const raffleState = await raffle.getRaffleState() // stores the new state
                    const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                    assert.equal(raffleState.toString() == "1", upkeepNeeded == false)
                })
                it("returns false if enough time hasn't passed", async () => {
                    await raffle.enterRaffle({ value: raffleEntranceFee })
                    await network.provider.send("evm_increaseTime", [interval.toNumber() - 5]) // use a higher number here if this test fails
                    await network.provider.request({ method: "evm_mine", params: [] })
                    const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                    assert(!upkeepNeeded)
                })
            })
        })
    })