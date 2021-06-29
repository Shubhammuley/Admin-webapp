/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { PageHeader, Button, Upload  } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function UplaodCsv() {

  const getExtension = (filename) => {
    const parts = filename && filename.split('.');
    return parts[parts.length - 1];
  };
  const getBase64ToSetImageURL = useCallback((img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      const image = new Image();
      image.src = e.target.result;
      return callback(reader.result);
    });
    reader.readAsDataURL(img);
  }, []);

  const beforeUpload = useCallback((info) => {
    const extensionArray = ['csv', 'xlsx'];
    if (extensionArray.includes(getExtension(info.name))) {
      getBase64ToSetImageURL(info, (base64ImageUrl) => {
      });
    } else {
    }
    return false;
  }, []);

  return (
    <div>
      <PageHeader
        ghost={false}
        title="Upload Csv"
      />

      <Upload
        listType="picture"
        showUploadList={false}
        accept=".csv,.xlsx"
        beforeUpload={beforeUpload}
      >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  );
}

export default UplaodCsv;
