import React, { useState, useEffect, useRef } from "react";
import StatisticsDashboard from "../components/Cards/StatisticsCard";
import { GraphComp } from "../components/Charts/BarChart";
import ReactSelector from "../components/Select/ReactSelector";
import useApi from "../hooks/useApi";
import Loader from "../common/Loader";
import StatisticsServices from "../services/statistics-services";
import GraphActions from "../components/Select/GraphActions";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import StatesTable from "../components/Tables/StatesTable";
import { useReactToPrint } from 'react-to-print';

const UserStatistics = () => {
  const { data: appsList, loading } = useApi(
    "/SettingSuperAdmin/GetAllApplicationList"
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userActivityDetails, setUserActivityDetails] = useState({});
  const [isShowUserStats, setIsShowUserStats] = useState(false);
  const barChartRef = useRef(null);

  const toggleShowUserStates = () => {
    setIsShowUserStats(!isShowUserStats);
  };

  const printChart = useReactToPrint({
    content: () => barChartRef.current,
  });

  const getActivityDataHandler = async () => {
    try {
      let res = await StatisticsServices.getUserActivityData({
        ids: selectedOptions.join(",")
      });
      setUserActivityDetails(res.data.data);
    } catch (error) {
      return error;
    }
  };

  function saveCanvas(imageType) {
    //save to png
    const canvasSave = document.getElementById("stackD");
    // canvasSave.toBlob(function (blob) {
    //   saveAs(blob, "chart" + imageType);
    // });
  }

  function downloadPDF(e) {
    const but = e.target;
    but.style.display = "none";
    let input = window.document.getElementById("stackD");

    html2canvas(input).then((canvas) => {
      const img = canvas.toDataURL("image/png");

      // Calculate center position in the PDF
      const pdfWidth = 842; // A4 width in points
      const pdfHeight = 595; // A4 height in points
      const chartWidth = input.clientWidth;
      const chartHeight = input.clientHeight;
      const centerX = (pdfWidth - chartWidth) / 2;
      const centerY = (pdfHeight - chartHeight) / 2;

      const pdf = new jsPDF("l", "pt", [pdfWidth, pdfHeight]);
      pdf.addImage(img, "png", centerX, centerY, chartWidth, chartHeight);
      pdf.save("chart.pdf");

      but.style.display = "block";
    });
  }



  const toggleFullScreen = () => {
    const chartContainer = barChartRef.current?.parentNode;

    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        // User entered fullscreen mode
        setIsFullScreen(true);
      } else {
        // User exited fullscreen mode
        setIsFullScreen(false);
        document.removeEventListener("fullscreenchange", handleFullScreenChange);
      }
    };

    if (!isFullScreen) {
      if (chartContainer.requestFullscreen) {
        chartContainer.requestFullscreen();
      } else if (chartContainer.mozRequestFullScreen) {
        chartContainer.mozRequestFullScreen();
      } else if (chartContainer.webkitRequestFullscreen) {
        chartContainer.webkitRequestFullscreen();
      } else if (chartContainer.msRequestFullscreen) {
        chartContainer.msRequestFullscreen();
      }

      document.addEventListener("fullscreenchange", handleFullScreenChange);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (selectedOptions.length > 0) {
      getActivityDataHandler();
    }

    if (selectedOptions.length === 0) {
      setUserActivityDetails({});
    }
    

    //eslint-disable-next-line
  }, [selectedOptions]);

  useEffect(() => {
    if (isFullScreen) {

      const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
          toggleFullScreen(event);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    //eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Statistics</h2>
        </div>
        <hr />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <form className="row">
            <div className="col-md-6 block-word">
              <label>Apps</label>
              <ReactSelector
                setSelectedOption={setSelectedOptions}
                options={appsList?.map((opt) => ({
                  label: opt.text,
                  value: opt.value,
                }))}
              />
            </div>
            <div className="col-md-12 block-word mt-4">
              <StatisticsDashboard userActivityDetails={userActivityDetails} />
            </div>
          </form>

          <div className="row user-txt">
            <div className="col-md-5  text-center"></div>
            <div className="col-md-5">
              <h2>User Statistics</h2>
              {/* <div className="d-flex justify-content-center">

          </div> */}
            </div>
            <div className="col-md-2 d-flex justify-content-end">
              <GraphActions
                isShowUserStats={isShowUserStats}
                toggleShowUserStates={toggleShowUserStates}
                printChart={printChart}
                onSaveImageWithType={saveCanvas}
                onDownloadPdf={downloadPDF}
                viewInFullScreen={toggleFullScreen}
              />
            </div>
            <div className="">
              <GraphComp
                userActivityDetails={userActivityDetails}
                viewInFullScreen={toggleFullScreen}
                isFullScreen={isFullScreen}
                barChartRef={barChartRef}
                selectedOptions={selectedOptions}
              />
            </div>
            {isShowUserStats && <StatesTable userActivityDetails={userActivityDetails} />}
          </div>
        </>
      )}
    </div>
  );
};

export default UserStatistics;
