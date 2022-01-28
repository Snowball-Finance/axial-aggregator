const { expect } = require("chai")
const { ethers } = require("hardhat")

let deployer;
let router;

const testTokenAddress = "0xd586e7f844cea2f87f50152665bcbc2c279d8d70";
const testTokenList =  [
    "0x5302AedD1b484fBe70EFd91Ca0C40785f5B4A69d",
    "0x2D5Cb006177EF6836c7CC73CE18E9Bb0542CBBe3",
    "0x48E6013EcF4d40ce15c5223B62Fc2FE33296C2e4"
];

describe.only('Axial Router - Primary Tokens', () => {

    before(async () => {
        [deployer] = await ethers.getSigners();

        const BytesManipulationFactory = await ethers.getContractFactory('BytesManipulation')
        const BytesManipulation = await BytesManipulationFactory.deploy()
        
        const AxialRouterFactory = await ethers.getContractFactory('AxialRouter', { 
            libraries: {
                'BytesManipulation': BytesManipulation.address
            } 
        })
        router = await AxialRouterFactory.connect(deployer).deploy(
            ['0x5302AedD1b484fBe70EFd91Ca0C40785f5B4A69d'], 
            ['0x5302AedD1b484fBe70EFd91Ca0C40785f5B4A69d'], 
            deployer.address);
        await router.deployed();
    })

    beforeEach(async () => {
        
    })

    it('Should add/remove address from primary tokens list', async () => {
        const isPrimaryTokenBefore = await router.isPrimaryToken(testTokenAddress)
        expect(isPrimaryTokenBefore).to.equal(false)

        await router.connect(deployer).addPrimaryToken(testTokenAddress)

        const isPrimaryTokenAfterAdd = await router.isPrimaryToken(testTokenAddress)
        expect(isPrimaryTokenAfterAdd).to.equal(true)

        await router.connect(deployer).removePrimaryToken(testTokenAddress)

        const isPrimaryTokenAfterRemove = await router.isPrimaryToken(testTokenAddress)
        expect(isPrimaryTokenAfterRemove).to.equal(false)
    }) 

    it('Should revert when removing non-primary token from primary tokens list', async () => {
        const isPrimaryTokenBefore = await router.isPrimaryToken(testTokenAddress)
        expect(isPrimaryTokenBefore).to.equal(false)

        await expect(router.connect(deployer).removePrimaryToken(testTokenAddress)).to.be.revertedWith(
            "AxialRouter: Token is not a primary token"
          );
    })

    it('Should add/remove all specified primary tokens', async () => {

        for (let index = 0; index < testTokenList.length; index++) {
            const testToken = testTokenList[index];
            const isPrimaryTokenBefore = await router.isPrimaryToken(testToken)
            expect(isPrimaryTokenBefore).to.equal(false)
        }

        await router.connect(deployer).addPrimaryTokens(testTokenList)
        for (let index = 0; index < testTokenList.length; index++) {
            const testToken = testTokenList[index];
            const isPrimaryTokenAfterBulkAdd = await router.isPrimaryToken(testToken)
            expect(isPrimaryTokenAfterBulkAdd).to.equal(true)
        }

        await router.connect(deployer).removePrimaryTokens(testTokenList)
        for (let index = 0; index < testTokenList.length; index++) {
            const testToken = testTokenList[index];
            const isNotPrimaryTokenAfterBulkRemove = await router.isPrimaryToken(testToken)
            expect(isNotPrimaryTokenAfterBulkRemove).to.equal(false)
        }
    }) 
})