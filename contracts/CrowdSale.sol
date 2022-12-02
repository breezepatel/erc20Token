// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;
import "./Interface.sol";
import "./ERC20.sol";
contract CrowdSale{
  address public admin;
  Cryptos public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;
  event Sell(address _buyer, uint256 _amount);
  constructor(address _tokenContract,uint256 _price){
    admin = msg.sender;
    tokenContract = Cryptos(_tokenContract);
    tokenPrice = _price;
  }
  function buyTokens(uint256 _numberOfTokens) public payable{
      require(msg.value == _numberOfTokens * tokenPrice,"Pay more");
      require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
      tokenContract.transfer(msg.sender, _numberOfTokens);
      tokensSold += _numberOfTokens ;
      emit Sell(msg.sender, _numberOfTokens);
  }
  
  function endSale() public payable{
    require(msg.sender == admin);
    tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));
    tokenPrice = 0;
    
    selfdestruct(payable(admin));
  }
}
