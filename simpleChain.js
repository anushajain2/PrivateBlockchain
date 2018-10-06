/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
const levelfunction = require('./levelSandbox.js');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    levelfunction.addDataToLevelDB(1, JSON.stringify(new Block("First block in the chain - Genesis block")).toString());
  }

  // Add new block
  addBlock(newBlock){
    if(this.getBlockHeight() = 0){
      levelfunction.addDataToLevelDB(1, JSON.stringify(new Block("First block in the chain - Genesis block")).toString());
    }
    // Block height
    newBlock.height = this.getBlockHeight();
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height>0){
      newBlock.previousBlockHash = this.getBlock(i-1).hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    levelfunction.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString());
  }

  // Get block height
    getBlockHeight(){
      db.createReadStream().on('data', function(data) {
        i++;
      }).on('error', function(err) {
          return console.log('Unable to read data stream!', err)
      }).on('close', function() {
          return i;
      });
    }

    // get block
    getBlock(blockHeight){
      db.get(blockHeight, function(err, value) {
        if (err) return console.log('Not found!', err);
        return value;
      })
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = this.getBlock(blockHeight).height;
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      var LengthOfChain = this.getBlockHeight();
      for (var i = 0; i < LengthOfChain; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.getBlock(i).hash;
        let previousHash = this.getBlock(i+1).previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

(function theLoop (i) {
  setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      Blockchain.addBlock(blockTest).then((result) => {
          console.log(result);
          i++;
          if (i < 10) theLoop(i);
      });
  }, 10000);
})(0);
