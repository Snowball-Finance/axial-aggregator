const addresses = require('../../addresses.json')
const { assets } = addresses

const testCases = [
    // TSD in        
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' },
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' }, 
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.TSD, tokenInSymbol: 'TSD' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // DAIe in
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' },
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' }, 
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.DAIe, tokenInSymbol: 'DAIe' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // MIM in
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' }, 
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.MIM, tokenInSymbol: 'MIM' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // FRAXc in
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' }, 
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.FRAXc, tokenInSymbol: 'FRAXc' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // USDCe in
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' }, 
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' },
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.USDCe, tokenInSymbol: 'USDCe' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // USDC in
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' }, 
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' },
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.USDC, tokenInSymbol: 'USDC' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // TUSD in
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' }, 
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' },
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' }, //TODO: Fails on mainnet. No path found. TUSD -> USDCe
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' },
    {tokenIn: assets.TUSD, tokenInSymbol: 'TUSD' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // USDTe in
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' }, 
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' },
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.USDTe, tokenInSymbol: 'USDTe' , tokenOut: assets.AVAI, tokenOutSymbol: 'AVAI' },

    // AVAI in
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.TSD, tokenOutSymbol: 'TSD' },
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.DAIe, tokenOutSymbol: 'DAIe' },
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.MIM, tokenOutSymbol: 'MIM' }, 
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.FRAXc, tokenOutSymbol: 'FRAXc' },
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.USDCe, tokenOutSymbol: 'USDCe' },
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.USDC, tokenOutSymbol: 'USDC' },
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.TUSD, tokenOutSymbol: 'TUSD' },
    {tokenIn: assets.AVAI, tokenInSymbol: 'AVAI' , tokenOut: assets.USDTe, tokenOutSymbol: 'USDTe' }
]


module.exports = {
    testCases
}