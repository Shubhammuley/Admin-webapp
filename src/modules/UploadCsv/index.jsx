import React, { useCallback, useEffect, useState } from "react";
import { PageHeader, Button, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import callApi from "../../server";
import displayNotification from "../../shared/components/notifications";
import { getDuration, getFormatedTime } from "../../utils/dateFormatter";
import PageLoading from "../../shared/components/PageLoading";
import deleteicon from "../../assets/icons/Error.png";
import sandglass from "../../assets/images/hourglass.gif";

function UplaodCsv({ user }) {
  const [loading, setLoading] = useState(false);
  const [workloadDetails, setWorkloadDetails] = useState(null);
  const [totalRemainingDuration, setTotalRemainingDuration] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [updateFinished, setUpdateFinished] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lastImportDetails, setLastImportDetails] = useState(null);

  const getLastImportDetails = async () => {
    try {
      const result = await callApi({
        url: "/api/workload/v1/get/last-import",
        method: "get",
      });
      const { data } = result;
      if (data) {
        setLastImportDetails(data);
      } else {
        setLastImportDetails(null);
      }
    } catch (err) {
      console.log("Error => ", err);
    }
  };

  const getWorkloadDetails = useCallback(async () => {
    setPageLoading(true);
    try {
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
      setPageLoading(false);
    } catch (err) {
      console.log("Error => ", err);
      setPageLoading(false);
    }
    getLastImportDetails();
  }, []);

  useEffect(() => {
    getWorkloadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateInterval = useCallback(() => {
    let interval = setInterval(() => {
      if (
        workloadDetails &&
        workloadDetails.logDetails &&
        workloadDetails.logDetails.startTime
      ) {
        if (
          workloadDetails.logDetails.totalNumberOfRecord ===
          workloadDetails.logDetails.recordEntered
        ) {
          setUpdateFinished(true);
          setTotalRemainingDuration(null);
          setProcessing(false);
          clearInterval(interval);
          return;
        }
        const averageDuration = workloadDetails.logDetails.averageDuration;
        const totalDuration =
          averageDuration * workloadDetails.logDetails.totalNumberOfRecord;
        const timeRemaining =
          totalDuration -
          (new Date() - new Date(workloadDetails.logDetails.startTime));
        const estimatedDuration = getDuration(timeRemaining);
        if (timeRemaining > 0) {
          setTotalRemainingDuration(estimatedDuration);
          setProcessing(false);
        } else {
          setProcessing(true);
          setTotalRemainingDuration(null);
        }
      }
    }, 30000);
  }, [workloadDetails]);

  useEffect(() => {
    if (
      workloadDetails &&
      workloadDetails.logDetails &&
      workloadDetails.logDetails.startTime
    ) {
      if (
        workloadDetails.logDetails.totalNumberOfRecord ===
        workloadDetails.logDetails.recordEntered
      ) {
        setUpdateFinished(true);
        setTotalRemainingDuration(null);
        setProcessing(false);
        return;
      }
      const averageDuration = workloadDetails.logDetails.averageDuration;
      const totalDuration =
        averageDuration * workloadDetails.logDetails.totalNumberOfRecord;
      const timeRemaining =
        totalDuration -
        (new Date() - new Date(workloadDetails.logDetails.startTime));
      const estimatedDuration = getDuration(timeRemaining);
      if (timeRemaining > 0) {
        setTotalRemainingDuration(estimatedDuration);
        setProcessing(false);
        updateInterval();
      } else {
        setProcessing(true);
        setTotalRemainingDuration(null);
      }
    }
  }, [updateInterval, workloadDetails]);

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
    [getBase64ToSetImageURL, getWorkloadDetails, user._id]
  );

  const abortUpdate = async () => {
    setLoading(true);
    try {
      const result = await callApi({
        url: "/api/workload/v1/abort",
        method: "post",
      });
      const { status } = result;
      if (status === "success") {
        displayNotification("success", "Abort completed successfully");
        setUpdateFinished(true);
        setTotalRemainingDuration(null);
        setProcessing(false);
        setWorkloadDetails(null);
        setLastImportDetails(null);
        setUpdateFinished(false);
        getWorkloadDetails();
      }
      setLoading(false);
    } catch (err) {
      console.log("Error => ", err);
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    abortUpdate();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="common-page">
      <PageHeader ghost={false} title="Upload CSV">
        {pageLoading ? (
          <>
            <p>Processing... Please wait</p>
            <PageLoading />
          </>
        ) : (
          <>
            {!workloadDetails ? (
              <>
                <Upload
                  listType="picture"
                  showUploadList={false}
                  accept=".csv"
                  beforeUpload={beforeUpload}
                >
                  <Button
                    type="primary"
                    loading={loading}
                    icon={<UploadOutlined />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
                {lastImportDetails && (
                  <div>
                    <p>
                      Last import: Start time -{" "}
                      {getFormatedTime(lastImportDetails.startTime)}{" "}
                      {lastImportDetails.status === "aborted"
                        ? "Abort time"
                        : "End time"}{" "}
                      - {getFormatedTime(lastImportDetails.endTime)}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {totalRemainingDuration && !processing ? (
                  <div>
                    <div>
                      <img src={sandglass} alt="sandglass gif" width="100px" />
                      <p>Import in progress</p>
                    </div>
                    <p>
                      Total remaining time to complete update:{" "}
                      {totalRemainingDuration}
                    </p>
                    <p>
                      Started at:{" "}
                      {getFormatedTime(workloadDetails.logDetails.startTime)}
                    </p>
                    <p>
                      Total number of records:{" "}
                      {(
                        workloadDetails.logDetails.totalNumberOfRecord || 0
                      ).toLocaleString("en-US")}
                    </p>
                    {/* <p>
                      Records updated:{" "}
                      {(
                        workloadDetails.logDetails.recordEntered || 0
                      ).toLocaleString("en-US")}
                    </p> */}
                  </div>
                ) : (
                  <>
                    {processing && <p>Processing...</p>}
                    {updateFinished && <p>Update process finished</p>}
                  </>
                )}
                <Button
                  loading={loading}
                  onClick={showModal}
                  type="primary"
                  danger
                >
                  Abort
                </Button>
                <Modal
                  title=""
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <div>
                    <img alt="deleteicon" src={deleteicon} />
                    <h2>Abort update</h2>
                    <span>This will stop import, do you want to continue?</span>
                  </div>
                </Modal>
              </>
            )}
          </>
        )}
      </PageHeader>
    </div>
  );
}

const mapStateToProps = ({ auth }) => ({
  user: auth && auth.user,
});

export default connect(mapStateToProps)(UplaodCsv);
