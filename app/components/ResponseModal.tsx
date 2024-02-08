import React, { useState } from "react";
import { Modal, Result, Button } from "antd";
import Link from 'next/link';

interface ResponseModalProps {
    status: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    secondaryBtnText?: string;
    secondaryBtnValue?: string;
}

const ResponseModal: React.FC<ResponseModalProps> = ({ status, title, message, secondaryBtnText, secondaryBtnValue }) => {
    secondaryBtnValue = secondaryBtnValue ?? '/';
    const [isModalOpen, setIsModalOpen] = useState(true);
    const isPrimaryBtnHidden = status === 'success' ? true : false;
    const cancelBtnText = 'Try Again';
    const handleCancel = () => {
        setIsModalOpen(false);
        console.log('Modal Closed');
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
                </Button>
                ,
                <Link href={secondaryBtnValue}>
                    <Button className="bg-blue-700 text-white ml-3" key="submit">
                        {secondaryBtnText}
                    </Button>
                </Link>
            ]}
        >
            <Result
                status={status}
                title={title}
                subTitle={message}
            />
        </Modal>
    );
}
export default ResponseModal;