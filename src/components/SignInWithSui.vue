<template>
    <button @click="this.$refs.sui.connect();">
        <span v-if="!connectedAddress">Connect</span>
        <span v-if="connectedAddress" :title="connectedAddress">{{ displayAddress }}</span>
        <SignInWithSui ref="sui" :defaultChain="defaultChain" :persist="true" @connected="onConnected"
            @client="onClient" @suiMaster="onSuiMaster" @provider="onProvider" @adapter="onAdapter"
            @disconnected="onDisconnected" @displayAddress="onDisplayAddress" :visible="false" />
    </button>
    <button v-if="connectedAddress" @click="this.$refs.sui.disconnect();">
        Disconnect
    </button>
</template>

<script lang="ts">
import { SignInWithSui } from "vue-sui";


export default {
    components: {
        SignInWithSui,
    },
    data() {
        return {
            connectedAddress: null,
            displayAddress: null,
            connectedChain: null,

            defaultChain: 'sui:testnet',
            extra: [],

            tryingTo: null,

            events: [],

            adapter: null,

            suiMaster: null,
        };
    },
    mounted() {
        // setTimeout(() => {
        //     hljs.highlightAll();
        // }, 50);
    },
    methods: {
        onDisplayAddress(displayAddress) {
            this.events.unshift({ name: 'displayAddress', args: [displayAddress] });

            this.displayAddress = displayAddress;
        },
        onRPCClick() {
            this.$refs.sui.setRPC({
                url: 'https://sui-testnet-endpoint.blockvision.org',
                rpc: {
                    // headers: {"x-allthatnode-api-key": "xxxxxxxxxx"},
                },
            });
        },
        onWrongChain(tryingTo) {
            this.events.unshift({ name: 'wrongchain', args: arguments });

            this.connectedAddress = null;
            this.connectedChain = null;

            this.tryingTo = tryingTo;
        },
        onSuiMaster(suiMaster) {
            this.events.unshift({ name: 'suiMaster', args: [suiMaster ? 'instance_of_SuiMaster (' + (suiMaster.address ? ('wallet=' + suiMaster.address) : 'readonly') + ')' : null] });

            this.connectedAddress = suiMaster.address;
            this.connectedChain = suiMaster.connectedChain;

            this.suiMaster = suiMaster;

            this.tryingTo = null;

            window.suiMaster = suiMaster;
        },
        onConnected() {
            this.events.unshift({ name: 'connected', args: arguments });
        },
        onProvider(provider) {
            this.events.unshift({ name: 'provider', args: [provider ? 'instance_of_SuiClient' : null] });
        },
        onClient(client) {
            this.events.unshift({ name: 'client', args: [client ? 'instance_of_SuiClient' : null] });
        },
        onAdapter(adapter) {
            this.events.unshift({ name: 'adapter', args: [adapter ? 'instance_of_SuiInBrowserAdapter (name=' + adapter.name + ')' : null] });

            this.adapter = adapter;
            window.adapter = adapter
        },
        onDisconnected() {
            this.events.unshift({ name: 'disconnected', args: arguments });

            this.connectedAddress = null;

            this.tryingTo = null;
        },
        async onTx() {
            try {
                const suiCoin = this.suiMaster.suiCoins.get('sui');
                const tx = new (this.suiMaster.Transaction)();
                const coinInput = await suiCoin.coinOfAmountToTxCoin(tx, this.suiMaster.address, '0.01'); // pick 0.01 SUI

                tx.transferObjects([coinInput], this.suiMaster.address); // send it to yourself

                const result = await this.suiMaster.signAndExecuteTransaction({
                    transaction: tx,
                    requestType: 'WaitForLocalExecution',
                    options: {
                    },
                });

                if (result && result.digest) {
                    alert('tx sent, digest: ' + result.digest);
                    // this.events.push({name: 'tx sent', args: [result.digest]});
                } else {
                    // this.events.push({name: 'tx not sent', args: []});
                }
            } catch (e) {
                alert(e);
            }
        },
    },
};
</script>