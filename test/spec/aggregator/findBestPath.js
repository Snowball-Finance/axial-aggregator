const { expect } = require("chai")
const { ethers } = require("hardhat")

const { parseUnits } = ethers.utils

const fixtures = require('../../fixtures')

describe.only('Axial Aggregator - Find best path', () => {

    before(async () => {
        fix = await fixtures.general()
        const fixRouter = await fixtures.router()
        assets = fix.assets
        AxialAggregator = fixRouter.AxialAggregator
    })

    it('Should return path using internal router to swap TSD to USDCe', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.TSD;
        let tokenOut = assets.USDCe;
        let steps = 4
        let gasPrice = parseUnits('225', 'gwei');

        let result = await AxialAggregator.findBestPath([
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice
        ],{ gasLimit: 1e9 });

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters
        expect(result.bestPath.adapters.length).to.be.equal(2);  
        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3);
        expect(result.bestPath.path[0]).to.be.equal(tokenIn);
        expect(result.bestPath.path[result.bestPath.path.length-1]).to.be.equal(tokenOut);
    })

    it('Should return path using internal router to swap TSD to USDC', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.TSD;
        let tokenOut = assets.USDC;
        let steps = 4
        let gasPrice = parseUnits('225', 'gwei');

        let result = await AxialAggregator.findBestPath([
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice
        ],{ gasLimit: 1e9 });

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters
        expect(result.bestPath.adapters.length).to.be.equal(2); 
        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3); 
        expect(result.bestPath.path[0]).to.be.equal(tokenIn);
        expect(result.bestPath.path[result.bestPath.path.length-1]).to.be.equal(tokenOut);
    })

    it('Should return path using internal router to swap AVAI to FRAXc', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.AVAI;
        let tokenOut = assets.FRAXc;
        let steps = 4
        let gasPrice = parseUnits('225', 'gwei');

        let result = await AxialAggregator.findBestPath([
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice
        ],{ gasLimit: 1e9 });

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters
        expect(result.bestPath.adapters.length).to.be.equal(2); 
        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3); 
        expect(result.bestPath.path[0]).to.be.equal(tokenIn);
        expect(result.bestPath.path[result.bestPath.path.length-1]).to.be.equal(tokenOut);
    })

    it('Should return path using internal router to swap USDC(Metapool) to USDTe', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.USDC;
        let tokenOut = assets.USDTe;
        let steps = 4
        let gasPrice = parseUnits('225', 'gwei');

        let result = await AxialAggregator.findBestPath([
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice
        ],{ gasLimit: 1e9 });

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 3 adapters
        expect(result.bestPath.adapters.length).to.be.equal(2); 

        // Path should be correct
        expect(result.bestPath.path[0]).to.be.equal(tokenIn);
        expect(result.bestPath.path[result.bestPath.path.length-1]).to.be.equal(tokenOut);
    })

    it('Should return path using external router to swap SPELL to YAK', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.SPELL;
        let tokenOut = assets.YAK;
        let steps = 4
        let gasPrice = parseUnits('225', 'gwei');

        let result = await AxialAggregator.findBestPath([
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice
        ],{ gasLimit: 1e9 });

        // Should use external router
        expect(result.useInternalRouter).to.be.false;

        // Should find a path
        expect(result.bestPath.amounts[result.bestPath.amounts.length-1]).to.gt('0')
        
        // Path should be correct
        expect(result.bestPath.path[0]).to.be.equal(tokenIn);
        expect(result.bestPath.path[result.bestPath.path.length-1]).to.be.equal(tokenOut);
    })
})