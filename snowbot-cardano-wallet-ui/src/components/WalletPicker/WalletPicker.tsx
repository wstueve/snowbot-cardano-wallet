import React, {HTMLAttributes, ReactNode, useState} from 'react';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
    /** Text for the button to prompt user to connect the wallet */
    children?: ReactNode;
    /** The primary or secondary variant styles */
    variant: 'primary' | 'secondary';
}

/** Utilize this component to connect a CIP30 wallet dApp */
export const WalletPicker = ({children, variant='primary', ...props}: Props) => {
    const [showConnect, setShowConnect] = useState(true);
    const [showWallets, setShowWallets] = useState(false);
    const context = useSelectedWallet();
    const setSelectedWallet = context.setSelectedWallet;
    const selectedWallet = context.selectedWallet;

//    const [delay, setDelay] = React.useState(100);

    // console.log('selectedWallet', selectedWallet);
    // useEffect(() => {
    //     if (selectedWallet && selectedWallet !== 'none') {
    //         showWalletConnect();
    //     } else {
    //         hideWalletConnect();
    //     }
    // }, [selectedWallet]);
    //
    // useInterval(async () => {
    //     //force a render slightly after load so that async wallet loading has a chance to finish
    //     if (delay !== 5000) setDelay(5000);
    // }, delay);


    const showWalletConnect = () => {
        setShowConnect(false);
//        setShowWallets(true);
    }
    // const hideWalletConnect = () => {
    //     setShowConnect(true);
    //     setShowWallets(false);
    // }
    //
    // const selectWallet = async (ev, val) => {
    //     if (val === selectedWallet) return;
    //     if (!val || val.length <= 0) {
    //         setSelectedWallet('none')
    //         return;
    //     }
    //     await window.cardano[val].enable()
    //     setSelectedWallet(val);
    // };

    return (
        <>
            {showConnect ? <button {...props} onClick={showWalletConnect} style={{ backgroundColor: variant === 'primary' ? "white" : "darkgrey"}}>{children ?? `Connect Wallet`}</button> : null}
            {/*{showWallets ? <ToggleButtonGroup*/}
            {/*    value={selectedWallet}*/}
            {/*    aria-label={"Wallet Picker"}*/}
            {/*    onChange={selectWallet}*/}
            {/*    exclusive={true}*/}
            {/*>*/}
            {/*    {window.cardano?.nami ? <ToggleButton value={wallets.nami.key}><img src={wallets.nami.svg} alt="Nami" style={{height:30}}/></ToggleButton> : null}*/}
            {/*    {window.cardano?.eternl ? <ToggleButton value={wallets.eternl.key}><img src={wallets.eternl.svg} alt="Eternl" style={{height:30}}/></ToggleButton> : null}*/}
            {/*    {window.cardano?.minwallet ? <ToggleButton value={wallets.minwallet.key}><img src={wallets.minwallet.svg} alt="Min Wallet" style={{height:30}}/></ToggleButton> : null}*/}
            {/*    {window.cardano?.flint ? <ToggleButton value={wallets.flint.key}><img src={wallets.flint.svg} alt="Flint" style={{height:30}}/></ToggleButton> : null}*/}
            {/*    {window.cardano?.gerowallet ? <ToggleButton value={wallets.gerowallet.key}><img src={wallets.gerowallet.svg} alt="Gero Wallet" style={{height:30}}/></ToggleButton> : null}*/}
            {/*    {window.cardano?.typhon ? <ToggleButton value={wallets.typhon.key}><img src={wallets.typhon.svg} alt="Typhon" style={{height:30}}/></ToggleButton> : null}*/}
            {/*</ToggleButtonGroup> : null}*/}
        </>
    );

};