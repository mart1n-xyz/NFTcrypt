// This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

import MetaMaskOnboarding from '@metamask/onboarding'
import { encKeyRegistryBytecode, encKeyRegistry, nftCryptBytecode, nftCrypt,simpleSaveBytecode,simpleSave,childBytecode,child } from './constants.json'
import { ethers } from 'ethers'
import {PINATA_API_KEY,PINATA_API_SECRET} from './api.json'

const sigUtil = require('eth-sig-util')

const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, 'ropsten')


const registryAddress = "0x9F86dea78c52D9B5D67164687c62A6e098EB637D";
const nftcryptFactoryAddress = "0x0531D149d24cea6ed7D506ab13aeb6A7B6037eC7";
const simpleSaveAddress = "0x3AB6a9f399F963932645B41597c95e021a45d033";

const registryContract = new ethers.Contract(registryAddress, encKeyRegistry, ethersProvider.getSigner());
const nftCryptContract = new ethers.Contract(nftcryptFactoryAddress, nftCrypt, ethersProvider.getSigner());
const saveContract = new ethers.Contract(simpleSaveAddress, simpleSave, ethersProvider.getSigner());
const issueContrSelected = document.getElementById('issueContrSelected')
const deplAlert = document.getElementById('alert-deployed')
const alertHowBatch = document.getElementById('alert-how-batch')
const mintNewBatch= document.getElementById('mintNewBatch')
const mintButton = document.getElementById('mintBatch')
const deployHidable = document.getElementById('deployhidable')
const manageCard = document.getElementById('manageCard')
const marketBtn=document.getElementById('marketBtn')


const axios = require('axios');
var ipfsHashResponse=''
var activeContract = ''
var ipfsLinkUploaded='';
var connectedEncKey
var childSelected

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function linkify(inputText) {

    var replacedText, replacePattern1, replacePattern2, replacePattern3;


    //URLs starting with http://, https://, or ftp://

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
};
var newBatchSize= document.getElementById("newBatchSize")
document.getElementById("newBatchSize").value=''
var value_batch_size = 0
function useValueSize() {
    var NameValue = newBatchSize.value;
    // use it
    value_batch_size = NameValue
     // just to show the new value
}
newBatchSize.onchange = useValueSize;

function ipfsSuccess() {
  issueContrSelected.style.display='none'
  deplAlert.style.display = 'block'
  let node = document.createElement("a")
  node.setAttribute("href", ipfsLinkUploaded)
  node.textContent=ipfsLinkUploaded
  let newA=linkify(ipfsLinkUploaded)
  deplAlertMessage.innerHTML = newA
  alertHowBatch.style.display='block'
  mintNewBatch.style.display='block'




}
const doneIssue = document.getElementById('doneIssue')
const issueMenuButton = document.getElementById('issueMenu')

function secretSetSuccess() {
doneIssue.style.display='block'
alert('NFTs created')
location.reload()
//issueMenuButton.disabled = false
  }


const setSecretPage=document.getElementById('setSecret')
const batchinfo=document.getElementById('batchinfo')
const secretInput=document.getElementById('secretInput')
const secretEncButton=document.getElementById('secretEncrypt')
const secretSaved = document.getElementById('saved')
const hashButton = document.getElementById('secretHash')


var value_secret=''



document.getElementById("secretInput").value='';

function useValueSecret() {
    var NameValue = document.getElementById('secretInput').value;
    //console.log(NameValue)
    // use it
    value_secret = NameValue
     // just to show the new value
}
secretInput.onchange = useValueSecret;

var batchnumber
function setSecret() {

  deplAlert.style.display = 'none'
  alertHowBatch.style.display='none'
  mintNewBatch.style.display='none'
  setSecretPage.style.display='block'
  batchinfo.innerText=`You just minted batch #${batchnumber}`
  secretEncButton.disabled=false
}
var secretEncOwn
secretEncButton.onclick = async () => {
  //console.log(value_secret)
  //console.log(connectedEncKey)
    try {
      secretEncOwn = web3.toHex(JSON.stringify(
        sigUtil.encrypt(
          connectedEncKey,
          { 'data': value_secret },
          'x25519-xsalsa20-poly1305',
        ),
      ))
    } catch (error) {
      ciphertextDisplay.innerText = `Error: ${error.message}`
    }

    //decrypt test
/*
    try {
      let decrypted = await ethereum.request({
        method: 'eth_decrypt',
        params: [secretEncOwn, ethereum.selectedAddress],
      })
    } catch (error) {
      cleartextDisplay.innerText = `Error: ${error.message}`
    }
    alert(decrypted) */

    await saveContract.setEncSecret(secretEncOwn, activeContract, batchnumber, {gasPrice: 20000000000})
    secretEncButton.disabled=true
    secretEncButton.innerText='Waiting...'
    let dummy4=0
    while (dummy4==0){
      try {
        let mykey = await saveContract.getKey(activeContract,batchnumber)
        if (mykey==secretEncOwn) {

          alertFound.style.display = "block"
          publishToMenu.disabled = false

          alertPublish.style.display = "none"
          dummy4=1;
        } else {

        };
      sleep(10000)
    } catch (error) {
      console.log(`Error: ${error.message}`)}


  }

  secretSaved.style.display='block'
  hashButton.disabled=false
  secretEncButton.innerText='Success'
  }

hashButton.onclick = async () => {
  var hashedSecret=ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value_secret))
  console.log(batchnumber)
  console.log(hashedSecret)
  try {   await childSelected.setSecretHash(batchnumber, hashedSecret, {gasPrice: 20000000000})
  hashButton.disabled=true
  hashButton.innerText='Waiting'

  } catch (error) {console.log(error)}

  let dummy5=0
  while (dummy5==0){
    try {
      let myhash= await childSelected.viewSecretHash(batchnumber)
      if (myhash==hashedSecret) {
        //alert('Congrats you just set your secret.')
        hashButton.innerText='Success'
        console.log(myhash)
        secretSetSuccess()

        dummy5=1;

      } else {

      };
    sleep(10000)
  } catch (error) {
    console.log(`Error: ${error.message}`)}
}



}

async function afterIPFSSecret(ipfsLinkUploaded,tokenID,thisC) {
  try {
    let secretC= new ethers.Contract(thisC, child, ethersProvider.getSigner());
    //let buuu=await secretC.ownerOf(ethers.BigNumber.from(tokenID))

    //console.log(buuu)

    await secretC.setEncSecret(ethers.BigNumber.from(tokenID),ipfsLinkUploaded,{gasPrice: 20000000000})

  } catch (e) {console.log(e)}

}


