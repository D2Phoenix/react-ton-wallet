import { useCallback } from 'react';

import Modal from 'components/Modal';
import { useAppDispatch } from 'store/hooks';
import { setPopup } from 'store/app/appSlice';
import { PopupEnum } from 'enums/popupEnum';

function ConnectLedgerModal() {
    const dispatch = useAppDispatch();

    const closeHandler = useCallback(() => {
        dispatch(setPopup({
            popup: PopupEnum.void,
        }));
    }, [dispatch]);

    return (
        <Modal>
            <div id="connectLedger" className="popup" style={{"paddingBottom": "10px"}}>
                <div className="popup-title">Connect Ledger</div>
                <div className="popup-black-text">
                    Please use Edge/Google Chrome v89 or later.
                </div>
                <div className="popup-black-text" style={{"marginTop": "20px"}}>
                    Turn off Ledger Live.
                </div>
                <div className="popup-black-text" style={{"marginTop": "20px"}}>
                    If it does not connect, then try reconnecting the device.
                </div>

                <div className="popup-footer">
                    <button id="connectLedger_cancelBtn"
                            className="btn-lite"
                            onClick={closeHandler}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default ConnectLedgerModal;
