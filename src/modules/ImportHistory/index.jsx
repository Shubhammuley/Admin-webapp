/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { PageHeader, Table } from "antd";
import callApi from "../../server";
import { getColumns } from "./columns";
import ConfirmationModal from './modal';

function ImportHistory() {
  const [dataSource, setDataSource] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [errorSku, setErrorSku] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    showSizeChanger: false,
    defaultCurrent: 1,
    pageSize: 10,
  });

  const getImportHistory = async (pageNo = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const list = await callApi({
        url: `/api/v1/list/import-history?&pageNo=${pageNo}&pageSize=${pageSize}`,
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
  return (
    <div className="common-page">
      <PageHeader ghost={false} title="Import History"></PageHeader>
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
        columns={getColumns(onClickButton)}
      />
      <ConfirmationModal onCancel={hideModal} show={showModal} list={errorSku}/>
    </div>
  );
}

export default ImportHistory;
