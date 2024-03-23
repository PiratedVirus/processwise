import React from 'react';
import { UploadOutlined, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, message, Upload, Spin } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { updateUploadedFile } from '@/redux/reducers/userReducer';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import axios from 'axios';


const uploadUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/upload`;

const props: UploadProps = {
  name: 'file',
  action: uploadUrl,
  headers: {
    authorization: 'authorization-text',
  },
  beforeUpload: (file) => {
    const isPDF = file.type === 'application/pdf';
    const isLt4M5 = file.size / 1024 / 1024 < 4.5;
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
    }
    if (!isLt4M5) {
      message.error('File must smaller than 4.5MB!');
    }
    return isPDF && isLt4M5 || Upload.LIST_IGNORE;
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  showUploadList: false, 
};

const PDFUpload: React.FC = () => {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const manualUploadData = [{
    senderName: session?.user?.name,
    senderEmail: 'Manual Upload',
    dateTime: new Date().toISOString(),
    attachmentNames: [fileList[0]?.name],
    mailStatus: 'Uploading',
    extractedData: {},    
  }];

  const customProps = {
    ...props,
    onChange: (info: any) => {
      if (info.file.status === 'uploading') {
        setIsUploading(true);
        dispatch(updateUploadedFile({
          ...manualUploadData,
          uploadProgress: info.file.status,
        }));
      } else if (info.file.status === 'done' || info.file.status === 'error') {
        props?.onChange && props.onChange(info); 
        console.log("BLOB URL", info.file.response.downloadURL);
        setIsUploading(false);
        dispatch(updateUploadedFile({
          ...manualUploadData,
          uploadProgress: info.file.status,
        }));
        const fetchUploadData = async () => {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mails?customer=YouTube&mailbox=invoice@63qz7w.onmicrosoft.com&documentURL=${info.file.response.downloadURL}`);
          // Handle the response here
          console.log('[UPLOAD] response:', response);
        };
        fetchUploadData();
      }
      
      setFileList([info.file]); // Keep only the current file in the fileList
    },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 16 }}>
        {fileList.map(file => (
          <div key={file.uid}>
            <span className='mr-2'>{file.name}</span>
          
            {file.status === 'uploading' ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />}/> : <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />}
          </div>
        ))}
      </div>

      <Upload {...customProps}>
        <Button type='primary'  disabled={isUploading} icon={<UploadOutlined />}>Upload to mailbox</Button>
      </Upload>
    </div>
  );
};

export default PDFUpload;
