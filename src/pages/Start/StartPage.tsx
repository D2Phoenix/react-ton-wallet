import { useCallback } from 'react';

import TgsPlayer from 'components/TgsPlayer';
import { useAppDispatch } from 'store/hooks';
import { ScreenEnum } from 'enums/screenEnum';
import { setPopup, setScreen } from 'store/app/appSlice';
import { PopupEnum } from 'enums/popupEnum';
import { connectLedger } from 'store/app/appThunks';


function StartPage() {
    const dispatch = useAppDispatch();

    const navigateTo = useCallback((screen: ScreenEnum) => {
        dispatch(setScreen(screen));
    }, [dispatch]);

    const connectLedgerHandler = useCallback(() => {
        dispatch(setPopup({
            popup: PopupEnum.connectLedger,
        }));
        dispatch(connectLedger({payload: 'hid'}))
    }, [dispatch]);

    return (
        <div id="start" className="screen">
            <div className="middle">
                <TgsPlayer  name="start"
                            src="assets/lottie/intro.tgs"
                            width={120}
                            height={120}
                            className="screen-lottie" />

                <div className="screen-title">TON Wallet</div>
                <div className="screen-text">
                    TON wallet allows you to make fast and<br/>
                    secure blockchain-based payments<br/>
                    without intermediaries.
                </div>

                <div style={{"marginTop": "95px"}}>
                    <button id="start_createBtn"
                            className="btn-blue screen-btn"
                            onClick={navigateTo.bind(null, ScreenEnum.created)}
                    >
                        Create My Wallet
                    </button>
                </div>
                <div style={{"marginTop": "20px"}}>
                    <button id="start_importBtn"
                            className="btn-lite"
                            style={{"fontWeight": "normal"}}
                            onClick={navigateTo.bind(null, ScreenEnum.import)}
                    >
                        Import existing wallet
                    </button>
                </div>
                <div style={{"marginTop": "10px"}}>
                    <button id="start_importLedgerHidBtn"
                            className="btn-lite"
                            style={{"fontWeight": "normal"}}
                            onClick={connectLedgerHandler}
                    >
                        Connect Ledger
                    </button>
                </div>
                <div style={{"marginTop": "10px"}}>
                    <button id="start_importLedgerBleBtn"
                            className="btn-lite"
                            style={{"fontWeight": "normal"}}>
                        Connect Ledger via Bluetooth
                    </button>
                </div>
            </div>

            <div className="screen-text"
                 style={{"fontSize": "12px", "position": "absolute", "width": "100%", "left": "0", "bottom": "0", "textAlign": "center"}}>
            </div>
        </div>
    )
}

export default StartPage;
