import React from "react";
import { Story, Meta } from "@storybook/react";
import { WalletPicker, Props } from "../src/components/WalletPicker/WalletPicker";

const meta: Meta = {
    title: "WalletPicker",
    component: WalletPicker,
    argTypes: {
        onClick: { action: "clicked" },
        children: {
            defaultValue: "Show Wallets",
        }
    }
}

export default meta;

const Template: Story<Props> = (args) => <WalletPicker {...args} />;

export const Default = Template.bind({});

export const Secondary = Template.bind({});
Secondary.args = {
    variant: 'secondary',
    children: 'Connect Wallet',
}