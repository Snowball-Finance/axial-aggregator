const { expect } = require("chai")
const { ethers } = require("hardhat")
const fixtures = require('../../fixtures')
const { parseUnits, formatUnits } = ethers.utils

describe('Axial Aggregator - Find best path', () => {

    before(async () => {
        fix = await fixtures.general()
        const fixRouter = await fixtures.router()
        AxialRouterFactory = fixRouter.AxialRouterFactory
        AxialRouter = fixRouter.AxialRouter
        adapters = fixRouter.adapters
        LydiaRouter = fix.LydiaRouter
        PangolinRouter = fix.PangolinRouter
        assets = fix.assets
        tkns = fix.tokenContracts
        owner = fix.deployer
        AxialAggregator = fixRouter.AxialAggregator
    })

    beforeEach(async () => {
        // Start each test with a fresh account
        trader = fix.genNewAccount()
    })

    it.only('Should run', async () => { 
 
        let amountIn = ethers.utils.parseUnits('1')
        let tokenIn = assets.PNG
        let tokenOut = assets.ETH
        let gasPrice = parseUnits('225', 'gwei')
        let steps = 3
        let result = await AxialAggregator.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        )

        console.log(result);
    })



})