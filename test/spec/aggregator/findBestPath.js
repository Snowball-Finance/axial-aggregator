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
    })

    beforeEach(async () => {
        // Start each test with a fresh account
        trader = fix.genNewAccount()
    })



})