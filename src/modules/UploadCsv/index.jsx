import React, { useCallback, useEffect, useState } from "react";
import { PageHeader, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import callApi from "../../server";
import displayNotification from "../../shared/components/notifications";

function UplaodCsv({ user }) {
  const [loading, setLoading] = useState(false);
  const [workloadDetails, setWorkloadDetails] = useState(null);

  const getWorkloadDetails = async () => {
    const result = await callApi({
      url: "/api/workload/v1/get/details",
      method: "get",
    });
    const { data } = result;
    if (data) {
      setWorkloadDetails(data);
    } else {
      setWorkloadDetails(null);
    }
  };

  useEffect(() => {
    getWorkloadDetails();
  }, []);

  const getExtension = (filename) => {
    const parts = filename && filename.split(".");
    return parts[parts.length - 1];
  };

  const getBase64ToSetImageURL = useCallback((img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const image = new Image();
      image.src = e.target.result;
      return callback(reader.result);
    });
    reader.readAsDataURL(img);
  }, []);

  const beforeUpload = useCallback(
    async (info) => {
      setLoading(true);
      const extensionArray = ["csv"];
      if (extensionArray.includes(getExtension(info.name))) {
        getBase64ToSetImageURL(info, async () => {
          try {
            const formData = new FormData();
            formData.append("file", info);
            formData.append("userId", user._id);
            const result = await callApi({
              url: "/api/workload/v1/upload-csv-file",
              data: formData,
              method: "post",
            });
            if (result) {
              getWorkloadDetails();
              displayNotification("success", result.message);
            }
            setLoading(false);
          } catch (err) {
            displayNotification("error", err.message);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
        displayNotification("error", "Only csv file type is allowed");
      }
      return false;
    },
    [getBase64ToSetImageURL, user._id]
  );

  const abortUpdate = async () => {
    setLoading(true);
    const result = await callApi({
      url: "/api/workload/v1/abort",
      method: "post",
    });
    const { status } = result;
    if (status === "success") {
      displayNotification("success", "Abort completed successfully");
      getWorkloadDetails();
    }
    setLoading(false);
  };

  return (
    <div className="common-page">
      <PageHeader ghost={false} title="Upload CSV" />
      {!workloadDetails ? (
        <Upload
          listType="picture"
          showUploadList={false}
          accept=".csv"
          beforeUpload={beforeUpload}
        >
          <Button loading={loading} icon={<UploadOutlined />}>
            Click to Upload
          </Button>
        </Upload>
      ) : (
        <Button loading={loading} onClick={abortUpdate}>
          Abort
        </Button>
      )}
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({
  user: auth && auth.user,
});

export default connect(mapStateToProps)(UplaodCsv);
