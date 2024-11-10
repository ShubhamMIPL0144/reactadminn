import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GeneralDeleteModal from "../Modals/GeneralDeleteModal";
import { toast } from "react-toastify";
import DiscountPolicyServices from "../../services/discount-policy-services";

const maxVisiblePages = 50; // Number of visible page buttons
const DiscountPolicyTable = ({ tableData }) => {
  const navigate = useNavigate()
  const data =
    tableData?.map((data) => {
      return {
        id: data.id,
        operator: data.operator,
        discount: data.discount,
        amount: data.amount,
      };
    }) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortedData, setSortedData] = useState(data);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [idForDelete, setIdForDelete] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const handleCloseDeleteModal = () => setShowDeleteModal(false)
  const handleShowDeleteModal = () => setShowDeleteModal(true)

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = sortedData.filter((item) =>
    item.amount.toLowerCase().includes(filterText.toLowerCase())
  );

  const currentData = filteredData.slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (column === "amount") {
        return (
          a.amount.localeCompare(b.states) * (sortDirection === "asc" ? 1 : -1)
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
          className={`page-link ${i === currentPage ? "bg-primary text-white" : ""
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

  const deleteHandler = async (id) => {
    try {
      let res = await DiscountPolicyServices.deleteDiscountPolicy(id)
      if (res.data.status) {
        let filteredData = sortedData.filter(item => item.id !== id)
        setSortedData(filteredData)
        handleCloseDeleteModal()
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)

      }
    } catch (error) {
      return error
    }
  }


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
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("states")}>
              S.No
              {sortColumn === "states" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th>Amount</th>
            <th>Discount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{`(${item.operator}) `}{item.amount}</td>
              <td>{item.discount}{`%`}</td>
              <td  >
                <div className="d-inline-block me-2" onClick={() => navigate(`/discount-policy/update/${item.id}`, { state: { id: item.id, discount: item.discount, amount: item.amount, operator: item.operator } })}>

                  <Link className="icon-font"


                  >
                    <i className="fas fa-edit" aria-hidden="true"></i>
                  </Link>
                </div>
                <span onClick={() => { handleShowDeleteModal(); setIdForDelete(item.id) }}
                  className="icon-fontred"

                >
                  <i className="fas fa-trash-alt" aria-hidden="true"></i>
                </span>
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

      <GeneralDeleteModal show={showDeleteModal} handleClose={handleCloseDeleteModal} deleteHandler={deleteHandler} idForDelete={idForDelete} />
    </>
  );
};

export default DiscountPolicyTable;
