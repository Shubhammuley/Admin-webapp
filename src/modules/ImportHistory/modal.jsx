import React from "react";
import { Modal, Button } from "antd";

function ConfirmationModal(props) {
  const { show, onCancel, list } = props;

  return (
    <Modal
      centered
      visible={show}
      title= "Failed SKUs" 
      cancelText={"Cancel"}
      onCancel={onCancel}
      onOk={onCancel}
      maskClosable={false}
      className="reopen-modal"
      footer={[
        <Button key="back" type="primary" onClick={onCancel}>
          OK
        </Button>
      ]}
    >
      <div className="sku-list">
        <ul>
          {list.map((item) => (
            <li>{item.skuId}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
