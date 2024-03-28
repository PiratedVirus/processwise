import React, { useState } from "react";
import { Modal, Result, Button } from "antd";
import Link from 'next/link';

interface ResponseModalProps {
    status: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    secondaryBtnText?: string;
    secondaryBtnValue?: string;
    showPrimaryBtn?: boolean;
    onModalClose?: () => void; // Define the new prop
}

const ResponseModal: React.FC<ResponseModalProps> = ({
    status,
    title,
    message,
    secondaryBtnText,
    secondaryBtnValue,
    showPrimaryBtn,
    onModalClose, // Destructure the new prop
}) => {
    secondaryBtnValue = secondaryBtnValue ?? '/';
    const [isModalOpen, setIsModalOpen] = useState(true);
    const isPrimaryBtnHidden = status === 'success' ? (showPrimaryBtn ? false : true) : false;
    const cancelBtnText = status === 'success' ? 'Go Back' : 'Try Again';

    const handleCancel = () => {
        setIsModalOpen(false);
        console.log('Modal Closed');
        if (onModalClose) {
            onModalClose(); // Call the onModalClose prop function if provided
        }
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            title={title}
            visible={true}
            centered
            footer={[
                <Button hidden={isPrimaryBtnHidden} key="back" onClick={handleCancel}>
                    {cancelBtnText}
                </Button>,
                secondaryBtnValue && secondaryBtnText && (
                    <Link href={secondaryBtnValue} key="secondaryBtn">
                        <Button className="bg-blue-700 text-white ml-3">
                            {secondaryBtnText}
                        </Button>
                    </Link>
                ),
            ]}
        >
            <Result
                status={status}
                title={title}
                subTitle={message}
            />
        </Modal>
    );
};

export default ResponseModal;