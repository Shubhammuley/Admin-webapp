import React, { useCallback, useEffect, useRef, useState } from "react";
import { PageHeader, Button, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import callApi from "../../server";
import displayNotification from "../../shared/components/notifications";
import { getFormatedTime } from "../../utils/dateFormatter";
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
  const [calculating, setCalculating] = useState(false);

  const workloadDetailsRef = useRef(workloadDetails);
  workloadDetailsRef.current = workloadDetails;

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
    setPageLoading(true);
    getWorkloadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDuration = (time) => {
    let sec = Math.floor(time / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;

    if (hrs > 0) {
      if (min === 0) {
        return `${hrs}H`;
      }
      return `${hrs}H ${min}M`;
    } else {
      if (min === 0) {
        return `${sec}S`;
      }
      return `${min}M`;
    }
  };

  const updateInterval = useCallback(() => {
    let interval = setInterval(() => {
      if (
        workloadDetails &&
        workloadDetails.logDetails &&
        workloadDetails.logDetails.startTime &&
        workloadDetails.logDetails.averageDuration
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
      workloadDetails.logDetails.startTime &&
      workloadDetails.logDetails.averageDuration
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
        setTimeout(() => {
          getWorkloadDetails();
        }, timeRemaining);
      } else {
        setProcessing(true);
        setTotalRemainingDuration(null);
      }
    }
  }, [getWorkloadDetails, updateInterval, workloadDetails]);

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
              setCalculating(true);
              getWorkloadDetails();
              displayNotification("success", result.message);
              const interval = setInterval(async () => {
                await getWorkloadDetails();
                if (
                  workloadDetailsRef?.current?.logDetails?.startTime &&
                  workloadDetailsRef?.current?.logDetails?.averageDuration
                ) {
                  setCalculating(false);
                  clearInterval(interval);
                }
              }, 30000);
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
                  <div className="m-t-30">
                    <h3>Last import</h3>
                    <p>
                      Start time: {" "}
                      <span>{getFormatedTime(lastImportDetails.startTime)}{" "}</span>
                      
                    </p>
                    <p>{lastImportDetails.status === "aborted"
                        ? "Abort time"
                        : "End time"}{" "}
                      : <span>{getFormatedTime(lastImportDetails.endTime)}</span></p>
                  </div>
                )}
              </>
            ) : (
              <>
                {totalRemainingDuration && !processing ? (
                  <div>
                    <div className="gif-section">
                      <img src={sandglass} alt="sandglass gif" width="100px" />
                      <p>Import in progress</p>
                    </div>
                    <p>
                      Total remaining time to complete update:{" "}
                      <span>{totalRemainingDuration}</span>
                    </p>
                    <p>
                      Started at:{" "}
                      <span>{getFormatedTime(workloadDetails.logDetails.startTime)}</span>
                    </p>
                    <p>
                      Total number of records:{" "}
                      <span>{(
                        workloadDetails.logDetails.totalNumberOfRecord || 0
                      ).toLocaleString("en-US")}</span>
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
                    {calculating && (
                      <p>Please wait, we are calculating estimation</p>
                    )}
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
                  <div className="delete-box">
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