mintButton.onclick = async () => {
  if (value_batch_size==0) {
    alert('Please, set a positive integer.')
  } else if (Number.isInteger(Number(value_batch_size))==false) {
    alert('Please, enter an integer.')
  } else {
    //console.log(activeContract)
    // here comes the mint logic for activeContract
    try {

         childSelected = new ethers.Contract(activeContract, child, ethersProvider.getSigner());
        let suplly = await childSelected.totalSupply()
        let lastBa= await childSelected.lastBatch()
        console.log(lastBa.toNumber())
        var supllyNum=suplly.toNumber()
        //console.log(supllyNum)

      await childSelected.newBatchWithURI(value_batch_size,ipfsLinkUploaded, {gasPrice: 20000000000});
      mintButton.innerText='Minting...'
      mintButton.disabled=true

    } catch (error) {console.log(error)}
      try{
        let suplly2
        var supllyNum2
        let i=0
        let dummy=0
        while (dummy==0){
          i++
          suplly2 = await childSelected.totalSupply()
          supllyNum2=suplly2.toNumber()
          //console.log(i)
          sleep(100000)
          if (supllyNum2!=supllyNum){
            dummy=1
          }
        }
          //console.log('Success')
        var lastB = await childSelected.lastBatch()
        var lastBaNum= lastB.toNumber()
        console.log(lastBaNum)
        batchnumber=lastBaNum
        setSecret()


          //console.log(supllyNum2)
          //console.log(supllyNum)



      } catch (error) {console.log(error)}



      //lastBatch = await childSelected.lastBatch()
      //console.log(lastBatch)
      /* let dummy2=0
      while (dummy2==0){
        try {
          let encKeyRegister = await childSelected.lastBatch()
          if (encKeyRegister==encryptionKeyDisplay.value) {
            console.log('Encryption key found in the registry')
            alertFound.style.display = "block"
            publishToMenu.disabled = false

            alertPublish.style.display = "none"
            dummy2=1;
          } else {
            alertFound.style.display = "none"
            alertPublish.style.display = "block"
          };
        sleep(10000)
      } catch (error) {
        console.log(`Error: ${error.message}`)}
    }*/

  }
}


export const pinJSONToIPFS = (pinataApiKey, pinataSecretApiKey, JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(
            url,
            JSONBody,
            {
                headers: {
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            }
        ).then(function (response) {
            //handle response here
             ipfsHashResponse=response.data.IpfsHash;
             var link= 'http://ipfs.io/ipfs/'

             //console.log(link.concat(ipfsHashResponse))
            ipfsLinkUploaded =link.concat(ipfsHashResponse)
             //console.log(ipfsLinkUploaded)
             ipfsSuccess()

        })
        .catch(function (error) {
            //handle error here
            console.log(error)
        });
};

export const pinJSONToIPFS2 = (pinataApiKey, pinataSecretApiKey, JSONBody,tokenID,thisC) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(
            url,
            JSONBody,
            {
                headers: {
                    'pinata_api_key': pinataApiKey,
                    'pinata_secret_api_key': pinataSecretApiKey
                }
            }
        ).then(function (response) {
            //handle response here
             ipfsHashResponse=response.data.IpfsHash;
             var link= 'http://ipfs.io/ipfs/'

             //console.log(link.concat(ipfsHashResponse))
            ipfsLinkUploaded =link.concat(ipfsHashResponse)
             //console.log(ipfsLinkUploaded)

             afterIPFSSecret(ipfsLinkUploaded,tokenID,thisC)

        })
        .catch(function (error) {
            //handle error here
            console.log(error)
        });
};
//let tx = await contractWithSigner.setValue("I like turtles.");

//console.log(currentValue);


const currentUrl = new URL(window.location.href)
const forwarderOrigin = currentUrl.hostname === 'localhost'
  ? 'http://localhost:9010'
  : undefined

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

// Dapp Status Section
const accountsDiv = document.getElementById('accounts')

// Basic Actions Section
const onboardButton = document.getElementById('connectButton')

// Encrypt / Decrypt Section
const getEncryptionKeyButton = document.getElementById('getEncryptionKeyButton')
const encryptMessageInput = document.getElementById('encryptMessageInput')
const encryptButton = document.getElementById('encryptButton')
const decryptButton = document.getElementById('decryptButton')
const encryptionKeyDisplay = document.getElementById('encryptionKeyDisplay')
const ciphertextDisplay = document.getElementById('ciphertextDisplay')
const cleartextDisplay = document.getElementById('cleartextDisplay')

const publishButton = document.getElementById('registryPublish')
const alertPublish = document.getElementById('alert-publish')
const alertFound = document.getElementById('alert-found')
const encSetup = document.getElementById('encSection')
const alertFoundQuick = document.getElementById('alert-found-quick')
const encMessage = document.getElementById('encMessage')
const menu = document.getElementById('menu')
const publishToMenu =document.getElementById('publishToMenu')
var deployButton = document.getElementById('deployBtn')
const spinner =document.getElementById('spinner')




encryptionKeyDisplay.value=''
encMessage.style.display = "block"







