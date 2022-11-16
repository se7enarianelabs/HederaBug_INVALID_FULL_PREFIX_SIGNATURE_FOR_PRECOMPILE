pragma solidity ^0.8;
pragma experimental ABIEncoderV2;

import "./IERC721.sol";

contract TestContract {
    function _transferERC721AssetFrom(
        IERC721Token token,
        address owner,
        address to,
        uint256 tokenId
    )
        external
    {
        token.transferFrom(owner, to, tokenId);
    }

    function _delegateTransferERC721AssetFrom(
        address token,
        address owner,
        address to,
        uint256 tokenId
    )
    external
    {
        token.delegatecall(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", owner, to, tokenId)
        );
    }

}
