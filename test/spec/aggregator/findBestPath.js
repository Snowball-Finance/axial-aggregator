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

    it.only('Should return path using internal router connecting AC4D & AM3D(TSD -> DAIe -> USDCe)', async () => { 
 
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.TSD
        let tokenOut = assets.USDCe
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

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters(AC4D -> AM3D)
        expect(result.bestPath.adapters.length).to.be.equal(2); 

        // TODO: Check adapter[0] == AC4D
        // TODO: Check adapter[1] == AM3D
        // TODO: Check tokenIn == TSD
        // TODO: Check `tokenOut` == DAIe
    })



})