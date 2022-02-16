

   module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const InternalRouter = await deployments.get("AxialInternalRouterV0") 
    const ExternalRouter = await deployments.get('AxialExternalRouterV0')  

    console.log('Axial Aggregator deployment arguments: ', [
      InternalRouter.address, 
      ExternalRouter.address, 
    ])

    console.log(`V0) AxialAggregator`)

    const deployResult = await deploy("AxialAggregatorV0", {
      from: deployer,
      contract: "AxialAggregator",
      gas: 4000000,
      args: [
        InternalRouter.address, 
        ExternalRouter.address
      ],
		skipIfAlreadyDeployed: true
    });
  
    if (deployResult.newlyDeployed) {
		log(`- ${deployResult.contractName} deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`);
    } else {
		log(`- Deployment skipped, using previous deployment at: ${deployResult.address}`)
	}

    
  };


  module.exports.tags = ['V0', 'aggregator'];