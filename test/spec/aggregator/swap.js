const { ethers } = require("hardhat")
const { expect } = require("chai")

const fixtures = require('../../fixtures')
const helpers = require('../../helpers') 
const addresses = require('../../addresses.json')

const { assets } = addresses

describe.only('Axial Aggregator - Swap', () => {

    let fix;

    const testCases = [
        {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAX' },
        {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },
        {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAX' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },
        {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
        {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
        {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' },
        {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    ]

    before(async () => {
        fix = await fixtures.general();
        const fixRouter = await fixtures.router(); 
        owner = fix.deployer;
        AxialAggregator = fixRouter.AxialAggregator;
        AxialRouter = fixRouter.AxialRouter;
        InternalRouter = fixRouter.InternalAxialRouter;
    })

    beforeEach(async () => {
        // Start each test with a fresh account
        trader = fix.genNewAccount()
    })

    testCases.forEach(testCase => {
        it(`Should return path using internal router and swap ${testCase.tokenInSymbol} to ${testCase.tokenOutSymbol} with correct amounts`, async () => { 
            let amountIn = ethers.utils.parseUnits('1', 6)
            let tokenIn = testCase.tokenIn;
            let tokenOut = testCase.tokenOut;
            let steps = 4

            // Top up trader
            let [ topUpAmountIn ] = await fix.PangolinRouter.getAmountsIn(amountIn, [assets.WAVAX, tokenIn])
            await fix.PangolinRouter.connect(trader).swapAVAXForExactTokens(
                amountIn, 
                [assets.WAVAX, tokenIn], 
                trader.address, 
                parseInt(Date.now()/1e3)+3000, 
                { value: topUpAmountIn }
            ).then(response => response.wait())

            // Query for best path
            let query = await AxialAggregator.findBestPath([
                amountIn, 
                tokenIn, 
                tokenOut, 
                steps
            ]);

            // Should use internal router
            expect(query.useInternalRouter).to.be.true; 
            
            // Path should be correct
            expect(query.bestPath.path[0]).to.be.equal(tokenIn);
            expect(query.bestPath.path[query.bestPath.path.length-1]).to.be.equal(tokenOut);

            // Should have adapters
            expect(query.bestPath.adapters.length).to.gt(0);

            // Approve Aggregator
            await helpers.approveERC20(trader, tokenIn, AxialAggregator.address, ethers.constants.MaxUint256);

            // Do swap
            const swap = () => AxialAggregator.connect(trader).swap(
                [
                    amountIn, 
                    query.bestPath.amounts[query.bestPath.amounts.length-1],
                    query.bestPath.path,
                    query.bestPath.adapters
                ],
                trader.address, 
                0,
                query.useInternalRouter
            );

            const tokenOutContract = await ethers.getContractAt('contracts/interface/IERC20.sol:IERC20', tokenOut)
            const expectedOutAmount = query.bestPath.amounts[query.bestPath.amounts.length-1]

            await expect(swap).to.changeTokenBalance(
                tokenOutContract, trader, expectedOutAmount
            )
        });    
    }); 
})