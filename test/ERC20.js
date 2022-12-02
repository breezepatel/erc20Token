const ERC20 = artifacts.require("Cryptos");

contract('Cryptos',function(accounts){
  var tokenInstance;
  it('initialize the contract with correct value', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name,"Breeze@19it087","checks name");
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol,'bpp','checks symbol');
    });
  });

  it('allocates the inital supply upon deployment', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(),1000000,"checks total supply");
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance){
      assert.equal(adminBalance.toNumber(),1000000,'checks balance of founder');
    });
  });

  it('transfer token ownership', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance; 
      return tokenInstance.transfer.call(accounts[1],10,{from : accounts[0]});
    }).then(function(success){
      assert.equal(success.toString(),"true","it returns true");
      return tokenInstance.transfer(accounts[1],10,{from : accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,'triggers one event');
      assert.equal(receipt.logs[0].event,'Transfer','should be the transfer event');
      assert.equal(receipt.logs[0].args._from,accounts[0],'logs account transfered from');
      assert.equal(receipt.logs[0].args._to,accounts[1],'logs account transfered to');
      assert.equal(receipt.logs[0].args._value,10,'logs value transfered from');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance){
      assert.equal(balance.toNumber(),10, "check balance after transfer");
    })
  });
  it('Delegated transfer using approve', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance; 
      return tokenInstance.approve.call(accounts[1],100);
    }).then(function(success){
      assert.equal(success.toString(),"true","It returns true");
      return tokenInstance.approve(accounts[1],100,{from : accounts[0]});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,'triggers one event');
      assert.equal(receipt.logs[0].event,'Approval','should be the Approval event');
      assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the account the token authorized by');
      assert.equal(receipt.logs[0].args._spender,accounts[1],'logs the account authroized to transfer token');
      assert.equal(receipt.logs[0].args._value,100,'logs the value approved');
      return tokenInstance.allowance(accounts[0],accounts[1]);
    }).then(function(allowance){
      assert.equal(allowance,100,"stores the allowance for delegated transfer");
    });
  });

  it('handles delegated token transfer', function(){
    return ERC20.deployed().then(function(instance){
      tokenInstance = instance; 
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount =accounts[4];
     //Transfer tokens to fromAccount
     return tokenInstance.transfer(fromAccount,100,{from: accounts[0]});
    }).then(function(receipt){
      //Approve spendingAccount to spend 10 token from fromAccount
      return tokenInstance.approve(spendingAccount,10,{from : fromAccount});
    }).then(function(receipt){
      return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from : spendingAccount});
    }).then(function(success){
      assert.equal(success.toString(),"true","Returns true")
      return tokenInstance.transferFrom(fromAccount,toAccount,10,{from : spendingAccount});
    }).then(function(receipt){
      assert.equal(receipt.logs.length,1,'triggers one event');
      assert.equal(receipt.logs[0].event,'Transfer','should be the Transfer event');
      assert.equal(receipt.logs[0].args._from,accounts[2],'logs the account of amount transfered from');
      assert.equal(receipt.logs[0].args._to,accounts[3],'logs the account , amount transfered to');
      assert.equal(receipt.logs[0].args._value,10,'logs the value of amount transfered');
      return tokenInstance.balanceOf(toAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(),10, "check balance after transferfrom");
      return tokenInstance.balanceOf(fromAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(),90,"check balance after transferfrom");
      return tokenInstance.allowance(fromAccount,spendingAccount);
    }).then(function(balance){
      assert.equal(balance.toNumber(),0,"check allowance, must be zero");
    })

  });
})