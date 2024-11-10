import React, { useState } from "react";
import BlockModal from "../Modals/BlockModal";
import SeeBlockModal from "../Modals/SeeBlockModal";
import { Link } from "react-router-dom";

const maxVisiblePages = 50; // Number of visible page buttons
const AppsTable = ({ tableData }) => {
  const data =
    tableData?.map((data) => {
      return {
        id: data.id,
        name: data.name,
        block: data.status === 1 ? true : false,
      };
    }) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [showView, setShowView] = useState(false);
  const [show, setShow] = useState(false);
  const [sortedData, setSortedData] = useState(data);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseView = () => setShowView(false);
  const handleShowView = () => setShowView(true);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const currentData = filteredData.slice(startIndex, endIndex);

  const entriesText = `Showing ${startIndex + 1} to ${Math.min(
    endIndex,
    data.length
  )} of ${data.length} entries`;

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (column === "id") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (column === "name") {
        return (
          a.name.localeCompare(b.name) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

    setSortedData(sorted);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setCurrentPage(1); // Reset to first page when changing the filter
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const minPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const maxPage = Math.min(totalPages, minPage + maxVisiblePages - 1);

    for (let i = minPage; i <= maxPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`page-link ${
            i === currentPage ? "bg-primary text-white" : ""
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="mb-2" style={{ width: "10%" }}>
          <p className="mb-0">Show</p>
          <select
            value={itemsPerPage}
            className="form form-control"
            onChange={handleItemsPerPageChange}
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
            <option value="200">200</option>
            <option value="250">250</option>
          </select>
        </div>
        <div className="mb-2">
          <p className="mb-0">Filter by Keyword:</p>
          <input
            type="text"
            name=""
            id=""
            className="form form-control"
            value={filterText}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <table
        id="responsive-datatable"
        className="table table-bordered table-bordered dt-responsive nowrap"
      >
        <thead>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}>
              Nr
              {sortColumn === "id" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("name")}
            >
              Name of application
              {sortColumn === "name" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th>Block/Un-Block</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <Link to={`/apps/update/${item.id}`}>{item.name}</Link>
              </td>
              <td>
                {item.block ? (
                  <i
                    className="fa fa-check"
                    aria-hidden="true"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={handleShow}
                  ></i>
                ) : (
                  <>
                    <i
                      className="fa fa fa-ban"
                      aria-hidden="true"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() =>
                        window.confirm(
                          "Are you sure you want to Un-Block the app?"
                        )
                      }
                    ></i>
                    <i
                      className="fa fa fas fa-eye ms-3"
                      aria-hidden="true"
                      style={{
                        color: "#rgb(34 74 190 / 84%)",
                        cursor: "pointer",
                      }}
                      onClick={handleShowView}
                    ></i>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <p>{entriesText}</p>
        <div className="d-flex flex-row">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="page-link"
          >
            Previous
          </button>
          {generatePageNumbers()}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="page-link"
          >
            Next
          </button>
        </div>
      </div>
      <BlockModal handleClose={handleClose} show={show} />
      <SeeBlockModal handleCloseView={handleCloseView} showView={showView} />
    </>
  );
};

export default AppsTable;
