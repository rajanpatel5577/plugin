import { Modal } from 'antd'
import React from 'react'

function ConfirmationModal({ show, setShow, message, onConfirmFunction, data }) {
    return (
        <Modal
            title={message}
            open={show}
            onOk={() => onConfirmFunction(data)}
            onCancel={() => setShow(false)}
        // footer={false}
        >
            {/* <h1>{message}</h1> */}
            {/* <div className='flex justify-start gap-4 items-center'> */}
            {/* <button className="py-2 px-4 bg-blue-600 text-white" onClick={onConfirmFunction}>Confirm</button> */}
            {/* <button className="py-2 px-4 bg-blue-600 text-white" onClick={() => setShow(false)}>Cancel</button> */}
            {/* </div> */}
        </Modal>
    )
}

export default ConfirmationModal
