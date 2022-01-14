import { useCallback } from 'react';

import TgsPlayer from 'components/TgsPlayer';
import Modal from 'components/Modal';
import { useAppDispatch } from 'store/hooks';
import { setPopup } from 'store/app/appSlice';
import { PopupEnum } from 'enums/popupEnum';

function ProcessingModal() {
    const dispatch = useAppDispatch();

    const closeHandler = useCallback(() => {
        dispatch(setPopup({
            popup: PopupEnum.void,
        }));
    }, [dispatch]);

    return (
        <Modal>
            <div id="processing" className="popup" style={{"textAlign": "center"}}>
                <TgsPlayer name="processing" src="assets/lottie/money.tgs" width={150} height={150} />
                <div className="popup-title">Sending TON</div>
                <div className="popup-grey-text">Please wait a few seconds for your<br/>transaction to be processed..</div>

                <button id="processing_closeBtn"
                        className="popup-close-btn"
                        onClick={closeHandler}
                />
            </div>
        </Modal>
    )
}

export default ProcessingModal;
