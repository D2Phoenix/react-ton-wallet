import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from 'store/store';
import {
    connectLedger,
    createWallet,
    getFees,
    getWalletTransactions,
    importWallet,
    rawSign,
    savePrivateKey,
    saveWords,
    updateWallet,
    walletSend,
} from './appThunks';
import { ScreenEnum } from 'enums/screenEnum';
import { PopupEnum } from 'enums/popupEnum';
import { DEFAULT_WALLET_VERSION } from 'constants/app';

export interface AppState {
    isPlugin: boolean;
    screen: ScreenEnum;
    popup: PopupEnum;
    popupState: {
        tx: any;
        address: string;
        amount: string;
        comment: string;
        invoiceLink: string;
        onSuccess: (dispatch?: AppDispatch, params?: unknown) => void;
        myMnemonicWords: string[];
        fee: string;
        message: string;
        hexToSign: string;
        signature: {
            value: string;
            successed: boolean;
        };
    };
    notification: string;
    isTestnet: boolean;
    myMnemonicWords: string[];
    myMnemonicEncryptedWords: string;
    myAddress: string;
    walletVersion: string;
    isLedger: boolean;
    balance: string;
    isContractInitialized: boolean;
    transactions: any[];
    lastTransactionTime: number;
    ledgerApp: any;
    sendingData: any;
    isMagic: boolean;
    isProxy: boolean;
    publicKeyHex: string;
    transportType: 'hid' | 'ble';
    isUpdating: boolean;
}

const initialState = (): AppState => ({
    //app
    isPlugin: !!(chrome.runtime && chrome.runtime.onConnect),
    screen: ScreenEnum.main,
    popup: PopupEnum.void,
    popupState: {
        tx: null,
        address: '',
        amount: '',
        comment: '',
        invoiceLink: '',
        onSuccess: () => ({}),
        myMnemonicWords: [],
        fee: '',
        message: '',
        hexToSign: '',
        signature: {
            value: '',
            successed: false,
        },
    },
    notification: '',
    isTestnet: window.location.href.indexOf('testnet') > -1,
    isMagic: localStorage.getItem('isMagic') === 'true',
    isProxy: localStorage.getItem('isProxy') === 'true',
    isUpdating: false,
    //wallet
    myMnemonicWords: [],
    myMnemonicEncryptedWords: localStorage.getItem('words') || '',
    myAddress: localStorage.getItem('address') || '',
    walletVersion: localStorage.getItem('walletVersion') || DEFAULT_WALLET_VERSION,
    balance: '0',
    isContractInitialized: false,
    transactions: [],
    lastTransactionTime: 0,
    sendingData: null,
    //ledger
    ledgerApp: null,
    isLedger: localStorage.getItem('isLedger') === 'true',
    publicKeyHex: localStorage.getItem('publicKey') || '',
    transportType: 'hid',
});

