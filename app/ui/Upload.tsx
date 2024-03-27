import React, { useEffect, useState } from 'react';
import { UploadOutlined, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, message, Upload, Spin } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import { updateSelectedUserMailboxContent } from '@/redux/reducers/userReducer';
import axios from 'axios';

const PDFUpload: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fetchUrl, setFetchUrl] = useState<string>('');
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'invoice@63qz7w.onmicrosoft.com';
  const uploadUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/upload`;
  const { data, isLoading, isError } = useFetchApiV2(fetchUrl);

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
        message.error('File must be smaller than 4.5MB!');
      }
      return isPDF && isLt4M5 || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setIsUploading(true);
      } else if (info.file.status === 'done') {
        setIsUploading(false);
        message.success(`${info.file.name} file uploaded successfully`);
        // Assume the backend returns the URL directly in the response
        const downloadURL = info.file.response.downloadURL;
        const userName = session?.user?.name;
        const userCompany = session?.user?.userCompany;
        const uploadData = async () => {
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/documents?customer=${userCompany}&mailbox=${selectedMailbox}&documentURL=${downloadURL}&uploader=${userName}&fileName=${info.file.name}`);
            setFetchUrl(`${process.env.NEXT_PUBLIC_API_URL}/documents?customer=${userCompany}&mailbox=${selectedMailbox}&downloadURL=${downloadURL}&uploader=${userName}&fileName=${info.file.name}`);
            if(!isLoading) dispatch(updateSelectedUserMailboxContent({mailData: data, isUserMailsLoading: false}));
            return response.data; 
          } catch (error) {
            console.error(`Failed to upload attachment ${info.file.name} to Azure Blob Storage`, error);
            return { error: `Failed to upload attachment ${info.file.name}` };
          }

        };
        uploadData();

      } else if (info.file.status === 'error') {
        setIsUploading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList([info.file]);
    },
    showUploadList: false,
  };


  console.log('[UPLOAD] PDFUpload data:', data, isLoading, isError);
  // dispatch(updateSelectedUserMailboxContent({mailData: data, isUserMailsLoading: false}))
  // useEffect(() => {
  //   console.log('[UPLOAD] PDFUpload data:', data, isLoading, isError)
  //   dispatch(updateSelectedUserMailboxContent({mailData: data, isUserMailsLoading: false}));
  // },[isLoading]);


  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 16 }}>
        {fileList.map(file => (
          <div key={file.uid}>
            <span className='mr-2'>{file.name}</span>
            {file.status === 'uploading' ? <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} /> : <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />}
          </div>
        ))}
      </div>
      <Upload {...props}>
        <Button type='primary' className='bg-blue-600 text-white' disabled={isUploading} icon={<UploadOutlined />}>Upload to Mailbox</Button>
      </Upload>
    </div>
  );
};

export default PDFUpload;
