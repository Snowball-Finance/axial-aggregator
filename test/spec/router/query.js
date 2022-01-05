const { expect } = require("chai")
const { ethers } = require("hardhat")
const fixtures = require('../../fixtures')
const { parseUnits, formatUnits } = ethers.utils

describe('Axial Router - query', () => {

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
    })

    beforeEach(async () => {
        // Start each test with a fresh account
        trader = fix.genNewAccount()
    })

    it('Return the best option for trade between adapters', async () => {
        let adapterCount = await AxialRouter.adaptersCount()
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.DAI
        let tokenOut = assets.USDT
        let options = []
        for (let i=0; i<adapterCount; i++) {
            let result = await AxialRouter.queryAdapter(
                amountIn, 
                tokenIn, 
                tokenOut,
                i
            )
            options.push(result)
        }
        let bestOptionQuery = await AxialRouter['queryNoSplit(uint256,address,address)'](
            amountIn, 
            tokenIn,
            tokenOut
        )
        // Check that number of options equals the number of adapters
        expect(await AxialRouter.adaptersCount()).to.equal(options.length)
        // Check that the most profitable option is returned as the best option
        let bestOptionCalc = options.sort((a, b) => b.gt(a) ? 1 : -1 )[0]
        expect(bestOptionCalc).to.equal(bestOptionQuery[3])
    })

    xit('Return the best path between two tokens that are directly connected', async () => {
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.WAVAX
        let tokenOut = assets.SUSHI
        let steps = 2
        let result = await AxialRouter.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps
        )
        // Only one step (direct connection)
        expect(result.adapters.length).to.equal(1)
        // Path consists of from and to token
        expect(result.path[0]).to.equal(tokenIn)
        expect(result.path[result.path.length-1]).to.equal(tokenOut)
        // First amount equals input amount
        expect(result.amounts[0]).to.equal(amountIn)
        // Amountout equals the query without split
        let bestOptionQuery = await AxialRouter['queryNoSplit(uint256,address,address)'](
            amountIn, 
            tokenIn,
            tokenOut
        )
        expect(bestOptionQuery.amountOut).to.equal(result.amounts[1])
    }).timeout(1e6)

    it('Return the best path between two tokens that are not directly connected (WAVAX -> ZDAI)', async () => {
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.WAVAX
        let tokenOut = assets.ZDAI
        let steps = 2
        let result = await AxialRouter.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps
        )
        // Expect to find a path 
        expect(result.amounts[result.amounts.length-1]).to.gt('0')
        // Expect first token in the path to be token from
        expect(result.path[0]).to.equal(tokenIn)
        // Expect the last token in the path to be token to
        expect(result.path[result.path.length-1]).to.equal(tokenOut)
    })

    it('Return the best path between two tokens that are not directly connected (ZERO -> LYDIA)', async () => {
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.ZERO
        let tokenOut = assets.LYD
        let steps = 2
        let result = await AxialRouter.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps
        )
        // Expect to find a path 
        expect(result.amounts[result.amounts.length-1]).to.gt('0')
        // Expect first token in the path to be token from
        expect(result.path[0]).to.equal(tokenIn)
        // Expect the last token in the path to be token to
        expect(result.path[result.path.length-1]).to.equal(tokenOut)
    })

    it('Return the best path between two trusted tokens', async () => {
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.DAI
        let tokenOut = assets.DAI
        let steps = 2
        let result = await AxialRouter.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps
        )
        // Expect to find a path 
        expect(result.amounts[result.amounts.length-1]).to.gt('0')
        // Expect first token in the path to be token from
        expect(result.path[0]).to.equal(tokenIn)
        // Expect the last token in the path to be token to
        expect(result.path[result.path.length-1]).to.equal(tokenOut)
    })

    it('Return an empty array if no path is found between the tokens', async () => {
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.WBTC
        let tokenOut = AxialRouter.address  // Not a token
        let steps = 2
        let result = await AxialRouter.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps
        )
        // Expect empty arrays
        expect(result.amounts).to.be.empty
        expect(result.adapters).to.be.empty
        expect(result.path).to.be.empty
    })

    it('Return the best path with 4 steps', async () => {
        let amountIn = ethers.utils.parseUnits('10')
        let tokenIn = assets.ZUSDT
        let tokenOut = assets.TUSD
        let steps = 4
        let result = await AxialRouter.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps
        )
        // Expect to find a path 
        expect(result.amounts[result.amounts.length-1]).to.gt('0')
        // Expect first token in the path to be token from
        expect(result.path[0]).to.equal(tokenIn)
        // Expect the last token in the path to be token to
        expect(result.path[result.path.length-1]).to.equal(tokenOut)
    })

    it('Returning best path with gas should return gasEstimate', async () => {
        let amountIn = ethers.utils.parseUnits('1')
        let tokenIn = assets.PNG
        let tokenOut = assets.ETH
        let gasPrice = parseUnits('225', 'gwei')
        let steps = 3
        let result = await AxialRouter.findBestPathWithGas(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        )
        // Expect to find a path 
        expect(result.amounts[result.amounts.length-1]).to.gt('0')
        // Expect first token in the path to be token from
        expect(result.path[0]).to.equal(tokenIn)
        // Expect the last token in the path to be token to
        expect(result.path[result.path.length-1]).to.equal(tokenOut)
        expect(result.gasEstimate).to.gt(fix.ZERO)
        // console.log(result)
        // console.log('Gas estimate:', ethers.utils.formatUnits(result.gasEstimate, 9))
    })


})