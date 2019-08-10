import bitcore from 'wicc-wallet-lib';
import axios from 'axios';

export default class ContractHelper {
  static async documentSave(id, hash) {
    let validHeight = 0;
    await axios.post('https://baas-test.wiccdev.org/v2/api/block/getblockcount')
      .then(response => response.data)
      .then((json) => {
        validHeight = Number(json.data);
      })
      .catch(err => console.log(err));
    const wiccApi = new bitcore.WiccApi({ network: 'testnet' });
    const regAppInfo = {
      nTxType: bitcore.WiccApi.CONTRACT_TX,
      nVersion: 1,
      nValidHeight: validHeight, // create height
      srcRegId: '1107035-2', // sender's regId
      destRegId: '1109850-3', // app regId
      fees: 1000000, // fees pay for miner
      value: 0, // amount of WICC to be sent to the app account
      vContract: '010000003109000000617364666173646161', // contract method, hex format string
    };
    const wiccPrivateKey = 'YBmx5iS3DGDy2xb5NmU8BXse1dvj1s7VqQYZDwEmxCtVqFtPvvYy';
    const privateKey = bitcore.PrivateKey.fromWIF(wiccPrivateKey);
    const rawtx = wiccApi.createSignTransaction(privateKey, bitcore.WiccApi.CONTRACT_TX, regAppInfo);
    let txid = '';
    await axios.post('https://baas-test.wiccdev.org/v2/api/transaction/sendrawtx', { rawtx })
      .then(response => response.data)
      .then((json) => {
        txid = json.data.hash;
      });
    return txid;
  }

  static convertToHex(num1, str1, num2, str2) {
    const hex1 = (num1 + 0x10000).toString(16).substr(-4);
    let hex2 = '';
    const hex3 = (num2 + 0x10000).toString(16).substr(-4);
    let hex4 = '';
    for (let i = 0; i < str1.length; i++) {
      const hex = str1.charCodeAt(i).toString(16);
      hex2 += (`0${hex}`).slice(-2);
    }
    for (let i = 0; i < str2.length; i++) {
      const hex = str2.charCodeAt(i).toString(16);
      hex4 += (`0${hex}`).slice(-2);
    }
    return hex1 + hex2 + hex3 + hex4;
  }
}
