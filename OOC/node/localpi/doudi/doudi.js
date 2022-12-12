const { Spot } = require('@binance/connector')
const jsonFile = require('jsonfile')
const secret = require("../../../../../bnbapi/.bnbsecret.json");
const ethers = require("ethers");
const {getsign}=require("../../api/sign/getsign");
const {getcontractinfo}=require('../../nodetool/id-readcontracts');
let provider=new ethers.providers.JsonRpcProvider(secret.url);

let typemint=3;
let mintnumber=2;
main();
async function main(){
    // await creat_q_account()
    // await locaton_transfer();
    // await OGmint(typemint, mintnumber);
    // await WLmint(typemint, mintnumber);
    await PLmint(typemint, mintnumber);
}
async function creat_q_account(){
    let accounts=new Object();
    let chainId=secret.baseinfo.chainId;
    let contractname=secret.baseinfo.contractname;
    let accounts_k=new Object();
    // 机构地址
    // for (let k = 0; k < 20; k++) {
    //     var path = "m/44'/60'/1'/0/"+k;// 第99号钱包
    //     const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
    //     // console.log(account._signingKey().privateKey);
    //     // return
    //     let address650=[
    //         account.address,
    //         50,
    //         9999999999,
    //         1,
    //     ]
    //     let signinfo650 = await getsign(
    //         chainId,contractname,
    //         address650
    //     )
    //     accounts[account.address]=[
    //         ...address650,
    //         ...Object.values(signinfo650)
    //     ]
    //     accounts_k[account.address]=account._signingKey().privateKey;
    // }
    // await jsonFile.writeFile("./OG.json",accounts,{ spaces: 2, EOL: '\r\n' });
    // await jsonFile.writeFile("./OG_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
    accounts=new Object();
    accounts_k=new Object();
    for (let k = 0; k < 250; k++) {
        var path = "m/44'/60'/2'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            2,
            9999999999,
            2,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            ...address650,
            ...Object.values(signinfo650)
        ]
        accounts_k[account.address]=account._signingKey().privateKey;
    }
    await jsonFile.writeFile("./WL.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFile("./WL_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });

    accounts=new Object();
    accounts_k=new Object();
    for (let k = 0; k < 250; k++) {
        var path = "m/44'/60'/3'/0/"+k;// 第99号钱包
        const account = ethers.Wallet.fromMnemonic(secret.mnemonic, path);
        let address650=[
            account.address,
            2,
            9999999999,
            3,
        ]
        let signinfo650 = await getsign(
            chainId,contractname,
            address650
        )
        accounts[account.address]=[
            ...address650,
            ...Object.values(signinfo650)
        ]
        accounts_k[account.address]=account._signingKey().privateKey;
    }
    await jsonFile.writeFile("./PL.json",accounts,{ spaces: 2, EOL: '\r\n' });
    await jsonFile.writeFile("./PL_k.json",accounts_k,{ spaces: 2, EOL: '\r\n' });
}
async function OGmint(typemint,mintnumber){
    if (typemint != 1 || mintnumber%50!=0) {
        console.log("error typemint or error mintnumber");
        return;
    }
    let value = 0.05;
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    // console.log(contractinfo);
    // return;
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address, 
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFile("./OG.json");
    let keyinfo = await jsonFile.readFile("./OG_k.json");
    // console.log(contractinfo[baseinfo.chainId][baseinfo.contractname].address);
    // return
    for (let i in keyinfo) {
        mintnumber-=50;
        if (mintnumber<0) {
            console.log("mint end");
            return;
        }
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);
        
        let input = [signinfo[wallet.address],signinfo[wallet.address][1]];
        // console.log(input);
        // console.log("123",tx.toString(10),tx2);
        let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
        await simpletransfer(wallet.address, e_value);
        let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
            ...input,
            { value: e_value }
        );
        tx = contractWithSigner[baseinfo.fun](
            ...input,
            {value:e_value}
        )

        delete keyinfo[i];
        await jsonFile.writeFile("./OG_k.json",keyinfo,{ spaces: 2, EOL: '\r\n' });
    }
}

async function WLmint(typemint, mintnumber) {
    if (typemint != 2 || mintnumber % 2 != 0) {
        console.log("error typemint or error mintnumber");
        return;
    }
    let value = 0.05;
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    // console.log(contractinfo);
    // return;
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address,
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFile("./WL.json");
    let keyinfo = await jsonFile.readFile("./WL_k.json");
    // console.log(contractinfo[baseinfo.chainId][baseinfo.contractname].address);
    // return
    for (let i in keyinfo) {
        mintnumber -= 2;
        if (mintnumber < 0) {
            console.log("mint end");
            return;
        }
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);

        let input = [signinfo[wallet.address], signinfo[wallet.address][1]];
        // console.log(input);
        // console.log("123",tx.toString(10),tx2);
        let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
        await simpletransfer(wallet.address, e_value);
        let estimateGas = await contractWithSigner.estimateGas[baseinfo.fun](
            ...input,
            { value: e_value }
        );
        tx = contractWithSigner[baseinfo.fun](
            ...input,
            { value: e_value }
        )
        delete keyinfo[i];
        await jsonFile.writeFile("./WL_k.json", keyinfo, { spaces: 2, EOL: '\r\n' });
    }
}
async function PLmint(typemint, mintnumber) {
    if (typemint != 3 || mintnumber % 2 != 0) {
        console.log("error typemint or error mintnumber");
        return;
    }
    let value = 0.06;
    let baseinfo = secret.baseinfo;
    contractinfo = await getcontractinfo();
    // console.log(contractinfo);
    // return;
    let contract = new ethers.Contract(
        contractinfo[baseinfo.chainId][baseinfo.contractname].address,
        contractinfo[baseinfo.chainId][baseinfo.contractname].abi,
    );
    let tx;
    let signinfo = await jsonFile.readFile("./PL.json");
    let keyinfo = await jsonFile.readFile("./PL_k.json");
    // console.log(contractinfo[baseinfo.chainId][baseinfo.contractname].address);
    // return
    for (let i in keyinfo) {
        mintnumber -= 2;
        if (mintnumber < 0) {
            console.log("mint end");
            return;
        }
        let wallet = new ethers.Wallet(keyinfo[i], provider);
        let contractWithSigner = contract.connect(wallet);

        let input = [signinfo[wallet.address], signinfo[wallet.address][1]];
        // console.log(input);
        // console.log("123",tx.toString(10),tx2);
        let e_value = ethers.utils.parseEther((value * signinfo[wallet.address][1]).toString());
        await simpletransfer(wallet.address, e_value);
        // console.log(signinfo[wallet.address][1], e_value.toString(10));
        // return
        let estimateGas = await contractWithSigner.estimateGas["Public_mint"](
            signinfo[wallet.address][1],
            { value: e_value }
        );
        tx = contractWithSigner["Public_mint"](
            signinfo[wallet.address][1],
            { value: e_value }
        )

        delete keyinfo[i];
        await jsonFile.writeFile("./PL_k.json", keyinfo, { spaces: 2, EOL: '\r\n' });
    }
}

async function simpletransfer(address,value){
    let wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    let tx = {
        // to:"0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2",
        to: address,
        value: value,
    }
    await wallet.sendTransaction(tx)
}

async function wait(ms){
    return new Promise(resolve =>setTimeout(() =>resolve(), ms));
}