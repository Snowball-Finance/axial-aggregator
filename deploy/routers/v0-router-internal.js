const { ethers } = require("hardhat");
const { assets } = require('../../test/addresses.json')

const WAVAX = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'

async function getAdaptersForRouter(axialRouter) {
    let adapterCount = await axialRouter.adaptersCount().then(r => r.toNumber())
    return Promise.all(
        [...Array(adapterCount).keys()].map(i => axialRouter.ADAPTERS(i))
    )
}

async function getTrustedTokensForRouter(axialRouter) {
  let trustedTokensCount = await axialRouter.trustedTokensCount().then(r => r.toNumber())
  return Promise.all(
      [...Array(trustedTokensCount).keys()].map(i => axialRouter.TRUSTED_TOKENS(i))
  )
}

async function noDuplicates(_array) {
  if ((new Set(_array)).size != _array.length) {
    throw new Error('Duplicated array: ', _array.join(', '))
  }
}

async function routerHasWAVAXAllowance(axialRouterAddress) {
  let wavaxContract = await ethers.getContractAt('contracts/interface/IERC20.sol:IERC20', WAVAX)
  let allowance = await wavaxContract.allowance(axialRouterAddress, WAVAX)
  return allowance.gt('0')
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const BytesManipulationV0 = await deployments.get("BytesManipulationV0") 
    const AxialAS4DYakAdapterV0 = await deployments.get('AxialAS4DYakAdapterV0')  
    const AxialAM3DUSDCYakAdapterV0 = await deployments.get('AxialAM3DUSDCYakAdapterV0')
    const AxialAM3DYakAdapterV0 = await deployments.get('AxialAM3DYakAdapterV0')
    const AxialAA3DYakAdapterV0 = await deployments.get('AxialAA3DYakAdapterV0')
    const AxialAC4DYakAdapterV0 = await deployments.get('AxialAC4DYakAdapterV0') 

    // Bottom arguments can all be changed after the deployment
    const TRUSTED_TOKENS = [
      assets.DAIe,
      assets.MIM,
      assets.FRAXc,
      assets.TSD,
      assets.USDCe,
      assets.USDC,
      assets.TUSD,
      assets.USDTe,
      assets.AVAI    
    ];
    const ADAPTERS = [
        AxialAS4DYakAdapterV0.address,
        AxialAM3DUSDCYakAdapterV0.address,
        AxialAM3DYakAdapterV0.address,
        AxialAA3DYakAdapterV0.address,
        AxialAC4DYakAdapterV0.address
      ];
    const FEE_CLAIMER = deployer
    noDuplicates(TRUSTED_TOKENS)
    noDuplicates(ADAPTERS)
    console.log('Axial Router deployment arguments: ', [
      ADAPTERS, 
      TRUSTED_TOKENS, 
      FEE_CLAIMER
    ])
    log(`V0) AxialInternalRouter`)
    const deployResult = await deploy("AxialInternalRouterV0", {
      from: deployer,
      contract: "AxialRouter",
      gas: 4000000,
      args: [
        ADAPTERS, 
        TRUSTED_TOKENS, 
        FEE_CLAIMER
      ],
		libraries: {
		'BytesManipulation': BytesManipulationV0.address
		},
		skipIfAlreadyDeployed: true
    });
  
    if (deployResult.newlyDeployed) {
		log(`- ${deployResult.contractName} deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`);
    } else {
		log(`- Deployment skipped, using previous deployment at: ${deployResult.address}`)
	}

	let axialRouter = await ethers.getContractAt('AxialRouter', deployResult.address)
	let deployerSigner = new ethers.Wallet(process.env.PK_DEPLOYER, ethers.provider)

	// Add adapters if some of them are not added
	let currentAdapters = await getAdaptersForRouter(axialRouter)
	let allAdaptersIncluded = ADAPTERS.length == currentAdapters.length && ADAPTERS.every(a => currentAdapters.includes(a))
	if (!allAdaptersIncluded) {
		// Add adapters
		console.log('Adding adapters:', ADAPTERS.join('\n\t- '))
		await axialRouter.connect(deployerSigner).setAdapters(
			ADAPTERS
		).then(r => r.wait(2))
	}
	// Add trusted tokens if some of them are not added
	let currentTrustedTokens = await getTrustedTokensForRouter(axialRouter)
	let allTrustedTknAdded = TRUSTED_TOKENS.length == currentTrustedTokens.length && TRUSTED_TOKENS.every(a => currentTrustedTokens.includes(a))
	if (!allTrustedTknAdded) {
		// Add trusted tokens
		console.log('Adding trusted tokens:', TRUSTED_TOKENS.join('\n\t- '))
		await axialRouter.connect(deployerSigner).setTrustedTokens(
			TRUSTED_TOKENS
		).then(r => r.wait(2))
	}
	// Approve router for WAVAX contract
	let positiveAllowance = await routerHasWAVAXAllowance(axialRouter.address)
	if (!positiveAllowance) {
    throw new Error('Router is missing allowance for WAVAX contract')
		// // Increase allowance
		// console.log('Increasing router allowance for WAVAX')
		// await axialRouter.connect(deployerSigner).approveTokenForSpender(
		// 	WAVAX, 
		// 	WAVAX, 
		// 	ethers.constants.MaxUint256
		// ).then(r => r.wait(2))
	}
    
  };

  module.exports.tags = ['V0', 'router'];