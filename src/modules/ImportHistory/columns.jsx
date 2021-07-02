import { Tooltip } from "antd";
import React from "react";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { getDuration, getFormatedTime } from "../../utils/dateFormatter";
const getStatus = (status, record) => {
  if (status === "success") {
    return (
      <div>
        Success (
        {`${record.successSku.length} out of ${record.totalNumberOfRecord}`})
      </div>
    );
  }
  if (status === "error") {
    return (
      <div>
        Error (
        {`${record.successSku.length} out of ${record.totalNumberOfRecord}`})
      </div>
    );
  }
  if (status === "failure") {
    return (
      <div>
        Failure (
        {`${record.successSku.length} out of ${record.totalNumberOfRecord}`})
      </div>
    );
  }
  if (status === "aborted") {
    return (
      <div>
        Aborted by User (
        {`${record.successSku.length} out of ${record.totalNumberOfRecord}`})
      </div>
    );
  }
};

const getAction = (status, record, onClickButton) => {
  if (
    status === "success" ||
    status === "failure" ||
    (status === "aborted" &&
      record.successSku.length === record.totalNumberOfRecord) ||
    (status === "aborted" && record.successSku.length === 0)
  ) {
    return null;
  }
  if (
    (status === "aborted" || status === "error") &&
    record.errorSku.length > 0
  ) {
    return <span onClick={() => onClickButton(record)}><Tooltip title="View SKUs"><EyeOutlined /></Tooltip></span>;
  }
};

export const getColumns = (onClickButton, onClickDelete) => {
  return [
    {
      title: "Filename",
      dataIndex: "fileName",
      width: "10%",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      width: "12%",
      render: (time) => {
        return <>{getFormatedTime(time)}</>;
      },
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      width: "12%",
      render: (time) => {
        return <>{getFormatedTime(time)}</>;
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: "8%",
      render: (duration) => {
        return <>{getDuration(duration)}</>;
      },
    },
    {
      title: "Import Status",
      dataIndex: "status",
      width: "17%",
      render: (status, record) => {
        return <>{getStatus(status, record)}</>;
      },
    },
    {
      title: "Action",
      dataIndex: "status",
      width: "8%",
      render: (status, record) => {
        return (
          <>
            {getAction(status, record, onClickButton)}
            <span onClick={() => onClickDelete(record.id)}><Tooltip title="Delete log"><DeleteOutlined /></Tooltip></span>
          </>
        );
      },
    },
  ];
};
