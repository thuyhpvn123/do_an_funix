
// import Main from '../contract/build/contracts/Main.json';
// import Session from '../contract/build/contracts/Session.json';

var web3js;
var mainInstance;
var accounts=[];
var currentAccount;
const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      console.log('Metamask is installed ')
       web3js = new Web3(window.ethereum);
      
      window.ethereum.enable()
        .then((data) => {
          accounts=data;
          currentAccount=accounts[0];
          console.log(currentAccount)
          resolve(
            new Web3(window.ethereum)
            
          );
        })
        .catch(e => {
          reject(e);
        });
      return ;
    }
    if(typeof window.web3 !== 'undefined') {
      console.log('Metamask is installed-old version ')
      return resolve((data)=>{
        currentAccount=data[0];
        web3js = new Web3(window.web3.currentProvider)
      }
      );
      
    }else{
      console.log('You have not installed Metamask. You must install MetaMask to log in')
      resolve( new Web3('http://localhost:7545'));
    }
    
  });
  
};


const initContract = () => {
  // const deploymentKey = Object.keys(Main.networks)[0];
  // return new web3.eth.Contract(
  //   Main.abi, 
  //   Main
  //     .networks[deploymentKey]
  //     .address
  // );
  // console.log(web3js)
  
  // const data = $.getJSON("../contract/build/contracts/Main.json");
  // const netId = await web3js.eth.net.getId()
  // .then((data) =>{
  //   console.log(data)
  // })
  // .catch((err)=>{
  //   console.log(err)
  // });
  
  // const netId = Object.keys(data.networks)[0]
  // console.log(netId)
  // const contractAddress = data.networks[netId].address;
  const contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lastPrice",
          "type": "uint256"
        }
      ],
      "name": "CloseSession",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "proposedPrice",
          "type": "uint256"
        }
      ],
      "name": "ProposedPrice",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "Register",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "UpdateInfo",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "Iparticipants",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "participantID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "deviation",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deviationNew",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "sessionNumber",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        }
      ],
      "name": "addSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        }
      ],
      "name": "closeSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        }
      ],
      "name": "getGivenPrices",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        }
      ],
      "name": "getLastPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        }
      ],
      "name": "getListOfPar",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getProfile",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        }
      ],
      "name": "getProposedPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "participants",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "participantID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "deviation",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deviationNew",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "sessionNumber",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "price",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_email",
          "type": "string"
        }
      ],
      "name": "register",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sessions",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_session",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_status",
          "type": "uint256"
        }
      ],
      "name": "statusSession",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_newName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_newEmail",
          "type": "string"
        }
      ],
      "name": "update",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  // console.log(contractAbi)
  mainInstance= new web3js.eth.Contract(contractAbi,"0xA47b05375f9dEF36875ACD131d6f5b58caC92171")
  return mainInstance;
  console.log(mainInstance)
  ;
  
};

const initApp = () => {
  const $create = document.getElementById('create');
  const $createResult = document.getElementById('create-result');
  const $read = document.getElementById('read');
  const $readResult = document.getElementById('read-result');
  const $edit = document.getElementById('edit');
  const $editResult = document.getElementById('edit-result');
  const $delete = document.getElementById('delete');
  const $deleteResult = document.getElementById('delete-result');
  // let accounts = [];

  // web3js.eth.getAccounts()
  // .then(_accounts => {
  //   accounts = _accounts;
  // });

  $create.addEventListener('submit', (e) => {
    e.preventDefault();
  //   // console.log(e.target.elements)
    const name = e.target.elements[1].value;
    const email = e.target.elements[2].value;
    // console.log(name+'/'+ email)
    // console.log(mainInstance)
    mainInstance.methods.register(name,email).send({from: accounts[0]})
    .then(result => {
      // console.log(result)
      $createResult.innerHTML = `New user ${name} - ${email} successfully created`;
    })
    .catch(_e => {
      $createResult.innerHTML = `Ooops... there was an error while trying to create a new user...`;
    });
    // console.log(accounts[0])
  });
//   const $btnRegister = document.getElementById('#btnRegister')
//   $btnRegister.click(function (){
//     $.post("./register",{
//       Name:$('#name').val(),
//       Email:$('#email').val()
//     },function(data){
//       console.log(data)
//     })
//   })  
  


  $read.addEventListener('submit', (e) => {
    e.preventDefault();
    const adduser = e.target.elements[0].value;
    // console.log(e.target.elements[0]);
    // console.log(e.target.elements[1]);
    mainInstance.methods.getProfile(adduser).call()
    .then(result => {
      console.log(result);
      $readResult.innerHTML = `Id: ${result[0]} <br> Address: ${result[1]} <br> Name: ${result[2]} <br> Email: ${result[3]}`;

    })
    .catch(_e => {
      $readResult.innerHTML = `Ooops... there was an error while trying to read user ${id}`;
    });
  });

  $edit.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    mainInstance.methods.update(id, name,email).send({from: accounts[0]})
    .then(result => {
      console.log(result)
      $editResult.innerHTML = `Changed name of user ${name} with email ${email} `;
    })
    .catch(_e => {
      $editResult.innerHTML = `Ooops... there was an error while trying to update name of user ${name} with ${email} `;
    });
  });

// //   $delete.addEventListener('submit', (e) => {
// //     e.preventDefault();
// //     const id = e.target.elements[0].value;
// //     crud.methods.destroy(id).send({from: accounts[0]})
// //     .then(result => {
// //       $deleteResult.innerHTML = `Deleted user ${id}`;
// //     })
// //     .catch(_e => {
// //       $deleteResult.innerHTML = `Ooops... there was an error while trying to delete iser ${id}`;
// //     });
// //   });
};

document.addEventListener('DOMContentLoaded', () => {
 
  initWeb3()
    .then(_web3 => {
      
      web3js = _web3;
      // console.log(web3js)
     initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});