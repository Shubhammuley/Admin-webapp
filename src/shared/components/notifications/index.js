import React from 'react';
import { message } from 'antd';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const DisplayNotification = (type, messageText, displayMessageDuration, key = null) => {
  const messageObj = {
    content: messageText,
    icon:
      type === 'error' ? (
        <CloseCircleOutlined />
      ) : (
        <CheckCircleOutlined />
      ),
    duration: displayMessageDuration,
  };

  if (key !== null) {
    messageObj.key = key;
  }

  message.success(messageObj);
};

export default DisplayNotification;
