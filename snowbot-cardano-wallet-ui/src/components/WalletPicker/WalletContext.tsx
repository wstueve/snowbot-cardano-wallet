import React, {createContext, useContext, useEffect, useState} from 'react'
import {useLocalStorage} from "react-use";
import {getEnabledWallet, wallets} from "./Wallets";

const DEFAULT_CONTEXT = {selectedWallet: wallets.none.key, setSelectedWallet: () => {}};

export const WalletContext = createContext(DEFAULT_CONTEXT);

export const useSelectedWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('WalletContext must be used within a wallet provider');
    }
    return context;
}

const WalletProvider = ({children}) => {
    const [selectedWallet, setSelectedWallet] = useLocalStorage('selectedWallet');
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const gew = async () => {
            const w = await getEnabledWallet(selectedWallet);
            if (w?.key !== selectedWallet) {
                setSelectedWallet(w?.key);
            }
        }
        gew();
    }, [selectedWallet]);

    const myVal = {...{selectedWallet: selectedWallet, setSelectedWallet: setSelectedWallet}};
    return (
        <WalletContext.Provider value={myVal}>{children}</WalletContext.Provider>
    );
}

export default WalletProvider;