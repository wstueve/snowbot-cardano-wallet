import namiSvg from "assets/nami.svg";
import eternlSvg from "assets/eternl.svg";
import minwalletSvg from "assets/minwallet.svg";
import flintSvg from "assets/flint.svg";
import geroSvg from "assets/gero.svg";
import typhonSvg from "assets/typhon.svg";
import noneSvg from "assets/none.svg";
import {Address, TransactionUnspentOutput, Value} from "@emurgo/cardano-serialization-lib-asmjs";
import {Buffer} from 'buffer';

//TODO: Add hot toast integration
const emptyArray: any[] = [];

export const DEFAULT_CARDANO_PROPS = {
    apiVersion: '',
    collateral: emptyArray,
    balance: '',
    changeAddress: '',
    firstUsedAddress:  '',
    firstUnusedAddress:  '',
    firstRewardsAddress: ''
}

export type Wallet = {
    key: string;
    description: string;
    svg: any;
    api: any | undefined;
}

export type Wallets = {
    none: Wallet;
    nami: Wallet;
    eternl: Wallet;
    minwallet: Wallet;
    flint: Wallet;
    gerowallet: Wallet;
    typhon: Wallet;
}


export let wallets: Wallets = {
    none: { key:'none', description:'None Selected', svg: noneSvg, api: undefined},
    nami: { key:'nami', description:'Nami', svg: namiSvg, api: undefined},
    eternl: { key:'eternl', description:'Eternl', svg: eternlSvg, api: undefined},
    minwallet: { key:'minwallet', description:'MinWallet', svg: minwalletSvg, api: undefined},
    flint: { key:'flint', description:'Flint', svg: flintSvg, api: undefined},
    gerowallet: { key:'gerowallet', description:'GeroWallet', svg: geroSvg, api: undefined},
    typhon: {key:'typhon', description:'Typhon', svg: typhonSvg, api: undefined},
};

export const getWallet = (key: string): any => {
    switch (key){
        case 'nami':
            return wallets.nami;
        case 'eternl':
            return wallets.eternl;
        case 'minwallet':
            return wallets.minwallet;
        case 'flint':
            return wallets.flint;
        case 'gerowallet':
            return wallets.gerowallet;
        case 'typhon':
            return wallets.typhon;
        default:
            return undefined;
    }
}

export const getCardanoWallet = (key: string): any => {
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

export const getCollateral = async (key: string): Promise<any[]> => {

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
        throw err;
    }
}

export const getBalance = async (key: string): Promise<string> => {
    try {
        let wallet = await getEnabledWallet(key);
        console.log("api", wallet.api);
        console.log("getBalance", wallet.api.getBalance);
        const balanceCbor = await wallet.api.getBalance();
        console.log('balance', balanceCbor);

        const balance = Value.from_bytes(Buffer.from(balanceCbor, "hex")).coin().to_js_value();
        console.log('balance', balance);
        return balance;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const getChangeAddress = async (key: string): Promise<string> => {
    try {
        let wallet = await getEnabledWallet(key)
        const raw = await wallet.api.getChangeAddress();
        const changeAddress = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
        return changeAddress;
    } catch (err) {
        console.log(err)
        throw err;
    }
}
export const getFirstRewardsAddress = async (key: string): Promise<string> => {
    try {
        const wallet = await getEnabledWallet(key);
        const raw = await wallet.api.getRewardAddresses();
        const rawFirst = raw[0];
        const rewardAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        return rewardAddress;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const getFirstUsedAddress = async (key: string): Promise<string> => {
    try {
        const wallet = await getEnabledWallet(key);
        const raw = await wallet.api.getUsedAddresses();
        const rawFirst = raw[0];
        const usedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        return usedAddress;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const getFirstUnusedAddress = async (key: string): Promise<string> => {
    try {
        const wallet = await getEnabledWallet(key);
        const raw = await wallet.api.getUnusedAddresses();
        const rawFirst = raw[0];
        const unusedAddress = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
        return unusedAddress;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const getCardanoProps = async (key: string) => {
    try{
        let props = {...DEFAULT_CARDANO_PROPS};
        let wallet = await getCardanoWallet(key).enable();
        if (wallet) {
            props.apiVersion = wallet.apiVersion;
            props.collateral = await getCollateral(key);
            props.balance = await getBalance(key);
            props.changeAddress = await getChangeAddress(key);
            props.firstRewardsAddress = await getFirstRewardsAddress(key);
            props.firstUsedAddress = await getFirstUsedAddress(key);
            props.firstUnusedAddress = await getFirstUnusedAddress(key);
        }
        console.log('cardano props', props);
        return props;
    } catch (err) {
        console.log(err)
        return undefined;
    }

};

export const isWalletEnabled = async (key: string): Promise<boolean> => {
    try {
        const wallet = getCardanoWallet(key);
        return await wallet.isEnabled();
    } catch (err) {
        console.log(err)
        return false;
    }
}

export const enableWallet = async (wallet: any): Promise<any> => {
    try {
        let api = getCardanoWallet(wallet.key);
        if (!wallet.api || !await api.isEnabled())
            wallet.api = await api.enable();
        return wallet.api;
    } catch (err) {
        console.log(err)
        throw err;
    }
}

export const getEnabledWallet = async (key: string): Promise<any> => {
    try {
        if (!key || key === 'none') {
            return wallets.none;
        }

        let wallet = getWallet(key);
        if (key && key !== 'none' && wallet) {
            if (window.cardano && window.cardano[key]) {
                await enableWallet(wallet);
            }
            return wallet;
        }
    }
    catch (e) {
        //todo: catch the api error and show messages for a type -3
        console.error('Error in get and enable wallet operation:', e);
        throw e;
    }
    console.warn("key not enabled: ", key);
    return undefined;
}

