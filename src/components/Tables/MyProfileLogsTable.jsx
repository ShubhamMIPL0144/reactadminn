import React, { useState } from "react";
import Loader from "../../common/Loader";



const maxVisiblePages = 10; // Number of visible page buttons
const MyProfileLogsTable = ({tableData,logLoading}) => {
  const data =
    tableData?.map((data) => {
      return  { id: data.id, login:data.logintime,logout: data.logouttime}
    }) || [];
  const [currentPage, setCurrentPage] = useState(1);
  // const [filterText, setFilterText] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortedData, setSortedData] = useState(data);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
//   const filteredData = data.filter((item) =>
//   item.name.toLowerCase().includes(filterText.toLowerCase())
// );

const currentData = sortedData.slice(startIndex, endIndex);

  const entriesText = `Showing ${startIndex + 1} to ${Math.min(endIndex, data.length)} of ${data.length} entries`;
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

//   const handleFilterChange = (event) => {
//     setFilterText(event.target.value);
//     setCurrentPage(1); // Reset to first page when changing the filter
//   };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const minPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const maxPage = Math.min(totalPages, minPage + maxVisiblePages - 1);

    for (let i = minPage; i <= maxPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`page-link ${i === currentPage ? 'bg-primary text-white' : '' }`}
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


  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (column === 'id') {
        return (sortDirection === 'asc' ? a.id - b.id : b.id - a.id);
      }
      if (column === 'login') {
        return (
          new Date(a.login).getTime() -
          new Date(b.login).getTime()
        ) * (sortDirection === 'asc' ? 1 : -1);
      }  
      if (column === 'logout') {
        return (
          new Date(a.logout).getTime() -
          new Date(b.logout).getTime()
        ) * (sortDirection === 'asc' ? 1 : -1);
      }
      return 0;
    });

    setSortedData(sorted);
  };


  return (
  !logLoading ?(  <div>
<div className="d-flex justify-content-between">
    <div className="mb-2" style={{width:"10%"}}>
        <p className="mb-0">Show</p>
        <select value={itemsPerPage} className="form form-control" onChange={handleItemsPerPageChange}>
        <option value="10">10</option>
            {/* <option value="10">100</option> */}
            {/* <option value="150">150</option>
            <option value="200">200</option>
            <option value="250">250</option> */}
        </select>
    </div>
    {/* <div className="mb-2">
    <p className="mb-0">Filter by Keyword:</p>
        <input type="text" name="" id="" className="form form-control" 
        value={filterText}
        onChange={handleFilterChange}
        />
    </div> */}
</div>
      <table
        id="responsive-datatable"
        className="table table-bordered table-bordered dt-responsive nowrap"
      >
        <thead>
          <tr>
            <th style={{cursor:"pointer"}} onClick={() => handleSort('id')}>Nr
              {sortColumn === 'id' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th style={{cursor:"pointer"}} onClick={() => handleSort('login')}>Login Time
            
              {sortColumn === 'login' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th style={{cursor:"pointer"}} onClick={() => handleSort('logout')}>Logout Time
            {sortColumn === 'logout' && (
                <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentData?.map((item,index) => (
            <tr key={item.id}>
              <td>{index+1}</td>
              <td>{item.login}</td>
              <td>
               {item.logout}
              </td>
            
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <p>{entriesText}</p>
        <div className="d-flex flex-row">

        <button onClick={handlePrevPage} disabled={currentPage === 1}   className="page-link">
          Previous
        </button>
       {generatePageNumbers()}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}     className="page-link">
          Next
        </button>
        </div>
      </div>
    </div>):<Loader />
  );
};

export default MyProfileLogsTable;
