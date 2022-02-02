// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.8.4; 

import "./lib/Ownable.sol";
import "./interface/IRouter.sol";

/// @notice Aggregator contract that helps swapping across known pools but favoring Axial pools when there is a path.
contract AxialAggregator is Ownable {
    /// @dev Router that swaps across Axial pools;
    address public InternalRouter;
    /// @dev Router that swaps across all non-Axial pools; 
    address public ExternalRouter;

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
    function findBestPath(FindBestPathParams calldata params) external view returns (IRouter.FormattedOfferWithGas memory, bool) {
        IRouter.FormattedOfferWithGas memory offer;
        bool UseInternalRouter;

        // Query internal router for best path
        IRouter internalRouter = IRouter(InternalRouter);
        offer = internalRouter.findBestPathWithGas(
            params.amountIn,
            params.tokenIn,
            params.tokenOut,
            params.maxSteps,
            params.gasPrice
        );

        // Check if internal router returned an offer
        if (offer.adapters.length > 0) {
            UseInternalRouter = true;
        } else {
            IRouter externalRouter = IRouter(ExternalRouter);
            offer = externalRouter.findBestPathWithGas(
                params.amountIn,
                params.tokenIn,
                params.tokenOut,
                params.maxSteps,
                params.gasPrice
            );
        }

        return (offer, UseInternalRouter);
    }

    function swap(
        IRouter.Trade calldata _trade,
        address _from,
        address _to,
        uint256 _fee,
        bool _useInternalRouter
    ) external {}
}