const initialize = async () => {
  let onboarding
  try {
    onboarding = new MetaMaskOnboarding({ forwarderOrigin })
  } catch (error) {
    console.error(error)
  }

  let accounts
  let accountButtonsInitialized = false

  const accountButtons = [
    getEncryptionKeyButton,
    encryptButton,
  ]

  const isMetaMaskConnected = () => accounts && accounts.length > 0

  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress'
    onboardButton.disabled = true
    onboarding.startOnboarding()
  }

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      handleNewAccounts(newAccounts)


    } catch (error) {
      console.error(error)
    }
  }

  const clearTextDisplays = () => {
    encryptionKeyDisplay.innerText = ''
    encryptMessageInput.value = ''
    ciphertextDisplay.innerText = ''
    cleartextDisplay.innerText = ''
  }

  const updateButtons = () => {
    const accountButtonsDisabled = !isMetaMaskInstalled() || !isMetaMaskConnected()
    if (accountButtonsDisabled) {
      for (const button of accountButtons) {
        button.disabled = true
      }
      clearTextDisplays()
    } else {
      getEncryptionKeyButton.disabled = false
    }

    if (!isMetaMaskInstalled()) {
      onboardButton.innerText = 'Click here to install MetaMask!'
      onboardButton.onclick = onClickInstall
      onboardButton.disabled = false
    } else if (isMetaMaskConnected()) {
      onboardButton.innerText = 'Connected'
      onboardButton.disabled = true
      //onboardButton.style.display= 'none'
      if (onboarding) {
        onboarding.stopOnboarding()
      }

    } else {
      onboardButton.innerText = 'Connect'
      onboardButton.onclick = onClickConnect
      onboardButton.disabled = false
    }
  }

  const initializeAccountButtons = () => {

    if (accountButtonsInitialized) {
      return
    }
    accountButtonsInitialized = true

publishToMenu.onclick = () => {
encSection.style.display='none'
menu.style.display='block'
}
/** publish
  */
  publishButton.onclick = async () => {
    try {
      //console.log(`Sending: ${encryptionKeyDisplay.value}`)
      await registryContract.setKey(encryptionKeyDisplay.value, {gasPrice: 20000000000});
       publishButton.disabled = true
       publishButton.innerText = 'Waiting...'
       let dummy=0
       while (dummy==0){
         try {
           let encKeyRegister = await registryContract.getKey(accounts[0])
           if (encKeyRegister==encryptionKeyDisplay.value) {
             console.log('Encryption key found in the registry')
             alertFound.style.display = "block"
             publishToMenu.disabled = false

             alertPublish.style.display = "none"
             dummy=1;
           } else {
             alertFound.style.display = "none"
             alertPublish.style.display = "block"
           };
         sleep(10000)
       } catch (error) {
         console.log(`Error: ${error.message}`)}
     }
    } catch (error) {
      console.log(`Error: ${error.message}`)
      encryptButton.disabled = true
      decryptButton.disabled = true
    }
  }



    /**
     * Encrypt / Decrypt
     */

    getEncryptionKeyButton.onclick = async () => {

      try {

        let result = await registryContract.getKey(accounts[0]);
        connectedEncKey=result
        if (result==''){

          try {

            encryptionKeyDisplay.value = await ethereum.request({
              method: 'eth_getEncryptionPublicKey',
              params: [accounts[0]],
            })
            getEncryptionKeyButton.disabled=true
            connectedEncKey=encryptionKeyDisplay.value
            //here comes the check
            try {
              ///let encKeyRegister = await registryContract.getKey(accounts[0])
              ///console.log(accounts[0])
              if (result=='') {
                console.log('Encryption key not published in the registry')
                publishButton.disabled = false
                alertPublish.style.display = "block"
                alertFound.style.display = "none"

              } else {
                console.log('Encryption key found in the registry')
                alertFound.style.display = "block"
                publishToMenu.disabled = false
                alertPublish.style.display = "none"
                menu.style.display='block'
              }

              console.log(encKeyRegister)
            } catch (error) {
              console.log(`Error: ${error.message}`)
            }
          } catch (error) {
            encryptionKeyDisplay.value = `Error: ${error.message}`
            encryptButton.disabled = true
            decryptButton.disabled = true
          };

        } else {
          encSetup.style.display = "none"
          alertFoundQuick.style.display = "block"

          menu.style.display='block'
        }
      } catch (error) {
        console.log(`Error: ${error.message}`)
      }


    }

/* Issue */


const issueMenuButton = document.getElementById('issueMenu')
const issueSec = document.getElementById('issueSec')
const h4contr = document.getElementById('h4contr')
const h4contrMint = document.getElementById('h4contrMint')

const deployForm = document.deployForm

var deplNameInit= document.getElementById("deplName")
var deplSymInit= document.getElementById("deplSym")
var value = ''
var value2 = ''
function useValue() {
    var NameValue = deplNameInit.value;
    // use it
    value = NameValue
     // just to show the new value
}
function useValue2() {
    var NameValue = deplSymInit.value;
    // use it
    value2 = NameValue
     // just to show the new value
}

deplNameInit.onchange = useValue;
deplSymInit.onchange = useValue2;
const deplContrDynList = document.getElementById('deplContrDynList')
const addContrP = document.getElementById('addContrP')
const addContrPMint = document.getElementById('addContrPMint')

const ipfsButton = document.getElementById('IpfsPush')

var contrListDummy = 0


function contrSelect(address,name, symbol){
  sectionIssueContr.style.display='none';
  deplAlert.style.display='none';
  // show next contract specific screen
  let apart=' ('
  let bpart= ')'
  let outputTemp = name.concat(apart, symbol,bpart,);
  h4contr.innerText = outputTemp
  addContrP.innerText = address

  issueContrSelected.style.display='block';

  ipfsButton.disabled = false

}
var value_name = ''
var value_desc = ''
var value_img = ''
document.getElementById('nameIpfs').value=''
document.getElementById('descIpfs').value=''
document.getElementById('imgIpfs').value=''
function useValueName() {
    var NameValue = document.getElementById('nameIpfs').value;
    // use it
    value_name = NameValue
     // just to show the new value
}
function useValueDesc() {
    var NameValue = document.getElementById('descIpfs').value;
    // use it
    value_desc = NameValue
     // just to show the new value
}
function useValueImg() {
    var NameValue = document.getElementById('imgIpfs').value;
    // use it
    value_img = NameValue
     // just to show the new value
}
document.getElementById('nameIpfs').onchange = useValueName;
document.getElementById('descIpfs').onchange = useValueDesc;
document.getElementById('imgIpfs').onchange = useValueImg;

ipfsButton.onclick = async () => {
  if (value_name.length==0){
    alert('At least name must be submitted')
  } else {
    ipfsButton.innerHTML='Uploading...'
    var jsonPush = {
  "name": value_name,
  "description": value_desc,
  "image": value_img
};
    ipfsButton.disabled=true;
    pinJSONToIPFS(PINATA_API_KEY,PINATA_API_SECRET,jsonPush);
  }

}


issueMenuButton.onclick = async () => {

    menu.style.display='none'
    alertFoundQuick.style.display='none'
    deplNameInit.value=''
    deplSymInit.value=''
    let foundMax = 0
    let i=0
    var totalDepl = 0
    spinner.style.display='block'
    while (foundMax==0){
      try {
        let deplOld = await nftCryptContract.deployedAddress(accounts[0],i);
        i++
      } catch (errror) {
        foundMax = 1
        totalDepl=i
        //alert(totalDeployed)
      }

    }
    if (totalDepl>0 ) {

        // update the list of contracts
        for(var j = 0; j <= totalDepl-1; j++) {
          try {
            let add = await nftCryptContract.deployedAddress(accounts[0],j);
            let childTemp = new ethers.Contract(add, child, ethersProvider.getSigner());
            try {

              let nameTemp = await childTemp.name();
              let symbolTemp = await childTemp.symbol();

              let apart=' ('
              let cpart = ' '
              let bpart= ')'
              let outputTemp = nameTemp.concat(apart, symbolTemp,bpart, cpart, add);
              let textnode = document.createTextNode(outputTemp)
              let node = document.createElement("a")
              node.setAttribute("class", "list-group-item list-group-item-action")
              node.setAttribute("id", add)

              node.appendChild(textnode);
              document.getElementById("deplContrDynList").appendChild(node)
              document.getElementById(add).onclick = async () => {
                //console.log(add)
                activeContract=add
                contrSelect(add, nameTemp, symbolTemp)

              }





            } catch (error) {

            }


          } catch (error) {

          }
        }

      spinner.style.display='none'
      let addContractButton = document.createElement("button")
      addContractButton.innerText='Deploy new contract'
      addContractButton.setAttribute("class", "btn btn-primary btn-outline-dark rounded-pill")
      addContractButton.setAttribute("id", 'addContractButton2')
      document.getElementById("deplContrDynList").appendChild(addContractButton)
      const addContractButton2= document.getElementById('addContractButton2')
      addContractButton2.onclick = () => {
        issueSec.style.display='block'
        deployButton.disabled= false;
        addContractButton2.disabled= true;
        sectionIssueContr.style.display='none'

      }

      sectionIssueContr.style.display='block'
      contrListDummy=1


    } else {
      // issue new contract page
      spinner.style.display='none'
      issueSec.style.display='block'
      deployButton.disabled= false;
    }



}



const sectionIssueContr = document.getElementById('issueContr')
const deplAlertMessage=document.getElementById('deplAlertMessage')



deployButton.onclick = async () => {
  if (value.length>0& value2.length>0){
    deployButton.innerText = 'Deploying...'
    let foundMax = 0
    let i=0
    var totalDeployed = 0

    while (foundMax==0){
      try {
        let deplOld = await nftCryptContract.deployedAddress(accounts[0],i);
        i++
      } catch (errror) {
        foundMax = 1
        totalDeployed=i
        //alert(totalDeployed)
      }

    }
    try {
      let child = await nftCryptContract.createChild(value,value2, {gasPrice: 20000000000});
       deployButton.innerText = 'Waiting...'




       let dummy=0
       while (dummy==0){
         try {
           var deployedAddress = await nftCryptContract.deployedAddress(accounts[0],totalDeployed);
           dummy=1
           //alert(`Deployed at ${deployedAddress}`)
           issueSec.style.display='none'
           spinner.style.display='block'
           location.reload()
           contrListDummy=1
           deplAlertMessage.innerText = `Your contract has been deployed at ${deployedAddress}`
           for(var j = 0; j <= totalDepl-1; j++) {
             try {
               let add = await nftCryptContract.deployedAddress(accounts[0],j);
               let childTemp = new ethers.Contract(add, child, ethersProvider.getSigner());
               try {

                 let nameTemp = await childTemp.name();
                 let symbolTemp = await childTemp.symbol();

                 let apart=' ('
                 let cpart = ' '
                 let bpart= ')'
                 let outputTemp = nameTemp.concat(apart, symbolTemp,bpart, cpart, add);
                 let textnode = document.createTextNode(outputTemp)
                 let node = document.createElement("a")
                 node.setAttribute("class", "list-group-item list-group-item-action")
                 node.setAttribute("id", add)

                 node.appendChild(textnode);
                 document.getElementById("deplContrDynList").appendChild(node)
                 document.getElementById(add).onclick = async () => {
                   //console.log(add)
                   activeContract=add
                   contrSelect(add, nameTemp, symbolTemp)

                 }





               } catch (error) {
                 console.log(error)
                 //location.reload()
               }


             } catch (error) {
               console.log(error)
             }
           }
           spinner.style.display='none'
           sectionIssueContr.style.display='block'
           deplAlert.style.display='block'
           totalDepl=totalDeployed+1

       } catch (error) {
         //console.log(`Error: ${error.message}`)
         sleep(10000)
       }

     }
    } catch (error) {
      console.log(`Error: ${error.message}`)

    }




  } else {
      alert('You need to fill in both inputs.');
  }


}
const manageContrSelected = document.getElementById('manageContrSelected')
const batchDetail = document.getElementById('batchDetail')
const h4contrBdetail= document.getElementById('h4contrBdetail')
const addContrPBdetail= document.getElementById('addContrPBdetail')
const addContrPBdetail2=document.getElementById('addContrPBdetail2')
const uridescr = document.getElementById('uridescr')
const tokenImg= document.getElementById('tokenIMG')
const setPriceAlert=document.getElementById('setPriceAlert')
const setPriceButton=document.getElementById('setPrice')

var newBatchPrice= document.getElementById("newBatchPrice")
document.getElementById("newBatchPrice").value=''
var value_batch_price = 0
function useValuePrice() {
    var NameValue = newBatchPrice.value;
    // use it
    value_batch_price = NameValue
     // just to show the new value
}
newBatchPrice.onchange = useValuePrice;




// Manage Contract list
async function listManage(address,name, symbol) {

  let childTemp = new ethers.Contract(address, child, ethersProvider.getSigner());
  let last_batch_manage = await childTemp.lastBatch();
  var last_batch_manage_num= last_batch_manage.toNumber()
  return last_batch_manage_num

}
var array_size = new Array();

async function BatchDetail(k,headingBatch,saleStatus,array_size,nodeDeatails ,childTemp,outputURI) {
  let posCurrent = nodeDeatails.wholeText.substring(0,nodeDeatails.wholeText.indexOf(".") )
  //console.log(posCurrent)

  spinner.style.display='block'
  manageContrSelected.style.display='none';
  h4contrBdetail.innerText=headingBatch
  addContrPBdetail.innerText=saleStatus
  let m = posCurrent-1
  let start = array_size[m]+1

  let stop =array_size[posCurrent]
  let sizeBatc = stop-start+1

  //console.log(sizeBatc)
  //console.log(k-1)
  //console.log(start)
  //console.log(stop)



var ownedOfBatch=0
for(var l =start ; l <= stop; l++) {
  //console.log(l);
  try{
    let ownerOfToken = await childTemp.ownerOf(l.toString());
    //console.log(ethers.utils.getAddress(accounts[0]))
    //console.log(ethers.utils.getAddress(ownerOfToken))
    if (ethers.utils.getAddress(ownerOfToken)==ethers.utils.getAddress(accounts[0])) {
      ownedOfBatch++

    }
  } catch (error) {
    console.log(error)
  }

}
let soldAlready = sizeBatc- ownedOfBatch
//add sale status
if (saleStatus==' - not on sale'){
  // view sale form
  setPriceAlert.style.display='block'



} else {
  setPriceAlert.style.display='none'
  addContrPBdetail2.innerText=soldAlready.toString().concat(' out of ',sizeBatc,' sold')
}


//console.log(ownedOfBatch)
if (outputURI.description.length>0){
  uridescr.innerText = outputURI.description
} else {
  uridescr.innerText = 'no description'
}

if (outputURI.image.length>0) {
  tokenImg.src=outputURI.image
}

batchDetail.style.display = 'block'
spinner.style.display='none'

setPriceButton.onclick = async () => {
  if (value_batch_price>0){
    let weiPrice = value_batch_price*(10**18)
    let weiPriceString=weiPrice.toString()
    try {
      console.log('batch')
      console.log(posCurrent)
      await childTemp.setBatchPrice(posCurrent, weiPriceString, {gasPrice: 20000000000})
      setPriceButton.disabled=true
      setPriceButton.innerText='Waiting...'
      let dummy4=0
      while (dummy4==0){
        try {
          let getPr = await childTemp.getPrice(start.toString())
          console.log(getPr)
          if (getPr.toString()==weiPriceString) {
           setPriceButton.innerText='Success'
            alert('Your batch was marked as for sale')
            location.reload()

            dummy4=1;

          } else {

          };
        sleep(10000)
      } catch (error) {
        //console.log(`Error: ${error.message}`)
      }


    }



    } catch (error) {
      console.log(error)
    }






  } else {
    alert('price has to be positive')
  }


}

}

document.getElementById('headera').onclick = ()  => { location.reload()}


async function contrSelectManage(address,name, symbol){
let maxBatch = await listManage(address,name, symbol);
//console.log(maxBatch)
  imanageContr.style.display='none'
  deplAlert.style.display='none';
  spinner.style.display='block'

  // show next contract specific screen
  let apart=' ('
  let bpart= ') - '
  let cpart=' batch(es)'
  let outputTemp = name.concat(apart, symbol,bpart,maxBatch,cpart);
  h4contrMint.innerText = outputTemp
  addContrPMint.innerText = address
  let childTemp = new ethers.Contract(address, child, ethersProvider.getSigner());
  let rollingSize=0
  let startBatchToken
  const batchListManage = document.getElementById('manageBatchDynList')
  //var array_size = new Array(maxBatch);
  var k
  array_size.push(0)
  for( k = 1; k <= maxBatch; k++) {
    try{
      let batchS = await childTemp.batchSize(k.toString());
      //let batchURIs = await childTemp.tokenURI(rollingSize);

      rollingSize = rollingSize+ batchS.toNumber()
      array_size.push(rollingSize)
      //console.log(array_size.length)
      //var position = document.createTextNode(headingBatch)
      var position=array_size.length-1
      //console.log(batchS.toNumber())
      //console.log(rollingSize)
      let uriGet = await childTemp.tokenURI(rollingSize.toString());
      let priceBat = await childTemp.origPrice(rollingSize.toString());
      //let forSale = await childTemp.forSale(rollingSize);
      //console.log(priceBat.toNumber())
      //console.log(forSale)
      //console.log(uriGet)
      let saleStatus
      let saleStatusDummy
      if (priceBat.eq(0)==true){
        saleStatus = ' - not on sale'
        saleStatusDummy=0
      } else {
        saleStatus = ' - ON SALE';
        saleStatusDummy=1
      }
      let batchIdtext = 'batch_'
      let outputURI
      outputURI = await (await fetch(uriGet)).json();
      let batchNameMana= outputURI.name
      let kstring=toString(k)
      let headingBatch=batchNameMana.concat(' (',batchS.toNumber(),')')
      let empt=''
      let renakNode=document.createTextNode(empt.concat(position,'. '))
      let nodeDIV = document.createElement("div")
      //console.log(outputURI)
      let textnode = document.createTextNode(headingBatch)
      let node = document.createElement("a")
      //let br =document.createElement("br")
      node.setAttribute("class", "list-group-item list-group-item-action")
      node.setAttribute("id", batchIdtext.concat(k))

      let nodeDeatails=document.createTextNode(saleStatus)
      nodeDIV.appendChild(renakNode)
      nodeDIV.appendChild(textnode);
      //nodeDIV.appendChild(br);
      nodeDIV.appendChild(nodeDeatails);
      node.appendChild(nodeDIV)
      //console.log(node)
      batchListManage.appendChild(node)



      document.getElementById(batchIdtext.concat(k)).onclick = async () => {

        BatchDetail(k,headingBatch,saleStatus,array_size, nodeDeatails,childTemp,outputURI) }





    } catch (error) {
      console.log(error)

    }
  }
  spinner.style.display='none'

  manageContrSelected.style.display='block';

}
const secretCheck=document.getElementById('secretCheck')
const secretMana=document.getElementById('secretMana')
const secretSection=document.getElementById('secretSection')

async function secretCheckFunction(contractsArray) {
  let lenContr = contractsArray.length
  //console.log(lenContr)
  spinner.style.display='block'
  imanageContr.style.display='none'
  for(var jp = 0; jp <= lenContr-1; jp++) {
    let childTempr = new ethers.Contract(contractsArray[jp], child, ethersProvider.getSigner());
    let supl=await childTempr.totalSupply()
    supl=supl.toNumber()
    //console.log(supl)
    if ( supl>0){
      for(var jk = 1; jk <= supl; jk++) {
        let tokOwned=await childTempr.ownerOf(jk.toString())
        if (ethers.utils.getAddress(tokOwned)!=ethers.utils.getAddress(accounts[0])) {
          //console.log(jk.toString())
          let secretOut = await childTempr.viewEncSecret(jk.toString())


          //console.log(secretOut)
          if (secretOut.length==0){
            try {
            //
            //get batch
            let laBa=await childTempr.lastBatch()
            laBa=laBa.toNumber()
            //console.log(laBa)
            let batchTop=0
            let jkd=1
            while (batchTop<jk){
              let laSize=await childTempr.batchSize(jkd.toString())
              batchTop=batchTop+laSize.toNumber()
              jkd++
            }
            let thisBa=jkd-1
            //console.log(thisBa)
            let mySecret= await saveContract.getKey(contractsArray[jp],thisBa)
            let freURI=await childTempr.tokenURI(jk.toString())
            let owKey=await registryContract.getKey(tokOwned)
            let thisC = contractsArray[jp]
            //console.log(owKey)
            let freURIes = await (await fetch(freURI)).json();
            //console.log(freURIes.name)

            let alertSecret=document.createElement('div')
            alertSecret.setAttribute('class','alert alert-warning')
            alertSecret.setAttribute('role','alert')

            let alertSecHeading=document.createElement('h4')
            alertSecHeading.innerText=freURIes.name
            alertSecHeading.setAttribute('class','alert-heading')
            alertSecret.appendChild(alertSecHeading)

            let decryptBB = document.createElement('button')
            decryptBB.setAttribute('class','btn btn-primary btn-outline-dark rounded-pill')
            decryptBB.innerText='Decrypt & reveal the secret to buyer'
            /*
            let revealBB = document.createElement('button')
            revealBB.setAttribute('class','btn btn-primary btn-outline-dark rounded-pill')
            revealBB.innerText='Reveal secret to buyer'
            */

            alertSecret.appendChild(decryptBB)
            //alertSecret.appendChild(revealBB)

            secretMana.appendChild(alertSecret)

            //var deMess

            //console.log(jk)

            decryptBB.onclick = function(arg,mySecretX,owKeyX,thisBaX,thisCX,alertSecretX) {
              return async function() {

                let deMess=''
                try {
                     deMess= await ethereum.request({
                    method: 'eth_decrypt',
                    params: [mySecretX, ethereum.selectedAddress],
                  })

                } catch (error) {
                  console.log(error);
                }
                //console.log(deMess);

                let deMesslink=linkify(deMess)


                //console.log(deMesslink)
                alertSecretX.innerHTML += '<br>'
                alertSecretX.innerHTML += deMesslink
                //decryptBB.disbaled=true


                let secretcode  = web3.toHex(JSON.stringify(
                   sigUtil.encrypt(
                     owKeyX,
                     { 'data': deMess},
                     'x25519-xsalsa20-poly1305',
                   ),
                 ))

                 //await childTempr.setEncSecret(jk.toString(),secretcode,{gasPrice: 20000000000})
                 //console.log(secretcode)

                 let jsonPushSecret = {
                   'contract':thisCX,
                   "token": arg,
                   "batch": thisBaX,
                   "secret": secretcode

             };
             //console.log(jsonPushSecret)
                pinJSONToIPFS2(PINATA_API_KEY,PINATA_API_SECRET,jsonPushSecret,arg,thisCX);

              }
            }(jk,mySecret,owKey,thisBa,thisC,alertSecret);
            /*

              try {
                  deMess= await ethereum.request({
                  method: 'eth_decrypt',
                  params: [mySecret, ethereum.selectedAddress],
                })

              } catch (error) {

              }

              //console.log(deMess)
              let deMesslink=linkify(deMess)


              //console.log(deMesslink)
              alertSecret.innerHTML += '<br>'
              alertSecret.innerHTML += deMesslink
              //decryptBB.disbaled=true


              let secretcode  = web3.toHex(JSON.stringify(
                 sigUtil.encrypt(
                   owKey,
                   { 'data': deMess},
                   'x25519-xsalsa20-poly1305',
                 ),
               ))

               //await childTempr.setEncSecret(jk.toString(),secretcode,{gasPrice: 20000000000})
               console.log(secretcode)
               console.log(jk.toString())
               let jsonPushSecret = {
                 'contract':thisC,
                 "token": jk.toString(),
                 "batch": thisBa,
                 "secret": secretcode

           };
           console.log(jsonPushSecret)
              pinJSONToIPFS2(PINATA_API_KEY,PINATA_API_SECRET,jsonPushSecret,jk.toString(),thisC);




               //await childTempr.setEncSecret(jk,secretcode.toString(),{gasPrice: 20000000000, gasLimit:10024269})


            }
            */
            /*
            revealBB.onclick = async () => {

              /*
            if (secdiv.innerText.length>0){
             let secretcode  = web3.toHex(JSON.stringify(
                sigUtil.encrypt(
                  owKey,
                  { 'data': secdiv.innerText },
                  'x25519-xsalsa20-poly1305',
                ),
              ))

              //await childTempr.setEncSecret(jk.toString(),secretcode,{gasPrice: 20000000000})
              console.log(secretcode)
              revealBB.disabled=true
            } else {
              alert('You need to decrypt first')
            }
            console.log(deMess)
          }*/



          } catch (e){console.log(e)}






            /*try {
               await ethereum.request({
                method: 'eth_decrypt',
                params: [mySecret, ethereum.selectedAddress],
              })
            } catch (error) {

            }*/
          }
        }
        //console.log(tokOwned)
      }
    }
  }
spinner.style.display='none'
secretSection.style.display='block'
console.log('finished')

}

manageCard.onclick = async () => {

    menu.style.display='none'
    alertFoundQuick.style.display='none'
    deplNameInit.value=''
    deplSymInit.value=''
    let foundMax = 0
    let i=0
    var totalDepl2 = 0
    spinner.style.display='block'
    while (foundMax==0){
      try {
        let deplOld = await nftCryptContract.deployedAddress(accounts[0],i);
        i++
      } catch (errror) {
        foundMax = 1
        totalDepl2=i
        //alert(totalDeployed)
      }

    }
    if (totalDepl2>0 ) {

        // update the list of contracts
        var contractsArray = new Array()
        for(var j = 0; j <= totalDepl2-1; j++) {
          try {
            let add = await nftCryptContract.deployedAddress(accounts[0],j);
            contractsArray[j]=add
            let childTemp = new ethers.Contract(add, child, ethersProvider.getSigner());
            try {

              let nameTemp = await childTemp.name();
              let symbolTemp = await childTemp.symbol();

              let apart=' ('
              let cpart = ' '
              let bpart= ')'
              let outputTemp = nameTemp.concat(apart, symbolTemp,bpart, cpart, add);
              let textnode = document.createTextNode(outputTemp)
              let node = document.createElement("a")
              node.setAttribute("class", "list-group-item list-group-item-action")
              node.setAttribute("id", add)

              node.appendChild(textnode);
              document.getElementById("manageContrDynList").appendChild(node)
              document.getElementById(add).onclick = async () => {
                //console.log(add)
                activeContract=add
                contrSelectManage(add, nameTemp, symbolTemp)

              }





            } catch (error) {

            }


          } catch (error) {

          }
        }
        //console.log(contractsArray)

      spinner.style.display='none'



      imanageContr.style.display='block'
      contrListDummy=1

      secretCheck.onclick = async () => {
        secretCheckFunction(contractsArray)
      }


    } else {
      // issue new contract page
      alert('Your NFTcrypt contract has not been deployed')
    }



}






function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/* Issue  end*/
/// Marketplace
const marketplace=document.getElementById('marketplace')
const providerAPI = new ethers.providers.EtherscanProvider("ropsten");;
const marketContent=document.getElementById('marketContent')
marketBtn.onclick = async () => {
  menu.style.display='none'
  alertFoundQuick.style.display='none'
  spinner.style.display='block'
  try{
    //let contractTotal =  await nftCryptContract.lastChildId()
    //console.log(contractTotal.toNumber())
    //contractTotal=contractTotal.toNumber()
    var nAddresses = await nftCryptContract.lastChildId();

    //console.log(uniqSendersLen)
    //var nOfContr = new Array()
    var allContracts = new Array()
    //allContracts.push('0xD4Dc3991f60cD9f9A735C3799F116bE931A6F61f')
    for (var index = 1; index <= nAddresses; index++){
      var addressOfContract = await nftCryptContract.getDeployed(index.toString());
      console.log(addressOfContract)
      allContracts[index-1]=addressOfContract
    }
    //console.log(allContracts)
    let nAllContracts=allContracts.length
    for (var nr = 0; nr <= nAllContracts-1; nr++){
      console.log(allContracts[nr])
      let childTempp = new ethers.Contract(allContracts[nr], child, ethersProvider.getSigner());
      try {
        let supplyT =  await childTempp.lastBatch();
        supplyT=supplyT.toNumber()
        console.log('last batch')
        console.log(supplyT)
        var bSize = new Array()
        var rollIndices = new Array()

        for (var ny = 1; ny <= supplyT; ny++){
          try {
            let batchsizen =  await childTempp.batchSize(ny.toString());
            batchsizen=batchsizen.toNumber()
            console.log('batch size')
            console.log(batchsizen)
            bSize[ny-1]=batchsizen
            if (ny==1){
              rollIndices[0]=0
            } else {
              rollIndices[ny-1]=rollIndices[ny-2]+bSize[ny-2]
            }
            if (ny==supplyT & supplyT>1) {
              rollIndices[ny-1]=rollIndices[ny-2]+bSize[ny-2]
              rollIndices[ny]=rollIndices[ny-1]+bSize[ny-1]
            } else if (ny==supplyT & supplyT==1) {
              rollIndices[ny]=rollIndices[ny-1]+bSize[ny-1]
            }



          } catch (e){}

        }

        console.log(rollIndices)
        console.log(bSize)


        try {
          let batchStartIdw
          let batchEndIdw
          let contractAddressThis = allContracts[nr]
          let conName = await childTempp.name()
          let conSymbol = await childTempp.symbol()
          for (var nw = 1; nw <= supplyT; nw++){
             batchStartIdw = rollIndices[nw-1]+1
             batchEndIdw = rollIndices[nw]
            //console.log(batchStartIdw)
            //console.log(batchEndIdw)
            let batchSaleStatus = false
            let batchSaleNumber = 0
            let tokenForSale
            for (var nwq = batchStartIdw; nwq <= batchEndIdw; nwq++){
              let foSaleStatus = await childTempp.forSale(nwq.toString())
              if (foSaleStatus==true){
                batchSaleStatus=true
                tokenForSale=nwq
                batchSaleNumber++
              }
            }
            let batcLen=bSize[nw-1]

            //priceBatchCheck=priceBatchCheck.toNumber()
            //console.log('sale?')
            //console.log(batchSaleNumber)



            if (batchSaleStatus==true) {
              try{
                let secretHash = await childTempp.viewSecretHash(nw.toString())
                console.log(secretHash)
                    if (secretHash.length>0){

                      try {
                        let batchURIs = await childTempp.tokenURI(batchStartIdw)
                        console.log(batchURIs)
                        let batchPrices = await childTempp.getPrice(batchStartIdw)
                        console.log(batchPrices)
                        let batchPricesBN
                        batchPrices=batchPrices.toString()
                        console.log(batchPrices)
                        let btchURI = await (await fetch(batchURIs)).json();
                        console.log(btchURI)
                        /*
                        console.log(btchURI.image);
                        console.log(btchURI.description);
                        console.log(btchURI.name);*/
                        //console.log(batchPrices)
                        // here comes card loading
                        // marketContent is the parent div
                        /* I want:
                        <div class="card" style="width: 18rem;">
                          <img class="card-img-top" src="..." alt="Card image cap">
                          <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                        </div>*/
                        try{

                        let cardDiv = document.createElement('div')
                        cardDiv.setAttribute("class", ' card marketCard')
                        //cardDiv.setAttribute("class", 'marketCard')
                        cardDiv.setAttribute("style", 'width: 18rem;')
                        let cardImg=document.createElement('img')
                        cardImg.setAttribute("class",  'img-fluid')
                        //cardImg.setAttribute("class", 'imgmarket')
                        if (btchURI.image.length>0){
                          cardImg.setAttribute("src", btchURI.image)
                        } else {
                          cardImg.setAttribute("src", 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg')
                        }
                        let cardDivBody=document.createElement('div')
                        cardDivBody.setAttribute("class", 'card-body ')
                        //cardDivBody.setAttribute("class", 'align-items-end')
                        let cardHeading=document.createElement('h5')
                        cardHeading.setAttribute("class", 'card-title')
                        cardHeading.innerText=btchURI.name

                        // contract details Paolo (PAO) 0x.....
                        let detailContract=document.createElement('p')
                        detailContract.innerText=conName.concat(' (', conSymbol,') ', contractAddressThis )
                        detailContract.setAttribute('class','cardContrDetail')

                        let descBatch = document.createTextNode(btchURI.description)

                        // price availability row
                        let priceAvailabilityDiv=document.createElement('div')
                        priceAvailabilityDiv.setAttribute('class','d-flex flex-row')

                        let priceInEth = batchPrices/(10**18)
                        let priceDiv = document.createTextNode(('Price: ').concat(priceInEth.toString(),' ETH'))

                        let availDivw = document.createElement('p')
                        availDivw.innerText=batchSaleNumber.toString().concat('/',batcLen,' left')
                        priceAvailabilityDiv.appendChild(priceDiv)
                        priceAvailabilityDiv.appendChild(availDivw)

                        let hrEl = document.createElement('hr')

                        cardDivBody.appendChild(cardHeading)
                        cardDivBody.appendChild(detailContract)
                        cardDivBody.appendChild(descBatch)
                        cardDivBody.appendChild(hrEl)
                        cardDivBody.appendChild(availDivw)
                        cardDivBody.appendChild(priceDiv)


                        cardDiv.appendChild(cardImg)
                        cardDiv.appendChild(cardDivBody)

                        //buy buyButton
                        /*<button
                          class="btn btn-primary btn-outline-dark rounded-pill "
                          id="setPrice"

                        >
                          Set price
                        </button>*/
                        let buyButton = document.createElement('button')
                        buyButton.setAttribute('class','btn btn-disable btn-primary btn-outline-dark rounded-pill')
                        //buyButton.setAttribute('id','')
                        buyButton.innerText='Buy'
                        cardDiv.appendChild(buyButton)


                        buyButton.onclick= async () => {
                          let btnElements = document.querySelectorAll('.btn-disable');

                          for(var q=0; q<btnElements.length; q++){
                            btnElements[q].disabled=true
                          }

                          console.log(contractAddressThis)
                          console.log(batchPrices)
                          console.log(tokenForSale)

                          try {
                            await childTempp.purchase(tokenForSale.toString(),{gasPrice: 20000000000, value:batchPrices})
                            buyButton.innerText='Waiting...'

                            let buycheck=0
                            while (buycheck==0) {
                              try {
                                let newOwner = await childTempp.ownerOf(tokenForSale.toString())
                                if (ethers.utils.getAddress(newOwner)==ethers.utils.getAddress(accounts[0])){
                                  buyButton.innerText='Success'
                                  buycheck=1
                                  alert('Token purchased')
                                  location.reload()
                                }

                              } catch (e) {console.log(e)}

                              }



                          } catch (e) {console.log(e)}

                        }

                        marketContent.appendChild(cardDiv)
                      } catch (e) {console.log(e)}

                      } catch (e) {}
                    }

              } catch (e) {console.log(e)}
            }

            /*
            if (priceBatchCheck>0) {
              console.log('for sale')
            }*/
            }

        } catch (e){ console.log(e)}







      } catch (error) {
        console.log(e)
      }

    }



} catch (error) {}

spinner.style.display='none'
marketplace.style.display='block'

}

const collMenu=document.getElementById('collMenu')
const verification=document.getElementById('verification')

collMenu.onclick =  async () => {
  menu.style.display='none'
  alertFoundQuick.style.display='none'
  spinner.style.display='block'
  try{
    //let contractTotal =  await nftCryptContract.lastChildId()
    //console.log(contractTotal.toNumber())
    //contractTotal=contractTotal.toNumber()
    var history2 = await providerAPI.getHistory(nftcryptFactoryAddress);

    //console.log(uniqSendersLen)
    //var nOfContr = new Array()
    var allContracts2 = new Array()
    var nAddresses2 = await nftCryptContract.lastChildId();

    //console.log(uniqSendersLen)
    //var nOfContr = new Array()

    for (var inde = 1; inde <= nAddresses2; inde++){
      var addressOfContract2 = await nftCryptContract.getDeployed(inde.toString());
      console.log(addressOfContract2)
      allContracts2[inde-1]=addressOfContract2
    }
    //console.log(allContracts)
    let nAllContracts2=allContracts2.length
    var foundBalancce =0
    for (var nr = 0; nr <= nAllContracts2-1; nr++){
      let childTempp = new ethers.Contract(allContracts2[nr], child, ethersProvider.getSigner());
      let contractAddressThis = allContracts2[nr]
      let conName = await childTempp.name()
      let conSymbol = await childTempp.symbol()
      let own3r = await childTempp.owner()
      if (ethers.utils.getAddress(own3r)!=ethers.utils.getAddress(accounts[0])){
      //console.log(allContracts2[nr])
      let userBalance = await childTempp.balanceOf(accounts[0])
      userBalance=userBalance.toNumber()
      //console.log(userBalance)

      if(userBalance>0) {
         foundBalancce =1
         for (var no = 0; no <= userBalance-1; no++){
         let ownTokenId = await childTempp.tokenOfOwnerByIndex(accounts[0],no.toString())
         //ownTokenId=ownTokenId.toNumber()
         let thisURI = await childTempp.tokenURI(ownTokenId)
         let myTokenUri = await (await fetch(thisURI)).json();
         //console.log(myTokenUri);
         //let batchPrices = await childTempp.getPrice(ownTokenId.toNumber())
         //console.log(batchPrices)





         try{

         let cardDiv = document.createElement('div')
         cardDiv.setAttribute("class", ' card marketCard')
         //cardDiv.setAttribute("class", 'marketCard')
         cardDiv.setAttribute("style", 'width: 18rem;')
         let cardImg=document.createElement('img')
         cardImg.setAttribute("class",  'img-fluid')
         //cardImg.setAttribute("class", 'imgmarket')
         if (myTokenUri.image.length>0){
           cardImg.setAttribute("src", myTokenUri.image)
         } else {
           cardImg.setAttribute("src", 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg')
         }
         let cardDivBody=document.createElement('div')
         cardDivBody.setAttribute("class", 'card-body ')
         //cardDivBody.setAttribute("class", 'align-items-end')
         let cardHeading=document.createElement('h5')
         cardHeading.setAttribute("class", 'card-title')
         cardHeading.innerText=myTokenUri.name

         // contract details Paolo (PAO) 0x.....
         let detailContract=document.createElement('p')
         detailContract.innerText=conName.concat(' (', conSymbol,') ', contractAddressThis, ' (token #', ownTokenId,')')
         detailContract.setAttribute('class','cardContrDetail')

         let descBatch = document.createTextNode(myTokenUri.description)

         // price availability row
         let priceAvailabilityDiv=document.createElement('div')
         priceAvailabilityDiv.setAttribute('class','d-flex flex-row')

         //let priceInEth = batchPrices/(10**18)
         //let priceDiv = document.createTextNode(('Price: ').concat(priceInEth.toString(),' ETH'))

         //let availDivw = document.createElement('p')
         //availDivw.innerText=batchSaleNumber.toString().concat('/',batcLen,' left')
         //priceAvailabilityDiv.appendChild(priceDiv)
         //priceAvailabilityDiv.appendChild(availDivw)

         let hrEl = document.createElement('hr')

         cardDivBody.appendChild(cardHeading)
         cardDivBody.appendChild(detailContract)
         cardDivBody.appendChild(descBatch)
         cardDivBody.appendChild(hrEl)
         //cardDivBody.appendChild(availDivw)
         //cardDivBody.appendChild(priceDiv)


         cardDiv.appendChild(cardImg)
         cardDiv.appendChild(cardDivBody)

         let buyButton = document.createElement('button')
         buyButton.setAttribute('class','btn btn-disable btn-primary btn-outline-dark rounded-pill')
         //buyButton.setAttribute('data-toggle','modal')
         //buyButton.setAttribute('data-target','#exampleModalLong')

         //buyButton.innerText='View secret'
         let secret = await childTempp.viewEncSecret(ownTokenId.toString())

         //console.log(ownTokenId);
         //console.log(secret);
         let secretJSON
         let secretHasheh
         if (secret.length>0) {
           buyButton.innerText='View secret'
            secretJSON = await (await fetch(secret)).json();
            let btyh=secretJSON.batch
             secretHasheh = await childTempp.viewSecretHash(btyh.toString())
           //console.log(secretHasheh)
         } else {
           buyButton.innerText='Secret not revealed yet'
           buyButton.disabled=true
         }



         cardDiv.appendChild(buyButton)

         buyButton.onclick = async () => {
           try {
             let resultSecret= await ethereum.request({
               method: 'eth_decrypt',
               params: [secretJSON.secret, ethereum.selectedAddress],
             })
             document.getElementById('modal_body').innerText=''
             document.getElementById('modal_body').innerHTML += linkify(resultSecret)
             //console.log(resultSecret)
             //console.log(secretJSON.secret)
             //console.log(secretHasheh)
             let verifyHash=ethers.utils.keccak256(ethers.utils.toUtf8Bytes(resultSecret))
             //console.log(verifyHash)
             if (verifyHash==secretHasheh) {
               verification.innerText='AUTHENTICITY VERIFIED'
               verification.style.color='green'
             } else {
               verification.innerText='VERIFICATION FAILED'
               verification.style.color='red'

             }
           } catch (error) {
             document.getElementById('modal_body').innerText = `Error: ${error.message}`
           }


           $('#exampleModalLong').modal('show')
         }


         marketContent.appendChild(cardDiv)
         //console.log(marketContent)
       } catch (e) {console.log(e)}
       }
      }
    }
    }


  } catch (e) {console.log(e)}
  if (foundBalancce==0) {
    alert('You do not own any NFTcrypts')
    location.reload()
  }
  spinner.style.display='none'
  marketplace.style.display='block'

}




















    encryptMessageInput.onkeyup = () => {
      if (
        !getEncryptionKeyButton.disabled &&
        encryptMessageInput.value.length > 0
      ) {
        if (encryptButton.disabled) {
          encryptButton.disabled = false
        }
      } else if (!encryptButton.disabled) {
        encryptButton.disabled = true
      }
    }

    encryptButton.onclick = () => {
      try {
        ciphertextDisplay.innerText = web3.toHex(JSON.stringify(
          sigUtil.encrypt(
            encryptionKeyDisplay.value,
            { 'data': encryptMessageInput.value },
            'x25519-xsalsa20-poly1305',
          ),
        ))
      } catch (error) {
        ciphertextDisplay.innerText = `Error: ${error.message}`
      }
    }

    decryptButton.onclick = async () => {
      console.log(encryptMessageInput.value)
      try {
        cleartextDisplay.innerText = await ethereum.request({
          method: 'eth_decrypt',
          params: [encryptMessageInput.value, ethereum.selectedAddress],
        })
      } catch (error) {
        cleartextDisplay.innerText = `Error: ${error.message}`
      }
    }
  }

  function handleNewAccounts (newAccounts) {
    accounts = newAccounts
    accountsDiv.innerHTML = accounts
    if (isMetaMaskConnected()) {
      initializeAccountButtons()
    }
    updateButtons()
  }

  updateButtons()

  if (isMetaMaskInstalled()) {

    ethereum.autoRefreshOnNetworkChange = false

    ethereum.on('accountsChanged', handleNewAccounts)

    try {
      const newAccounts = await ethereum.request({
        method: 'eth_accounts',
      })
      handleNewAccounts(newAccounts)
    } catch (err) {
      console.error('Error on init when getting accounts', err)
    }
  }
}

window.addEventListener('DOMContentLoaded', initialize)
