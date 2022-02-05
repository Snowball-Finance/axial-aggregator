// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./lib/Ownable.sol";
import "./interface/IRouter.sol";
import "./lib/SafeMath.sol";

import "hardhat/console.sol";

/// @notice Aggregator contract that helps swapping across known pools but favoring Axial pools when there is a path.
contract AxialAggregator is Ownable {
    using SafeMath for uint;

    /// @dev Router that swaps across Axial pools;
    address public InternalRouter;
    /// @dev Router that swaps across all non-Axial pools; 
    address public ExternalRouter;

    address public constant WAVAX = 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7;

    struct FindBestPathParams {
        uint256 amountIn;
        address tokenIn;
        address tokenOut;
        uint256 maxSteps;
        uint256 gasPrice;
    }

    constructor(address _internalRouter, address _externalRouter) {
        require(
            _internalRouter != address(0),
            "InternalRouter address must be provided"
        );
        require(
            _externalRouter != address(0),
            "EnternalRouter address must be provided"
        );

        InternalRouter = _internalRouter;
        ExternalRouter = _externalRouter;
    }

    /// @notice Finds the best path between tokenIn & tokenOut, checking Axial owned pools first.
    function findBestPath(uint256 _amountIn, 
        address _tokenIn, 
        address _tokenOut, 
        uint _maxSteps,
        uint _gasPrice
        ) external view returns (IRouter.FormattedOfferWithGas memory bestPath, bool useInternalRouter) {
        IRouter.FormattedOfferWithGas memory offer;
        bool UseInternalRouter;

        IRouter internalRouter = IRouter(InternalRouter);
        IRouter externalRouter = IRouter(ExternalRouter);

        // Get token out price by querying external router
        IRouter.FormattedOffer memory gasQuery = externalRouter.findBestPath(1e18, WAVAX, _tokenOut, 2);
        uint tknOutPriceNwei = gasQuery.amounts[gasQuery.amounts.length-1].mul(_gasPrice/1e9);

        // Query internal router for best path
        offer = internalRouter.findBestPathWithGas(
            _amountIn,
            _tokenIn,
            _tokenOut,
            _maxSteps,
            _gasPrice,
            tknOutPriceNwei
        );

        // Check if internal router returned an offer
        if (offer.adapters.length > 0) {
            UseInternalRouter = true;
        } else {
            offer = externalRouter.findBestPathWithGas(
                _amountIn,
                _tokenIn,
                _tokenOut,
                _maxSteps,
                _gasPrice,
                0
            );
        }

        return (offer, UseInternalRouter);
    }

    function swap(
        IRouter.Trade calldata _trade,
        address _to,
        uint256 _fee,
        bool _useInternalRouter
    ) external {
        require(_to != address(0), "Aggregator: _to is the zero address");

        IRouter router;

        if(_useInternalRouter) {
            router = IRouter(InternalRouter);
            router.swapNoSplit(_trade, _to, _fee);
        }
        else{
            router = IRouter(ExternalRouter);
            router.swapNoSplit(_trade, _to, _fee);
        }
    }
}
