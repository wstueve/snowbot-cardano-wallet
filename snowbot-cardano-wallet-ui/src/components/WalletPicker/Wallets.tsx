import namiSvg from "assets/nami.svg";
import eternlSvg from "assets/eternl.svg";
import minwalletSvg from "assets/minwallet.svg";
import flintSvg from "assets/flint.svg";
import geroSvg from "assets/gero.svg";
import typhonSvg from "assets/typhon.svg";
import noneSvg from "assets/none.svg";
import {Address, TransactionUnspentOutput, Value} from "@emurgo/cardano-serialization-lib-asmjs";

export const DEFAULT_CARDANO_PROPS = {
    apiVersion: '',
    collateral: [],
    balance: 0,
    changeAddress: '',
    firstUsedAddress:  '',
    firstUnusedAddress:  '',
    firstRewardsAddress: ''
}

export let wallets = {
    none: { key:'none', description:'None Selected', svg: noneSvg, api: undefined},
    nami: { key:'nami', description:'Nami', svg: namiSvg, api: undefined},
    eternl: { key:'eternl', description:'Eternl', svg: eternlSvg, api: undefined},
    minwallet: { key:'minwallet', description:'MinWallet', svg: minwalletSvg, api: undefined},
    flint: { key:'flint', description:'Flint', svg: flintSvg, api: undefined},
    gerowallet: { key:'gerowallet', description:'GeroWallet', svg: geroSvg, api: undefined},
    typhon: {key:'typhon', description:'Typhon', svg: typhonSvg, api: undefined},
};

export const getCardanoWallet = (key) => {
    switch (key){
        case 'nami':
            return window.cardano.nami;
        case 'eternl':
            return window.cardano.eternl;
        case 'minwallet':
            return window.cardano.minwallet;
        case 'flint':
            return window.cardano.flint;
        case 'gerowallet':
            return window.cardano.gerowallet;
        case 'typhon':
            return window.cardano.typhon;
        default:
            return undefined;
    }
}

export const getCollateral = async (key) => {

    let collateralUtxos = [];

    try {

        let collateral = [];
        let wallet = await getEnabledWallet(key);
        if (!!wallet.api.getCollateral) {
            collateral = await wallet.api.getCollateral();
        } else if (!!wallet.api.experimental?.getCollateral) {
            collateral = await wallet.api.experimental.getCollateral();
        }

        for (const x of collateral) {
            let buf = Buffer.from(x, "hex")
            console.log('collateral', x);

            const utxo = TransactionUnspentOutput.from_bytes(buf);
            collateralUtxos.push(utxo);
        }
        return collateralUtxos;
    } catch (err) {
        console.log(err)
    }
}

export const getBalance = async (key) => {
    try {
        let wallet = await getEnabledWallet(key);
        console.log("api", wallet.api);
        console.log("getBalance", wallet.api.getBalance);
        const balanceCbor = await wallet.api.getBalance();
        console.log('balance', balance);

        const balance = Value.from_bytes(Buffer.from(balanceCbor, "hex")).coin().to_str();
        return balance;
    } catch (err) {
        console.log(err)
    }
}

export const getChangeAddress = async (key) => {
    try {
        let wallet = getEnabledWallet(key)
        const raw = await wallet.api.getChangeAddress();
        const changeAddress = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
        return changeAddress;
    } catch (err) {
        console.log(err)
    }
}
export const getFirstRewardsAddress = async (key) => {
    try {
        return 'sadfds';
        // const wallet = await getEnabledWallet(key);
        // const raw = await wallet.api.getRewardAddresses();
        // const rawFirst = raw[0];
        // const rewardAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        // return rewardAddress;
    } catch (err) {
        console.log(err)
    }
}

export const getFirstUsedAddress = async (key) => {
    try {
        return 'sadfds';
        // const wallet = await getEnabledWallet(key);
        // const raw = await wallet.api.getUsedAddresses();
        // const rawFirst = raw[0];
        // const usedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        // return usedAddress;
    } catch (err) {
        console.log(err)
    }
}

export const getFirstUnusedAddress = async (key) => {
    try {
        return 'sadfds';
        // const wallet = await getEnabledWallet(key);
        // const raw = await wallet.api.getUnusedAddresses();
        // const rawFirst = raw[0];
        // const unusedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        // return unusedAddress;
    } catch (err) {
        console.log(err)
    }
}

export const getCardanoProps = async (key) => {
    try{
        let props = {...DEFAULT_CARDANO_PROPS};
        let wallet = await getCardanoWallet(key).enable();
        if (wallet) {
            props.apiVersion = wallet.apiVersion;
            props.collateral = await getCollateral(key);
            props.balance = await getBalance(key);
            props.changeAddress = await this.getChangeAddress(key);
            props.firstRewardsAddress = await this.getFirstRewardsAddress(key);
            props.firstUsedAddress = await this.getFirstUsedAddress(key);
            props.firstUnusedAddress = await this.getFirstUnusedAddress(key);
        }
        console.log('cardano props', props);
        return props;
    } catch (err) {
        console.log(err)
    }

};

export const isWalletEnabled = async (key) => {
    try {
        const wallet = getCardanoWallet(key);
        return await wallet.isEnabled();
    } catch (err) {
        console.log(err)
        return false;
    }
}

export const enableWallet = async (wallet) => {
    try {
        let api = getCardanoWallet(wallet.key);
        if (!wallet.api || !await api.isEnabled())
            wallet.api = await api.enable();
        return wallet.api;
    } catch (err) {
        console.log(err)
    }
}

export const getEnabledWallet = async (key) => {
    try {
        if (!key || key === 'none') {
            return wallets.none;
        }

        if (key && key !== 'none' && wallets[key]) {
            let wallet = wallets[key]

            if (window.cardano && window.cardano[key]) {
                await enableWallet(wallet);
            }
            return wallet;
        }
    }
    catch (e) {
        //todo: catch the api error and show messages for a type -3
        console.error('Error in get and enable wallet operation:', e);
    }
    console.warn("key not enabled: ", key);
    return undefined;
}

