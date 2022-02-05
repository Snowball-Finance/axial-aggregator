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
        AxialAdapters = fixRouter._axialAdapters
    })

    beforeEach(async () => {
        // Start each test with a fresh account
        trader = fix.genNewAccount()
    })

    it('Should return path using internal router to swap TSD to USDCe', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.TSD;
        let tokenOut = assets.USDCe;
        let gasPrice = parseUnits('225', 'gwei');
        let steps = 3
        let result = await AxialAggregator.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        );

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters(AC4D -> AM3D)
        expect(result.bestPath.adapters.length).to.be.equal(2); 
        expect(result.bestPath.adapters[0]).to.be.equal(AxialAdapters.AxialAC4DAdapter.address);
        expect(result.bestPath.adapters[1]).to.be.equal(AxialAdapters.AxialAM3DAdapter.address);
        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3);
        expect(result.bestPath.path[0]).to.be.equal(assets.TSD);
        expect(result.bestPath.path[1]).to.be.equal(assets.DAIe);
        expect(result.bestPath.path[2]).to.be.equal(assets.USDCe);
    })

    it('Should return path using internal router to swap TSD to USDC', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.TSD;
        let tokenOut = assets.USDC;
        let gasPrice = parseUnits('225', 'gwei');
        let steps = 3;

        let result = await AxialAggregator.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        );

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters(AC4D -> AM3DUSDC)
        expect(result.bestPath.adapters.length).to.be.equal(2); 
        expect(result.bestPath.adapters[0]).to.be.equal(AxialAdapters.AxialAC4DAdapter.address);
        expect(result.bestPath.adapters[1]).to.be.equal(AxialAdapters.AxialAM3DUSDCAdapter.address);
        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3); 
        expect(result.bestPath.path[0]).to.be.equal(assets.TSD);
        expect(result.bestPath.path[1]).to.be.equal(assets.DAIe);
        expect(result.bestPath.path[2]).to.be.equal(assets.USDC);
    })

    it('Should return path using internal router to swap AVAI to FRAXc', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.AVAI;
        let tokenOut = assets.FRAXc;
        let gasPrice = parseUnits('225', 'gwei');
        let steps = 3;

        let result = await AxialAggregator.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        );

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 2 adapters(AA3D -> AC4D)
        expect(result.bestPath.adapters.length).to.be.equal(2); 
        expect(result.bestPath.adapters[0]).to.be.equal(AxialAdapters.AxialAA3DAdapter.address);
        expect(result.bestPath.adapters[1]).to.be.equal(AxialAdapters.AxialAC4DAdapter.address);
        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3); 
        expect(result.bestPath.path[0]).to.be.equal(assets.AVAI);
        expect(result.bestPath.path[1]).to.be.equal(assets.MIM);
        expect(result.bestPath.path[2]).to.be.equal(assets.FRAXc);
    })

    it('Should return path using internal router to swap USDC(Metapool) to USDTe', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.USDC;
        let tokenOut = assets.USDTe;
        let gasPrice = parseUnits('225', 'gwei');
        let steps = 3;

        let result = await AxialAggregator.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        );

        // Should use internal router
        expect(result.useInternalRouter).to.be.true;

        // Should use 3 adapters(AA3D -> AC4D)
        expect(result.bestPath.adapters.length).to.be.equal(3); 
        expect(result.bestPath.adapters[0]).to.be.equal(AxialAdapters.AxialAM3DUSDCAdapter.address);
        expect(result.bestPath.adapters[2]).to.be.equal(AxialAdapters.AxialAS4DAdapter.address);

        
        // Path should be correct
        expect(result.bestPath.path.length).to.be.equal(3); 
        expect(result.bestPath.path[0]).to.be.equal(assets.USDC);
        expect(result.bestPath.path[2]).to.be.equal(assets.USDTe);
    })

    it('Should return path using external router to swap SPELL to YAK', async () => { 
        let amountIn = ethers.utils.parseUnits('10');
        let tokenIn = assets.SPELL;
        let tokenOut = assets.YAK;
        let gasPrice = parseUnits('225', 'gwei');
        let steps = 3;

        let result = await AxialAggregator.findBestPath(
            amountIn, 
            tokenIn, 
            tokenOut, 
            steps,
            gasPrice,
            { gasLimit: 1e9 }
        );

        // Should use external router
        expect(result.useInternalRouter).to.be.false;

        // Should find a path
        expect(result.bestPath.amounts[result.bestPath.amounts.length-1]).to.gt('0')
        
        // Path should be correct
        expect(result.bestPath.path[0]).to.be.equal(assets.SPELL);
        expect(result.bestPath.path[result.bestPath.path.length-1]).to.be.equal(assets.YAK);
    })



})