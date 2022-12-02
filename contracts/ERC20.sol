//SPDX-License-Identifier:MIT
pragma solidity 0.8.15;
import "./Interface.sol";
contract Cryptos is IERC20Interface{
    string public name = "Breeze@19it087";
    string public symbol = "bpp";
    uint public decimals = 0;
    uint public override totalSupply;
    address public founder;
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
 
    constructor(){
        totalSupply = 1000000;
        founder = msg.sender;
        balances[founder] = totalSupply;
    }
 
    function balanceOf(address _owner) public view returns (uint256 balance){
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
         require(balances[msg.sender]>=_value);
         
             balances[_to] += _value;
             balances[msg.sender] -= _value;
        
         emit Transfer(msg.sender,_to,_value);
        return true; 
    }

   function allowance(address _owner, address _spender) public view returns (uint256 remaining){
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        require(balances[msg.sender]>= _value);
        require(_value>0);

        allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender , _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(allowed[_from][msg.sender] >= _value);
        require(balances[_from]>=_value);

            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            balances[_to] +=_value;
     

        emit Transfer(_from,_to,_value);
        return true;
    }
}