export const appSlice = createSlice({
    name: 'app',
    initialState: initialState(),
    reducers: {
        setScreen: (state, action: PayloadAction<ScreenEnum>) => {
            state.screen = action.payload;
        },
        setPopup: (state, action: PayloadAction<{ popup: PopupEnum; state?: any }>) => {
            state.popup = action.payload.popup;
            if (!action.payload.state) {
                return state;
            }
            if (state.popup === PopupEnum.transaction) {
                state.popupState.tx = action.payload.state.tx;
                return state;
            }
            if (state.popup === PopupEnum.send) {
                state.popupState.address = action.payload.state.address;
                state.popupState.amount = action.payload.state.amount;
                state.popupState.comment = action.payload.state.comment;
                return state;
            }
            if (state.popup === PopupEnum.sendConfirm) {
                state.popupState.address = action.payload.state.address;
                state.popupState.amount = action.payload.state.amount;
                state.popupState.comment = action.payload.state.comment;
                state.popupState.fee = action.payload.state.fee;
                return state;
            }
            if (state.popup === PopupEnum.receive) {
                state.popupState.address = action.payload.state.address;
                return state;
            }
            if (state.popup === PopupEnum.invoice) {
                state.popupState.address = action.payload.state.address;
                state.popupState.amount = action.payload.state.amount || '';
                state.popupState.comment = action.payload.state.comment || '';
                return state;
            }
            if (state.popup === PopupEnum.invoiceQr) {
                state.popupState.amount = action.payload.state.amount || '';
                state.popupState.invoiceLink = action.payload.state.invoiceLink || '';
                return state;
            }
            if (state.popup === PopupEnum.enterPassword) {
                state.popupState.onSuccess = action.payload.state.onSuccess || (() => ({}));
                return state;
            }
            if (state.popup === PopupEnum.done) {
                state.popupState.message = action.payload.state.message || '';
                return state;
            }
            if (state.popup === PopupEnum.signConfirm) {
                state.popupState.hexToSign = action.payload.state.hexToSign;
                return state;
            }
            if (state.popup === PopupEnum.void && action.payload.state) {
                state.popupState = { ...state.popupState, ...action.payload.state };
            }
        },
        setNotification: (state, action: PayloadAction<string>) => {
            state.notification = action.payload;
        },
        setMagic: (state, action: PayloadAction<boolean>) => {
            state.isMagic = action.payload;
            localStorage.setItem('magic', state.isMagic ? 'true' : 'false');
        },
        setProxy: (state, action: PayloadAction<boolean>) => {
            state.isProxy = action.payload;
            localStorage.setItem('proxy', state.isProxy ? 'true' : 'false');
        },
        disconnect: () => {
            localStorage.clear();
            return initialState();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createWallet.fulfilled, (state, action) => {
            state.myMnemonicWords = action.payload.myMnemonicWords;
            state.myAddress = action.payload.myAddress;
            localStorage.setItem('walletVersion', action.payload.walletVersion);
        });
        builder.addCase(savePrivateKey.fulfilled, (state, action) => {
            state.isLedger = false;
            localStorage.setItem('isLedger', `${state.isLedger}`);
            localStorage.setItem('address', state.myAddress);
            localStorage.setItem('words', action.payload.encryptedWords);
            state.myMnemonicEncryptedWords = action.payload.encryptedWords;
            state.myMnemonicWords = [];
        });
        builder.addCase(saveWords.fulfilled, (state, action) => {
            localStorage.setItem('words', action.payload.encryptedWords);
            state.myMnemonicEncryptedWords = action.payload.encryptedWords;
        });
        builder.addCase(updateWallet.pending, (state) => {
            state.isUpdating = true;
        });
        builder.addCase(updateWallet.fulfilled, (state, action) => {
            state.balance = action.payload.balance;
            state.isContractInitialized = action.payload.isContractInitialized;
            state.isUpdating = false;
        });
        builder.addCase(updateWallet.rejected, (state) => {
            state.isUpdating = false;
        });
        builder.addCase(getWalletTransactions.fulfilled, (state, action) => {
            state.transactions = action.payload.transactions;
            state.lastTransactionTime = action.payload.lastTransactionTime;
            state.sendingData = action.payload.sendingData;
        });
        builder.addCase(importWallet.fulfilled, (state, action) => {
            state.myMnemonicWords = action.payload.myMnemonicWords;
            state.myAddress = action.payload.myAddress;
            localStorage.setItem('walletVersion', action.payload.walletVersion);
        });
        builder.addCase(getFees.fulfilled, (state, action) => {
            state.popupState.fee = action.payload.fee;
        });
        builder.addCase(walletSend.fulfilled, (state, action) => {
            if (action.payload) {
                state.sendingData = action.payload.sendingData;
                state.ledgerApp = action.payload.ledgerApp;
                state.myAddress = action.payload.myAddress;
                state.publicKeyHex = action.payload.publicKeyHex;
                state.popupState.myMnemonicWords = [];
            }
        });
        builder.addCase(rawSign.fulfilled, (state, action) => {
            state.popupState.signature = {
                value: action.payload.signature,
                successed: true,
            };
        });
        builder.addCase(rawSign.rejected, (state) => {
            state.popupState.signature = {
                value: '',
                successed: false,
            };
        });
        builder.addCase(connectLedger.fulfilled, (state, action) => {
            state.ledgerApp = action.payload.ledgerApp;
            state.myAddress = action.payload.myAddress;
            state.publicKeyHex = action.payload.publicKeyHex;
            state.transportType = action.payload.transportType;
            state.isLedger = action.payload.isLedger;
            localStorage.setItem('walletVersion', action.payload.walletVersion);
            localStorage.setItem('address', state.myAddress);
            localStorage.setItem('isLedger', 'true');
            localStorage.setItem('ledgerTransportType', state.transportType);
            localStorage.setItem('words', 'ledger');
            localStorage.setItem('publicKey', state.publicKeyHex);
        });
    },
});

export const { setScreen, setPopup, setNotification, disconnect, setMagic, setProxy } = appSlice.actions;

export const selectScreen = (state: RootState) => state.app.screen;
export const selectPopup = (state: RootState) => state.app.popup;
export const selectPopupState = (state: RootState) => state.app.popupState;
export const selectMyAddress = (state: RootState) => state.app.myAddress;
export const selectMyMnemonicWords = (state: RootState) => state.app.myMnemonicWords;
export const selectMyMnemonicEncryptedWords = (state: RootState) => state.app.myMnemonicEncryptedWords;
export const selectBalance = (state: RootState) => state.app.balance;
export const selectTransactions = (state: RootState) => state.app.transactions;
export const selectIsLedger = (state: RootState) => state.app.isLedger;
export const selectNotification = (state: RootState) => state.app.notification;
export const selectIsTestnet = (state: RootState) => state.app.isTestnet;
export const selectIsMagic = (state: RootState) => state.app.isMagic;
export const selectIsProxy = (state: RootState) => state.app.isProxy;
export const selectIsPlugin = (state: RootState) => state.app.isPlugin;
export const selectTransportType = (state: RootState) => state.app.transportType;
export const selectIsUpdating = (state: RootState) => state.app.isUpdating;

export default appSlice.reducer;
