import React from "react";
import { Modal } from "antd";
import deleteicon from "../../assets/icons/Error.png";

function DeleteConfirmationModal(props) {
  const { show, onCancel, onDelete } = props;

  return (
    <Modal
      centered
      visible={show}
      cancelText={"Cancel"}
      okText="Delete"
      okType="danger"
      onCancel={onCancel}
      onOk={onDelete}
      maskClosable={false}
      className="reopen-modal"
    >
      <div className="box">
        <img alt="deleteicon" src={deleteicon} />
        <h2>Alert</h2>
        <span>Are you sure you want to delete this log?</span>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
