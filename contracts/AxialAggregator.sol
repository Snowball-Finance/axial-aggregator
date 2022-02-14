// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

import "./lib/Ownable.sol";
import "./interface/IRouter.sol";
import "./lib/SafeMath.sol";

/// @notice Aggregator contract to help swapping across known pools but favoring Axial pools when there is a path.
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
        uint gasPrice;
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
            "Aggregator: _internalRouter not set"
        );
        require(
            _externalRouter != address(0),
            "Aggregator: _externalRouter not set"
        );

        InternalRouter = _internalRouter;
        ExternalRouter = _externalRouter;
    }

    /// @notice Set router to be used for swapping across Axial pools.
    function setInternalRouter(address _internalRouter) public onlyOwner {
        emit UpdatedInternalRouter(InternalRouter, _internalRouter);
        InternalRouter = _internalRouter;
    }

    /// @notice Set router to be used for swapping across non-Axial pools.
    function setExternalRouter(address _externalRouter) public onlyOwner {
        emit UpdatedExternalRouter(ExternalRouter, _externalRouter);
        ExternalRouter = _externalRouter;
    }

    /// @notice Finds the best path between tokenIn & tokenOut, checking Axial owned pools first.
    /// @param _params This includes the input token, output token, max number of steps to use and amount in.
    function findBestPath(FindBestPathParams calldata _params) external view returns (IRouter.FormattedOfferWithGas memory bestPath, bool useInternalRouter) {
        IRouter.FormattedOfferWithGas memory offer;
        bool UseInternalRouter;

        IRouter.FormattedOffer memory gasQuery = IRouter(ExternalRouter).findBestPath(1e18, WAVAX, _params.tokenOut, 2);
        uint tknOutPriceNwei = gasQuery.amounts[gasQuery.amounts.length-1].mul(_params.gasPrice/1e9);

        // Query internal router for best path
        offer = IRouter(InternalRouter).findBestPathWithGas(
            _params.amountIn,
            _params.tokenIn,
            _params.tokenOut,
            _params.maxSteps,
            _params.gasPrice,
            tknOutPriceNwei
        );

        // Check if internal router returned an offer
        if (offer.adapters.length > 0) {
            UseInternalRouter = true;
        } else {
            offer = IRouter(ExternalRouter).findBestPathWithGas(
                _params.amountIn,
                _params.tokenIn,
                _params.tokenOut,
                _params.maxSteps,
                _params.gasPrice,
                tknOutPriceNwei
            );
        }

        return (offer, UseInternalRouter);
    }

    /// @notice Swaps input token to output token using the specified path and adapters.
    /// @param _trade This includes the input token, output token, the path to use, adapters and input amounts.
    /// @param _to The output amount will be sent to this address.
    /// @param _fee The fee to be paid by the sender.
    /// @param _useInternalRouter Specifies whether to use the internal router or external router.
    /// @dev The aggregator must be approved to spend users input token.
    function swap(
        IRouter.Trade calldata _trade,
        address _to,
        uint256 _fee,
        bool _useInternalRouter
    ) external {
        require(_to != address(0), "Aggregator: _to not set");

        if(_useInternalRouter) {
            (bool success,) = InternalRouter.delegatecall(
                abi.encodeWithSelector(IRouter(InternalRouter).swapNoSplit.selector, 
                _trade, _to, _fee)
            );

            require(success, "Aggregator: InternalRouter.swapNoSplit failed");
        }
        else{
            (bool success,) = ExternalRouter.delegatecall(
                abi.encodeWithSelector(IRouter(ExternalRouter).swapNoSplit.selector, 
                _trade, _to, _fee)
            );

            require(success, "Aggregator: ExternalRouter.swapNoSplit failed");
        }
    }
}
