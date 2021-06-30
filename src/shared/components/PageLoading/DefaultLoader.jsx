import React from 'react';
import { Spin } from 'antd/lib/index';
import { LoadingOutlined } from '@ant-design/icons';

export default function DefaultLoader() {
  return <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#1A1A27' }} spin />} />;
}
