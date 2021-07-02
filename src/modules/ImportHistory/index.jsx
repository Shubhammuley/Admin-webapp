/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { PageHeader, Table, DatePicker, notification } from "antd";
import callApi from "../../server";
import { getColumns } from "./columns";
import ConfirmationModal from "./modal";
import DeleteConfirmationModal from "./delete-confirmation-modal";

const { RangePicker } = DatePicker;

const displayNotification = (type, message) => {
  notification[type]({
    message,
  });
};

function ImportHistory() {
  const [dataSource, setDataSource] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errorSku, setErrorSku] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    showSizeChanger: false,
    defaultCurrent: 1,
    pageSize: 10,
  });

  const getImportHistory = async (
    pageNo = 1,
    pageSize = 10,
    startDate = "",
    endDate = "",
  ) => {
    try {
      setLoading(true);
      const list = await callApi({
        url: `/api/v1/list/import-history?&pageNo=${pageNo}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`,
        method: "get",
      });
      const { data } = list;
      if (data) {
        setDataSource(data);
        setPagination((prevState) => ({
          ...prevState,
          current: pageNo,
          total:
            data.metaData && data.metaData.length ? data.metaData[0].total : 0,
        }));
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("Something went wrong.", e);
    }
  };

  const handleTableChange = useCallback((pagination) => {
    getImportHistory(pagination.current, 10);
  }, []);

  useEffect(() => {
    getImportHistory();
  }, []);

  const onClickButton = useCallback((record) => {
    setShowModal(true);
    setErrorSku(record.errorSku);
  }, []);

  const hideModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const onSelectDate = useCallback((date, dateString) => {
    const [startDate, endDate] = dateString;
    getImportHistory(pagination.current, 10, startDate, endDate);
  }, []);

  const onClickDelete = useCallback((id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  }, []);

  const hideDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const deleteLog = async() => {
    try {
      const response = await callApi({
        url: `/api/v1/delete/import-history/${deleteId}`,
        method: "delete",
      });
      console.log(response);
      const { status } = response;
      if( status === "success"){
        displayNotification('success', 'Log deleted succesfully!');
        getImportHistory();
        hideDeleteModal();
      }
    } catch (e) {
      displayNotification('error', 'Something went wrong.');
      console.log("Something went wrong.", e);
    }
  }
  return (
    <div className="common-page">
      <PageHeader ghost={false} title="Import History" />
      <div className="filter-picker">
        <RangePicker placeholder={["Start date", "End Date"]} onChange={onSelectDate} />
      </div>
      <Table
        loading={{ spinning: loading }}
        locale={{
          emptyText: loading ? <p>loading...</p> : null,
        }}
        dataSource={dataSource && dataSource.data}
        pagination={
          dataSource &&
          dataSource.metaData &&
          dataSource.metaData[0] &&
          dataSource.metaData[0].total > pagination.pageSize
            ? pagination
            : false
        }
        onChange={(pagination) => handleTableChange(pagination)}
        columns={getColumns(onClickButton, onClickDelete)}
      />
      <ConfirmationModal
        onCancel={hideModal}
        show={showModal}
        list={errorSku}
      />
      <DeleteConfirmationModal onCancel={hideDeleteModal} show={showDeleteModal} onDelete={deleteLog} />
    </div>
  );
}

export default ImportHistory;
