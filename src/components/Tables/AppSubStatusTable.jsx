import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralDeleteModal from "../Modals/GeneralDeleteModal";
import StatusServices from "../../services/status-services";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const maxVisiblePages = 50; // Number of visible page buttons
const AppSubStatusTable = ({ tableData }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortedData, setSortedData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [idForDelete, setIdForDelete] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  useEffect(() => {
    const data =
      tableData?.map((data) => {
        return {
          id: data.id,
          subStatus: data.subStatusName,
          priority:Number(data.priority)
        };
      }).sort((a, b) => a.priority - b.priority)  || [];
    setSortedData(data);
  }, [tableData]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = sortedData.filter((item) =>
    item.subStatus.toLowerCase().includes(filterText.toLowerCase())
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
      if (column === "status") {
        return (
          a.apps.localeCompare(b.status) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      return 0;
    });

    setSortedData(sorted);
  };

  const entriesText = `Showing ${startIndex + 1} to ${Math.min(
    endIndex,
    sortedData.length
  )} of ${sortedData.length} entries`;
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

  const deleteHandler = async (id) => {
    try {
      let res = await StatusServices.deleteAppSubStatus(id);
      if (res.data.status) {
        let filteredData = sortedData.filter((item) => item.id !== id);
        setSortedData(filteredData);
        handleCloseDeleteModal();
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      return error;
    }
  };

  const updateOrderHandler=async(payload)=>{
    try {
      await StatusServices.updateChecklistPositions(payload);
     
    } catch (error) {
      return error;
    } 
  }
  
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    
    if (!destination) return;
    
    // Reorder the items
    const reorderedData = Array.from(sortedData);
    const [removed] = reorderedData.splice(source.index, 1);
    reorderedData.splice(destination.index, 0, removed);
    setSortedData(reorderedData);

    let data =  reorderedData.map((item,index)=>({id:item.id,priority:`${index}`}))  
    updateOrderHandler(data)
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
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <table
          id="responsive-datatable"
          className="table table-bordered table-bordered dt-responsive nowrap"
        >
          <thead>
            <tr>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("status")}
              >
                S.No
                {sortColumn === "status" && (
                  <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th>Checklist</th>
              <th>Action</th>
            </tr>
          </thead>
          <Droppable droppableId="substatus-table" direction="vertical">
            {(provided) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {currentData.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided,snapshot) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${
                          snapshot.isDragging ? 'dragging-row' : ''
                        }`}
                      >
                        <td>{index+1}</td>
                        <td>{item.subStatus}</td>
                        <td>
                          {
                            !snapshot.isDragging&&
                            <>
                          <span
                            className="icon-font"
                            onClick={() =>
                              navigate(`/sub-status/update/${item.id}`, {
                                state: {
                                  id: item.id,
                                  subStatus: item.subStatus,
                                  priority:item.priority,
                                  isActive: item.isActive,
                                },
                              })
                            }
                          >
                            <i className="fas fa-edit" aria-hidden="true"></i>
                          </span>
                          <span
                            onClick={() => {
                              handleShowDeleteModal();
                              setIdForDelete(item.id);
                            }}
                            className="icon-fontred mx-1"
                          >
                            <i
                              className="fas fa-trash-alt"
                              aria-hidden="true"
                            ></i>
                          </span>
                          </>

                          }

                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
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

      <GeneralDeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        deleteHandler={deleteHandler}
        idForDelete={idForDelete}
      />
    </>
  );
};

export default AppSubStatusTable;
