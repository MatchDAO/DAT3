<template>
  <div>
    <h3 @click="changeProp" :time="time" :change:time="changeTime">时间戳：{{time}}</h3>
    <p>address({{walletInfo.address}})</p>
    <p>privateKey({{walletInfo.privateKey}})</p>
    <p >publicKey({{walletInfo.publicKey}})</p>
    <p @click="walletWeb.onClick">mnemonic({{walletInfo.mnemonic}})</p>
  
  </div>
</template>
<script>
export default {
  data() {
    return {
      mnemonic: 123,
      walletInfo: {
        address: null,
        privateKey: null,
        publicKey: null,
        mnemonic: null
      },
      time:null
    };
  },
  methods: {
    changeProp(){
        this.time = Date.now()
    },
    changeTime(newValue, oldValue, ownerInstance, instance) {
       // 监听数据变更 ownerInstance是this.$ownerInstance
       console.log('changeTime:newValue',newValue)
   },
    setWalletInfo(walletInfo) {
      console.log("walletInfo", walletInfo);
      this.walletInfo = walletInfo;
    }
  }
};
</script>
<script module="walletWeb" lang="renderjs">
// import * as bip32 from "bip32";
// import * as bip39 from "bip39";
// import Web3 from "web3";
import { ethers } from "ethers";
// import { getUserInfo } from "@/config/auth";
export default {
  data() {
    return {
    };
  },
  mounted() {
    this.createdWallet();
    // this.initData();
    // console.log("$ownerInstance",this.$ownerInstance);

  },
  methods: {
    onClick(event, ownerInstance) {
        console.log("你点击了助记词，触发");
    },
    createdWallet(){
      let wallet1 =  ethers.Wallet.createRandom()
      let mnemonic = wallet1.mnemonic.phrase
      console.log("mnemonic", mnemonic);
      let Wallet = ethers.Wallet.fromMnemonic(mnemonic);
      console.log("Wallet", Wallet);
      let {
        address,
        privateKey,
        publicKey
      } = Wallet
      console.log("address", address);
      console.log("privateKey", privateKey);
      console.log("publicKey", publicKey);
      this.$ownerInstance.callMethod('setWalletInfo',{
        address,
        privateKey,
        publicKey,
        mnemonic
      })

    },



    //  initData() {
    //   console.log("initData");
    //   // ethers.js生成助记词：
    //   // let wallet1 =  ethers.Wallet.createRandom()
    //   // console.log('wallet1', wallet1)
    //   // let mnemonic = wallet1.mnemonic.phrase
    //   // let mnemonic= 'finger frown child jacket analyst walk elevator shiver reason own unlock clap'
    //   // 或 bip39 生成助记词：
    // //   let mnemonic = bip39.generateMnemonic();
    
    //   // 生成助记词
    // //   console.log("mnemonic", mnemonic);
    // //   this.mnemonic = mnemonic;
    // //   try {
    // //     let Wallet = Web3.eth.accounts.create(mnemonic);
    // //     console.log("Wallet:address", Wallet.address);
    // //     console.log("Wallet:privateKey", Wallet.privateKey);
    // //   } catch (error) {
    // //     console.log(error);
    // //   }

    //   // let compressedPublicKey1 = newWallet.signingKey.keyPair.compressedPublicKey;
    //   // console.log('publicKey:', compressedPublicKey1)
    //   // ==============ETH钱包 end==================

    //   // ==============BTC钱包==================
    //   //设置生成测试or正式环境的钱包
    //   // const network = bitcoin.networks.bitcoin
    //   // // 计算seed:
    //   // const seed = bip39.mnemonicToSeed(mnemonic, '')
    //   // console.log('seed:' + util.bufferToHex(seed), "\n");
    //   // const root = bip32.fromSeed(seed, network)
    //   // const path = "m/44'/0'/0'/0/0";
    //   // const keyPair = root.derivePath(path)
    //   // const privateKey = keyPair.toWIF()
    //   // console.log("BTC私钥：", privateKey)
    //   // const publicKey = keyPair.publicKey.toString("hex")
    //   // console.log("BTC公钥：", publicKey)
    //   // let address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: network })
    //   // console.log("BTC普通地址：", address.address, "\n")
    //   // let segwitAddress = bitcoin.payments.p2sh({
    //   //     redeem: bitcoin.payments.p2wpkh({ pubkey: keypair.publicKey, net: net }),
    //   //     net: net
    //   // })
    //   // console.log('隔离见证地址：', segwitAddress.address);
    //   // ==============BTC钱包==================

    //   // const web3 = new Web3(
    //   //     "https://mainnet.infura.io/v3/cd20c69c2d8c4b37ba09e863d30f45c4"
    //   // );
    //   // var {
    //   //     version,
    //   //     providers,
    //   //     currentProvider
    //   // } = web3;
    //   // console.log(web3, version, providers, currentProvider, web3.eth);
    //   // web3.eth.getAccounts()
    //   // const wallet = web3.eth.accounts.create();
    //   //   console.log(web3.eth.defaultAccount);
    //   //   let { wallet } = getUserInfo();
    //   //   web3.eth.defaultAccount = wallet;
    //   //   console.log(web3.eth.defaultAccount);
    //   //   web3.eth.getAccounts((error, result) => {
    //   //     console.log('result',result);
    //   //   });
    //   //   web3.eth.getBalance(wallet).then(res=>{
    //   //     console.log('getBalance',result);
    //   //   })
    //   //   var balance = await web3.eth.getBalance(wallet);
    //   //   console.log(balance); // instanceof BigNumber
    //   //   console.log(balance.toString(10)); // '1000000000000'
    //   //   console.log(Number(balance)); // 1000000000000

    //   //   var transaction = await web3.eth.getTransaction(
    //   //     "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
    //   //   );
    //   //   console.log(transaction);
    //   // try {
    //   //     const wallet = web3.eth.accounts.privateKeyToAccount(privateKey)
    //   // } catch (err) {
    //   //     console.log(errr)
    //   //     uni.showToast({
    //   //         icon: 'error',
    //   //         title: err.message
    //   //     })

    //   // }
    // }
  }
};
</script>
<style lang="scss" scoped>
</style>
