// Global Express Framework
const express = require("express");
const router = express.Router();
const url = require('url');
module.exports = router;
const conn = require("../../nodetool/sqlconnection");
const { sendEmailandto } = require("../../nodetool/email");
const { creatwallet } = require("./creatwallet");
var { newcontractcall } = require("../contractcall");
const { getcontractinfo } = require('../../nodetool/id-readcontracts');
const BigNumber = require("bignumber.js");
const ethers = require('ethers');
contractset();

let poapcontractinfo = {
    address: "0xD5e264f146661797FF7F849A56eF4CD13a5432b9",
    erc: "erc721",
    chainid: "1030",
    chainname: "Conflux eSpace",
    blockrpc: "https://evm.confluxrpc.com",
    blockexplorer: "https://evm.confluxscan.net"
}
async function ownerOf(tokenid) {
    // let contractinfo = await getcontractinfo();
    var params = new Object();
    params["contractname"] = "WEIDONG";
    params["fun"] = "ownerOf";
    params["params"] = [tokenid];
    let data = await newcontractcall(params);
    // console.log(contractinfo.mainwithdraw.address,data);
    return data.data.result;
}


const createKeccakHash = require('keccak')

function toChecksumAddress(address) {
    address = address.toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'

    for (var i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }

    return ret
}


exports.phonepostmint = router.post("/phonepostmint", async (req, res) => {
    var params = req.body;
    let check = ["phone", "tokenid"];
    // let check =["account","tokenid"];
    let path = "0";
    let phone = params.phone;
    let account = await creatwallet(phone, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone = params.account;
    let tokenid = params.tokenid;
    let data = account.address
    let sqlstr="select phone from wallet where address=?";
    let phonesql = await conn.select(sqlstr, data);
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            errorMessage: "error params",
        });
        return;
    }
    let check2 = ["key"];
    if (!check2.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914002",
            errorMessage: "no key"

        });
        return;
    }
    let key_set = "8d7b3b976dd7dc3f54ab3e6d234c30ff";
    if (params["key"] != key_set) {
        res.send({
            success: false,
            errorCode: "10914003",
            errorMessage: "error key"
        });
        return;
    }


    let sqlparams = [];
    for (let i in check) {
        sqlparams.push(params[check[i]]);
    }
    let checkorderid = "select * from mint_list where (account,tokenid) in ((?),(?))"
    let orderidsql = await conn.select(checkorderid, [sqlparams, [0, 0]])
    // console.log([params["account"],params["tokenid"]],"\n",orderidsql);
    // return
    if (orderidsql.length != 0) {
        res.send({
            success: false,
            errorCode: "10914004",
            data: {
                nftinfo: [{
                    ...baseinfo(poapcontractinfo,params),
                    tokenid: tokenid,
                    owner:data,
                    ownertophone:phonesql[0].phone,

                }]
            },
            errorMessage: "Repeated order submission"
        });
        return;
    }

    let sqlStr = "INSERT INTO mint_list(account,tokenid)VALUES(?,?)";
    try {
        await conn.select(sqlStr, sqlparams);
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914005",
            errorMessage: error
        });
        // sendEmailandto("Wallet:orderid error ","error orderid");
        return;
    }

    res.send({
        success: true,
        data: {
            success: true,
            nftinfo: [{
                ...baseinfo(poapcontractinfo,params),
                tokenid: tokenid,
                owner:data,
                ownertophone:phonesql[0].phone,
            }]


        }
    });
    return;
});
exports.phonecheckaccount = router.post("/phonecheckaccount", async (req, res) => {
    var params = req.body;

    let check = ["phone", "tokenid"];
    // let check =["account","tokenid"];
    let path = "0";
    let phone = params.phone;
    let account = await creatwallet(phone, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone = params.account;
    let tokenid = params.tokenid;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            errorMessage: "error params"
        });
        return;
    }
    try {
        let data = await ownerOf(params.tokenid);
        let sqlstr="select phone from wallet where address=?";
        let phonesql = await conn.select(sqlstr, data);
        // console.log(data);
        if (data !=params.account) {
            // console.log(phonesql,data);
            res.send({
                success: true,
                data: {
                    success: false,
                    nftinfo: [{
                        ...baseinfo(poapcontractinfo,params),
                        owner:data,
                        ownertophone:phonesql[0].phone,
                        tokenid: tokenid
                    }]
                }
            });
        } else {
            res.send({
                success: true,
                data: {
                    success: true,
                    nftinfo: [{
                        ...baseinfo(poapcontractinfo,params),
                        owner:data,
                        ownertophone:phonesql[0].phone,
                        tokenid: tokenid
                    }]
                }
            });
        }
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914006",
            errorMessage: "blockchain call error"
        });
    }
});
exports.phonegetnft = router.post("/phonegetnft", async (req, res) => {
    var params = req.body;
    let check = ["phone"];
    // let check =["account","tokenid"];
    let path = "0";
    let phone = params.phone;
    let account = await creatwallet(phone, path);
    // params.account = toChecksumAddress(params.account);
    params.account = toChecksumAddress(account.address);
    params.phone = params.account;
    if (!check.every(key => key in params)) {
        res.send({
            success: false,
            errorCode: "10914001",
            errorMessage: "error params",
        });
        return;
    }
    let data = account.address
    let sqlstr="select phone from wallet where address=?";
    let phonesql = await conn.select(sqlstr, data);
    try {
        let nfts = await getaccountnft(account.address);
        // console.log(nfts);
        let nftinfo = new Array()
        for (let i = 0; i < nfts.tokenids.length; i++) {
            nftinfo.push(
                {
                    ...baseinfo(poapcontractinfo,params),
                    tokenid:nfts.tokenids[i],
                    owner:data,
                    ownertophone:phonesql[0].phone,
                }
            )
        }
        res.send({
            success: true,
            data: {
                success: true,
                nftinfo:[
                    ...nftinfo
                ],
            }
        });
        return;
    } catch (error) {
        res.send({
            success: false,
            errorCode: "10914006",
            errorMessage: "blockchain call error"
        });
    }

});

function baseinfo(poapcontractinfo,params) {
    return{
        ...poapcontractinfo,
        nftlink: (poapcontractinfo.blockexplorer + "/nft/" + poapcontractinfo.address + "/" + params.tokenid),
        user: params.account,
    }
}


async function contractset(){
    const contractinfo = await getcontractinfo();
    let oocinfo;
    for (let i in contractinfo) {
        oocinfo = contractinfo[i]["WEIDONG"];
        break;
    }
    var path = "m/44'/60'/9'/9/9";
    const account = ethers.Wallet.fromMnemonic(secret.solidity.mnemonic, path);

    let provider = new ethers.providers.JsonRpcProvider(oocinfo.network.url);
    let wallet = new ethers.Wallet(account._signingKey(), provider);
    let contract = new ethers.Contract(
        oocinfo.address, 
        oocinfo.abi, 
        provider
    );
    global.contractWithSigner = contract.connect(wallet);
}
async function getaccountnft(address){
    let results =new Object();
    let nftbalance = await contractWithSigner["balanceOf"](address);
    results["balanceOf"]=nftbalance.toString();
    if (nftbalance==0) {
        return results;
    }
    let tasks=new Array();
    for (let i = 0; i < nftbalance; i++) {
        tasks.push(contractWithSigner["tokenOfOwnerByIndex"](address,i));
    }
    let tokenids =await Promise.all(tasks);
    results["tokenids"]=new Array();
    for (let i = 0; i < tokenids.length; i++) {
        results["tokenids"].push(tokenids[i].toString())
    }
    return results;
}