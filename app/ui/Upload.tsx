import React from 'react';
import { UploadOutlined, CheckCircleOutlined, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, message, Upload, Spin } from 'antd';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';

const uploadUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/upload`;

const props: UploadProps = {
  name: 'file',
  action: uploadUrl,
  headers: {
    authorization: 'authorization-text',
  },
  beforeUpload: (file) => {
    const isPDF = file.type === 'application/pdf';
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
    }
    return isPDF || Upload.LIST_IGNORE;
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
  showUploadList: false, // Hide default upload list
};

const PDFUpload: React.FC = () => {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const customProps = {
    ...props,
    onChange: (info: any) => {
      if (info.file.status === 'uploading') {
        setIsUploading(true); // Set isUploading to true when a file starts uploading
      } else if (info.file.status === 'done' || info.file.status === 'error') {
        props?.onChange && props.onChange(info); // Call the original onChange handler if it exists
        setIsUploading(false);
      }
      // Keep only the current file in the fileList
      setFileList([info.file]);
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

      {/* Upload button */}
      <Upload {...customProps}>
        <Button type='primary'  disabled={isUploading} icon={<UploadOutlined />}>Upload to mailbox</Button>
      </Upload>
    </div>
  );
};

export default PDFUpload;
