// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

/// @notice Router contract interface
interface IRouter {
    struct Trade {
        uint amountIn;
        uint amountOut;
        address[] path;
        address[] adapters;
    }

    struct FormattedOffer {
        uint[] amounts;
        address[] adapters;
        address[] path;
    }

    struct FormattedOfferWithGas {
        uint[] amounts;
        address[] adapters;
        address[] path;
        uint gasEstimate;
    }

    function findBestPath(
        uint256 _amountIn, 
        address _tokenIn, 
        address _tokenOut, 
        uint _maxSteps
    ) external view returns (FormattedOffer memory);

    function findBestPathWithGas(
        uint256 _amountIn, 
        address _tokenIn, 
        address _tokenOut, 
        uint _maxSteps,
        uint _gasPrice,
        uint _tokenOutPrice
    ) external view returns (FormattedOfferWithGas memory);
  
    function swapNoSplit(
        Trade calldata _trade,
        address _to,
        uint _fee
    ) external;
}