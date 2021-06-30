import { Button } from "antd";
import React from "react";

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
      record.successSku.length === record.totalNumberOfRecord)
  ) {
    return null;
  }
  if (
    (status === "aborted" || status === "error") &&
    record.errorSku.length > 0
  ) {
    return <Button onClick={() => onClickButton(record)}>View SKUs</Button>;
  }
};

const getTimeFromDate = (date) => {
  const time24 = new Date(date).getHours();
  let minutes = new Date(date).getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const time12 = {
    time: "",
    append: "",
  };

  if (time24 >= 0 && time24 <= 23) {
    if (time24 < 12) {
      time12.time = time24;
      time12.append = "am";
    } else {
      time12.time = time24 % 12 || 12;
      time12.append = "pm";
    }
  }
  return `${time12.time}:${minutes} ${time12.append}`;
};

const getDuration = (time) => {
  let sec = Math.floor(time / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;


  if (hrs > 0) {
    if (min === 0) {
      return `${hrs}H`
    }
    return `${hrs}H ${min}M`;
  }
  else {
    if (min === 0) {
      return `${sec}S`
    }
    if (sec === 0) {
      return `${min}M`
    }
    return `${min}M ${sec}S`;
  }
}
const getFormatedTime = (date) => {
  const month = new Date(date).toDateString().substr(4, 3);
  const din = new Date(date).getDate();
  const year = new Date(date).getFullYear();
  return `${getTimeFromDate(date)} ${month} ${din}, ${year}`;
}
export const getColumns = (onClickButton) => {
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
        return <>{getAction(status, record, onClickButton)}</>;
      },
    },
  ];
};
