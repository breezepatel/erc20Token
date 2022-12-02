import Web3 from "web3";
import 'bootstrap/dist/css/bootstrap.css';
import configurations from "../build/contracts/CrowdSale.json";
import configurations2 from "../build/contracts/Cryptos.json";


const CONTRACT_ADDRESS1 = configurations.networks['5777'].address;
const CONTRACT_ABI1 = configurations.abi;
const CONTRACT_ADDRESS2 = configurations2.networks['5777'].address;
const CONTRACT_ABI2 = configurations2.abi;

const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');

const contract1 = new web3.eth.Contract(CONTRACT_ABI1, CONTRACT_ADDRESS1);
const contract2 = new web3.eth.Contract(CONTRACT_ABI2, CONTRACT_ADDRESS2);

let account;

const accountEl = document.getElementById('account');
const tokenPriceEL = document.getElementById('token-price');
const tokenNameEL = document.getElementById('token-name');
const tokenSymbolEL = document.getElementById('token-symbol');
const vkpBalanceEL = document.getElementById('vkp-balance');
const tokenSoldEL = document.getElementById('tokens-sold');  
const tokenAvailableEL = document.getElementById('tokens-available');
const buyTokensEL = document.getElementById('buy-tokens');
const numberOfTokensEL = document.getElementById('number-of-tokens');
buyTokensEL.addEventListener('click',async (e)=> {
  tokensBuyedRequest = numberOfTokensEL.value;
  console.log("buyTokenscalled : " , tokensBuyedRequest);
  const currentuser = await window.ethereum.selectedAddress;
  console.log("Current User : ", currentuser);
  await contract1.methods.buyTokens(tokensBuyedRequest).send({
     from : currentuser,
     value : tokensBuyedRequest*1000000
  }).then( function(){
    alert("Token Successfully bought");
    console.log('Transaction completed')
  });
  await e.preventDefault();

});
const main= async() => {  
  console.log("ERC20 Token Contract Address : ", CONTRACT_ADDRESS2);
  console.log("CrowdSale Contract Address : ", CONTRACT_ADDRESS1);
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerHTML = account;
  tokenPrice = await contract1.methods.tokenPrice().call();
  console.log("Token Price : ", tokenPrice,"Wei");
  tokenPriceEL.innerHTML = tokenPrice;
  tokenName = await contract2.methods.name().call();
  console.log("Token Name : ", tokenName);
  tokenNameEL.innerHTML = tokenName;
  tokenSymbol =await contract2.methods.symbol().call();
  console.log("Token Symbol : ", tokenSymbol);
  const currentuser = await window.ethereum.selectedAddress;
  console.log("Current User : ", currentuser); 
  tokenSymbolEL.innerHTML = tokenSymbol;
  vkpBalance = await contract2.methods.balanceOf(account).call();
  console.log("User Balance : ",vkpBalance);
  vkpBalanceEL.innerHTML = vkpBalance;
  tokensSold = await contract1.methods.tokensSold().call();
  console.log("Tokens Sold : ",tokensSold);
  tokenSoldEL.innerHTML = "Tokens Sold : "+tokensSold;
  contractBalance = await contract2.methods.balanceOf(CONTRACT_ADDRESS1).call();
  console.log("Contract Balance : ",contractBalance);

  tokenAvailableEL.innerHTML = "Tokens Available : "+parseInt(contractBalance);
};

main();

