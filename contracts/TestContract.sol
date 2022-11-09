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

}