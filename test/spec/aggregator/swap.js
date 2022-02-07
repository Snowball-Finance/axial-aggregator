const { ethers } = require("hardhat")
const { expect } = require("chai")

const fixtures = require('../../fixtures')
const helpers = require('../../helpers') 

describe('Axial Aggregator - Swap', () => {

    let fix;
    let internalRouterAddress;
    let externalRouterAddress;

    before(async () => {
        fix = await fixtures.general()
        const fixRouter = await fixtures.router()
        assets = fix.assets
        owner = fix.deployer
        AxialAggregator = fixRouter.AxialAggregator

        internalRouterAddress = await AxialAggregator.InternalRouter();
        externalRouterAddress = await AxialAggregator.ExternalRouter();
    })

    beforeEach(async () => {
        // Start each test with a fresh account
        trader = fix.genNewAccount()
    })

    it.only('Should return path using internal router and swap TSD to AVAI with correct amounts', async () => { 
        
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.TSD;
        let tokenOut = assets.AVAI;
        let steps = 3

        // Top up trader
        let [ topUpAmountIn ] = await fix.PangolinRouter.getAmountsIn(amountIn, [assets.WAVAX, assets.TSD])
        await fix.PangolinRouter.connect(trader).swapAVAXForExactTokens(
            amountIn, 
            [assets.WAVAX, assets.TSD], 
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
        expect(query.bestPath.path[0]).to.be.equal(assets.TSD);
        expect(query.bestPath.path[query.bestPath.path.length-1]).to.be.equal(assets.AVAI);

        // Adapters should be correct
        expect(query.bestPath.adapters.length).to.gte(2);

        // Approve internal rotuer
        await helpers.approveERC20(trader, tokenIn, internalRouterAddress, ethers.constants.MaxUint256);

        // Do swap
        const swap = () => AxialAggregator.connect(trader).swap(
            [
                query.bestPath.amounts[0], 
                query.bestPath.amounts[query.bestPath.amounts.length-1],
                query.bestPath.path,
                query.bestPath.adapters
            ],
            trader.address, 
            0,
            query.useInternalRouter
        )

        const tokenOutContract = await ethers.getContractAt('contracts/interface/IERC20.sol:IERC20', tokenOut)
        const expectedOutAmount = query.bestPath.amounts[query.bestPath.amounts.length-1]
        await expect(swap).to.changeTokenBalance(
            tokenOutContract, trader, expectedOutAmount
        )
    })
})