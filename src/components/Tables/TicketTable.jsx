import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const maxVisiblePages = 50; // Number of visible page buttons
const TicketTable = ({ tableData }) => {
  const data =
    tableData?.map((data) => {
      return {
        
          id: data.id,
          organisation: data.organisation,
          email: data.email,
          statusName: data.statusName,
          ticketNo: data.ticketNo,
          appName: data.fullName,
          statusId: data.statusId,
        
      };
    }) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortedData, setSortedData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
   setSortedData(data)
   //eslint-disable-next-line
    }, [tableData])
  
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = sortedData.filter((item) =>
    item.appName.toLowerCase().includes(filterText.toLowerCase()) ||  item.ticketNo.toString().toLowerCase().includes(filterText.toLowerCase())
  );

  const currentData = filteredData.slice(startIndex, endIndex);
  const reversedData = [...currentData].reverse();

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (column === "appName") {
        return (
          a.appName.localeCompare(b.appName) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

    setSortedData(sorted);
  };

  const entriesText = `Showing ${startIndex + 1} to ${Math.min(
    endIndex,
    data.length
  )} of ${data.length} entries`;
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
          <p className="mb-0">Filter:</p>
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
          <th>TicketNo</th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("appName")}>
          App Name
              {sortColumn === "appName" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th>Email</th>
            <th>Organisation</th>
            <th>Status</th>
            <th className="text-center">Action</th>
          </tr>

        
        </thead>

        <tbody>
          {reversedData.map((item) => (
            <tr key={item.ticketNo}>
              <td>{item.ticketNo}</td>
              <td>{item.appName}</td>
              <td>{item.email}</td>
              <td>{item.organisation}</td>
              <td>{item.statusName}</td>
              <td className="text-center">
                <Link
                className="mx-1"
                  to={`/tickets/update/${item.id}/${item.ticketNo}/${item.statusName}/${item.statusId}`}
                  style={{ color: "rgb(34 74 190 / 84%)", cursor: "pointer" }}
                >
                  <i className="fas fa-edit" aria-hidden="true"></i>
                </Link>

                <Link
                className="mx-1"
                  to={`/app-request/details/${item.id}`}
                  style={{ color: "rgb(34 74 190 / 84%)", cursor: "pointer" }}
                >
                  <i className="fas fa-eye" aria-hidden="true"></i>
                </Link>   
             
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
    </>
  );
};

export default TicketTable;
