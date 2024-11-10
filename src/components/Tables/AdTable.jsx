import React, { useEffect, useState } from "react";
import AdServices from "../../services/ad-services";
import Invoice from "../../common/Invoice";
import { Link, useNavigate } from "react-router-dom";
import {
  convertISOToCustomFormat,
  stringDateRangeFormate,
} from "../../helper/TimeFormate";
import Loader from "../../common/Loader";
import user from "../../assets/images/users/2.jpg";
import { toast } from "react-toastify";

const maxVisiblePages = 50; // Number of visible page buttons
const AdTable = ({ selectedOptions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [showApprovedAds, setShowApprovedAds] = useState(false);

  const navigate = useNavigate();
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const convertToDate = (dateStr) => {
    const [month, day, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setCurrentPage(1); // Reset to first page when changing the filter
  };

  // Filter and Sort Ads
  let filteredData = sortedData.filter((ad) => {
    if (filterText) {
      return (
        ad.name.toLowerCase().includes(filterText.toLowerCase()) ||
        ad.email.toLowerCase().includes(filterText.toLowerCase()) ||
        ad.adNo.toString().includes(filterText) ||
        ad.amount.toString().includes(filterText)
      );
    } else {
      const adFromDate = convertToDate(ad.dateFrom);
      const adToDate = convertToDate(ad.dateTo);

      // Ignore entries where dateTo is earlier than dateFrom
      if (adFromDate > adToDate) {
        return false;
      }

      const selectedFromDate = fromDate ? new Date(fromDate) : null;
      const selectedToDate = toDate ? new Date(toDate) : null;

      // If only fromDate is selected, filter by that
      if (selectedFromDate && !selectedToDate) {
        return adFromDate >= selectedFromDate;
      }

      // If only toDate is selected, filter by that
      if (!selectedFromDate && selectedToDate) {
        return adToDate <= selectedToDate;
      }

      // If both fromDate and toDate are selected
      if (selectedFromDate && selectedToDate) {
        return adFromDate >= selectedFromDate && adToDate <= selectedToDate;
      }

      // If no date is selected, return all ads
      return true;
    }
  });

  const currentData = filteredData.slice(startIndex, endIndex);
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

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
    setCurrentPage(1);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (column === "adNo") {
        return sortDirection === "asc" ? a.adNo - b.adNo : b.adNo - a.adNo;
      }
      if (column === "name") {
        return (
          a.name.localeCompare(b.name) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      if (column === "email") {
        return (
          a.email.localeCompare(b.email) * (sortDirection === "asc" ? 1 : -1)
        );
      }
      if (column === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }

      if (column === "date") {
        const aToDate = convertToDate(a.dateTo);
        const bToDate = convertToDate(b.dateTo);

        return sortDirection === "asc" ? aToDate - bToDate : bToDate - aToDate;
      }
      return 0;
    });

    setSortedData(sorted);
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

  const getAllAds = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedOptions.value === "all_ads") {
        res = await AdServices.getAdList(0);
      } else if (selectedOptions.value === "client_ads") {
        res = await AdServices.getAdList(0o0);
      } else {
        res = await AdServices.getAdList(selectedOptions.value);
      }
      if (res.data.status) {
        let filteredData = res.data.data.map((ad) => ({
          adNo: ad.id,
          date:
            convertISOToCustomFormat(ad.fromdate) +
            " - " +
            convertISOToCustomFormat(ad.todate),
          amount: Number(ad.priceAfterTaxTotal) || Number(ad.totalprice),
          text: ad.appname,
          createdOn: ad.createdon,
          allData: ad,
          dateFrom: convertISOToCustomFormat(ad.fromdate),
          dateTo: convertISOToCustomFormat(ad.todate),
          userInfo: ad.userInfodetails,
          name: ad.userInfodetails.name,
          email: ad.userInfodetails.email,
          adStatus: ad.addStatus,
        })).sort((a, b) =>b.adNo - a.adNo)
          
        
        if(showApprovedAds){
          setSortedData(filteredData.filter(item=>item.adStatus))
        }else{
          setSortedData(filteredData);
        }
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      let res = await AdServices.approvedAds(id);
      if (res.data.status) {
        const statusChanges = sortedData.map((item) =>
          item.adNo === id 
            ? { ...item, adStatus: status === "approved" }
            : item
        );
        
        setSortedData(statusChanges)
        toast.success("Ad Approved!");
      }
    } catch (error) {
      return error;
    }
  };

  const handleShowApprovedAds = (tabClick)=>{
setShowApprovedAds(tabClick)
  }


  useEffect(() => {
    getAllAds();
  }, [selectedOptions,showApprovedAds]);

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
        <div className="d-flex mb-3 ps-0">
          <div className="mx-3">
            <p className="mb-0">Filter by Keyword:</p>
            <input
              type="text"
              name=""
              id=""
              placeholder="AdNo, Name, Email"
              className="form form-control"
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>

          <div className="me-2 ">
            <label>From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="form form-control"
            />
          </div>
          <div className="ms-2">
            <label>To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="form form-control"
            />
          </div>
          <div className="d-flex align-items-end">
            {toDate.length > 0 || fromDate.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setToDate("");
                  setFromDate("");
                  // getAllAds();
                }}
                size="sm"
                className="btn px-0 py-1"
                variant="outline-secondary"
              >
                x
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-bodys">


                            <ul className="nav nav-pills navtab-bg nav-justified">
                                <li className="nav-item" onClick={()=>handleShowApprovedAds(false)}>
                                    <span className={`nav-link  ${!showApprovedAds ? 'active' : ''}`}>
                                        All Ads
                                    </span>
                                </li>
                                <li className="nav-item" onClick={()=>handleShowApprovedAds(true)}>
                                    <span className={`nav-link  ${showApprovedAds ? 'active' : ''}`}>
                                        Approved Ads
                                    </span>
                                </li>

                            </ul>
                         
                        </div>
                    </div>
                </div>
            </div>


            {loading ? (
        <Loader />
      ) : (
    

        <div>
          <table
            id="responsive-datatable"
            className="table table-bordered table-bordered dt-responsive nowrap"
          >
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("adNo")}
                >
                  Ad No
                  {sortColumn === "adNo" ? (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  ):
                  " ▲▼"
                  }
                </th>
                <th className="text-center">Profile</th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("name")}
                >
                  Customer Name
                  {sortColumn === "name" ? (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  ):   " ▲▼"}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("email")}
                >
                  Customer Email
                  {sortColumn === "email" ? (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  ):   " ▲▼"}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortColumn === "date" ? (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  ) :  " ▲▼"}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("amount")}
                >
                  Total Amount
                  {sortColumn === "amount" ? (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  ):   " ▲▼"}
                </th>
                {selectedOptions.label !== "Admin Ads" && (
                  <th className="text-center">Invoice</th>
                )}
                <th className="text-center">Actions</th>
                <th className="text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr key={item.adNo}>
                  <td className="">{item.adNo}</td>
                  <td className="text-center">
                    <Link to={`/customer-profile/${item?.userInfo.id}`}>
                      <img
                        src={item?.userInfo.imagePath || user}
                        alt="icon"
                        className="rounded"
                        style={{
                          width: "2rem",
                          height: "2rem",
                        }}
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/customer-profile/${item?.userInfo.id}`}
                      className="text-primary"
                    >
                      {item?.userInfo?.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      className="text-primary"
                      to={`/customer-profile/${item.userInfo.id}`}
                    >
                      {item.userInfo.email}
                    </Link>
                  </td>
                  <td className="fs-6">{stringDateRangeFormate(item.date)}</td>
                  <td>
                    {item.amount.toFixed(2)}
                    {" kr"}
                  </td>
                  {selectedOptions.label !== "Admin Ads" && (
                    <td className="text-center">
                      <Invoice inTable={true} invoice={item.allData} />
                    </td>
                  )}

                  <td style={{ width: "13%" }}>
                    <select
                      className="form form-control select-arrow"
                      value={item.adStatus ? "approved" : "pending"}
                      onChange={(e) =>
                        handleStatusChange(item.adNo, e.target.value)
                      }
                      disabled={item.adStatus}
                   
                      style={{background:item.adStatus?"#00C875":"#FB6340",color:item.adStatus?"white":'white',cursor:item.adStatus?"no-drop":"pointer"}}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </td>
                  <td className="edit text-center">
                    <span
                      className="icon-fonty"
                      onClick={() =>
                        navigate(
                          `/ad/view${
                            selectedOptions.label === "Admin Ads"
                              ? "/admin-ad/"
                              : "/"
                          }${item.adNo}`,
                          { state: item.allData }
                        )
                      }
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i>
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
        </div>
      
      )}
    </>
  );
};

export default AdTable;
