import React from "react";
import { Dropdown } from "react-bootstrap";

const GraphActions = ({
  isShowUserStats,
  toggleShowUserStates,
  printChart,
  onSaveImageWithType,
  onDownloadPdf,
  viewInFullScreen,
}) => {
  return (
    <div className="mt-1">
      <Dropdown>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            ></path>
          </svg>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as="button" onClick={viewInFullScreen}>
            View in full screen
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={printChart}>
            Print Chart
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => onSaveImageWithType(".png")}
          >
            Download PNG Image
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => onSaveImageWithType(".jpeg")}
          >
            Download JPEG Image
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={onDownloadPdf}>
            Download PDF
          </Dropdown.Item>
          <Dropdown.Item as="button" onClick={toggleShowUserStates}>
            {isShowUserStats ? "Hide Data Table" : "View Data Table"}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default GraphActions;
