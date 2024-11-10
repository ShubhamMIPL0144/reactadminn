import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GeneralDeleteModal from "../Modals/GeneralDeleteModal";
import StateServices from "../../services/states-services";
import { toast } from "react-toastify";

const maxVisiblePages = 50; // Number of visible page buttons
const CitiesTable = ({ tableData }) => {

    const data =
    tableData?.citylists?.map((data) => {
        return {
            id: data.cityId,
            city: data.cityName,      
        };
    }) || [];
    const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortedData, setSortedData] = useState(data);
  const [sortColumn, setSortColumn] = useState(null);
  const [idForDelete, setIdForDelete] = useState("");
  const [showDeleteModal,setShowDeleteModal] = useState(false)
  const handleCloseDeleteModal=()=>setShowDeleteModal(false)
  const handleShowDeleteModal=()=>setShowDeleteModal(true)
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate()

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = sortedData.filter((item) =>
    item.city.toLowerCase().includes(filterText.toLowerCase())
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
      if (column === "city") {
        return (
          a.apps.localeCompare(b.city) * (sortDirection === "asc" ? 1 : -1)
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

  const deleteHandler=async(id)=>{
    try {
      let res = await StateServices.deleteCity(id)
      if(res.data.status){
        let filteredData = sortedData.filter(item=>item.id!==id)
        setSortedData(filteredData)
        handleCloseDeleteModal()
        toast.success(res.data.message)
      }else{
        toast.error(res.data.message)

      }
    } catch (error) {
      return error
    }
  }


  useEffect(() => {
    setSortedData(data)
     //eslint-disable-next-line
     }, [tableData])
   
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
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("city")}>
              S.No
              {sortColumn === "city" && (
                <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th>Cities</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.map((item,index) => (
            <tr key={item.id}>
              <td>{index+1}</td>
              <td>{item.city}</td>
              <td>
              <div className="d-inline-block mx-1"   onClick={()=>navigate(`/city/update/${item.id}`,{state:{id:item.id,cityName:item.city,stateId:tableData.stateId}})}>
                <Link
               
                  // to={`/city/update/${item.id}`}
                  style={{ color: "rgb(34 74 190 / 84%)", cursor: "pointer" }}
                >
                  <i className="fas fa-edit" aria-hidden="true"></i>
                </Link>
               
                </div>
                <span onClick={()=>{handleShowDeleteModal();setIdForDelete(item.id)}}
                className="mx-1"
                  style={{ color: "rgb(239 7 7 / 84%)", cursor: "pointer" }}
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

      
      <GeneralDeleteModal show={showDeleteModal} handleClose={handleCloseDeleteModal} deleteHandler={deleteHandler} idForDelete={idForDelete}/>
    </>
  );
};

export default CitiesTable;
