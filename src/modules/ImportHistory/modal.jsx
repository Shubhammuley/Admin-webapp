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
        <h3>{list.length} SKUs failed</h3>
        <ol>
          {list.map((item, index) => (
            <li> {item.skuId}</li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
