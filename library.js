API = {
  'Content-Type': 'application/json',
  'x-api-key': 'f1384f0e-abd1-4d69-bb64-4682beb7fde4',
};
WDT = '0x0C3FeE0988572C2703F1F5f8A05D1d4BFfeFEd5D';
CONTRACT_GAME = '0xd511E66bCB935302662f49211E0281a5878A4F92';
/*
Below are the wallet functions
以下都是钱包功能
*/
async function walletGenerate() {
  return JSON.parse(
    await (
      await fetch(`https://api.tatum.io/v3/bsc/wallet`, {
        method: 'GET',
        headers: API,
      })
    ).text()
  );
}
async function walletAddress(_addr) {
  return JSON.parse(
    await (
      await fetch(`https://api.tatum.io/v3/bsc/address/${_addr}/1`, {
        method: 'GET',
        headers: API,
      })
    ).text()
  );
}
async function walletPKey(_mne) {
  return await (
    await fetch(`https://api.tatum.io/v3/bsc/wallet/priv`, {
      method: 'POST',
      headers: API,
      body: JSON.stringify({
        index: 0,
        mnemonic: _mne,
      }),
    })
  ).json();
}
/*
Check balance functions
查余额功能
*/
async function balanceBSC(_addr) {
  j = JSON.parse(
    await (
      await fetch(`https://api.tatum.io/v3/bsc/account/balance/${_addr}`, {
        method: 'GET',
        headers: API,
      })
    ).text()
  );
  return j.balance;
}
async function balanceWDT(_addr) {
  j = JSON.parse(
    await (
      await fetch(
        `https://api.tatum.io/v3/blockchain/token/balance/BSC/${WDT}/${_addr}`,
        {
          method: 'GET',
          headers: API,
        }
      )
    ).text()
  );
  return Number(j.balance) / 1e18;
}
/*
Update custom blockchain variable - update score
更新自定区块链变量 - 更新积分
*/
async function updateScore(_score, _privKey) {
  return await (
    await fetch(`https://api.tatum.io/v3/bsc/smartcontract`, {
      method: 'POST',
      headers: API,
      body: JSON.stringify({
        contractAddress: CONTRACT_GAME,
        methodName: 'setScore',
        methodABI: {
          inputs: [
            {
              internalType: 'uint256',
              name: 'amt',
              type: 'uint256',
            },
          ],
          name: 'setScore',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        params: [_score],
        fromPrivateKey: _privKey,
      }),
    })
  ).json();
}
/*
Update custom blockchain variable - withdrawal
更新自定区块链变量 - 提币
*/
async function withdrawal(_amt, _privKey) {
  return await (
    await fetch(`https://api.tatum.io/v3/bsc/smartcontract`, {
      method: 'POST',
      headers: API,
      body: JSON.stringify({
        contractAddress: CONTRACT_GAME,
        methodName: 'withdrawal',
        methodABI: {
          inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          name: 'withdrawal',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        params: [(Number(_amt) * 1e18).toString()],
        fromPrivateKey: _privKey,
      }),
    })
  ).json();
}
/*
Fetch custom blockchain variable
取自定区块链变量
*/
async function getScore(_addr) {
  j = await (
    await fetch(`https://api.tatum.io/v3/bsc/smartcontract`, {
      method: 'POST',
      headers: API,
      body: JSON.stringify({
        contractAddress: CONTRACT_GAME,
        methodName: 'score',
        methodABI: {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'score',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        params: [_addr],
      }),
    })
  ).json();
  return j.data;
}
