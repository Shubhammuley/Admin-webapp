/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { PageHeader } from "antd";

function Dashboard() {
  return (
    <div className="common-page">
      <PageHeader
        ghost={false}
        title="Dashboard"
      />
    </div>
  );
}

export default Dashboard;
