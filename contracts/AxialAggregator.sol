// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

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
    }


    event UpdatedInternalRouter(
        address _oldInternalRouter, 
        address _newInternalRouter
    );


    event UpdatedExternalRouter(
        address _oldExternalRouter, 
        address _newExternalRouter
    );

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

    function setInternalRouter(address _internalRouter) public onlyOwner {
        emit UpdatedInternalRouter(InternalRouter, _internalRouter);
        InternalRouter = _internalRouter;
    }

    function setExternalRouter(address _externalRouter) public onlyOwner {
        emit UpdatedExternalRouter(ExternalRouter, _externalRouter);
        ExternalRouter = _externalRouter;
    }

    /// @notice Finds the best path between tokenIn & tokenOut, checking Axial owned pools first.
    /// @param _params This includes the input token, output token, max number of steps to use and amount in.
    function findBestPath(FindBestPathParams calldata _params) external view returns (IRouter.FormattedOffer memory bestPath, bool useInternalRouter) {
        IRouter.FormattedOffer memory offer;
        bool UseInternalRouter;

        IRouter internalRouter = IRouter(InternalRouter);
        IRouter externalRouter = IRouter(ExternalRouter);

        // Query internal router for best path
        offer = internalRouter.findBestPath(
            _params.amountIn,
            _params.tokenIn,
            _params.tokenOut,
            _params.maxSteps
        );

        // Check if internal router returned an offer
        if (offer.adapters.length > 0) {
            UseInternalRouter = true;
        } else {
            offer = externalRouter.findBestPath(
                _params.amountIn,
                _params.tokenIn,
                _params.tokenOut,
                _params.maxSteps
            );
        }

        return (offer, UseInternalRouter);
    }

    /// @notice Swaps input token to output token using the specified path and adapters.
    /// @param _trade This includes the input token, output token, the path to use, adapters and input amounts.
    /// @param _to The output amount will be sent to this address.
    /// @param _fee The fee to be paid by the sender.
    /// @param _useInternalRouter Specifies whether to use the internal router or external router.
    /// @dev The router being used for the swap must be approved to spend users input token.
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
