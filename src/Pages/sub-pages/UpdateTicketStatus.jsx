import React, { useEffect, useState } from "react";

import TicketServices from "../../services/ticket-services";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";

function Checkbox({ substatusName, checked, onChange }) {
  return (
    <div className="my-1">
      <label>
        <input
          className="me-2"
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        {substatusName}
      </label>
    </div>
  );
}

function CheckboxList({ data, setSelectedOptions, selectedOptions }) {
  const [checkboxes, setCheckboxes] = useState(data);

  const handleCheckboxChange = (index) => {
    const updatedCheckboxes = [...checkboxes];
    updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;

    setCheckboxes(updatedCheckboxes);
    if (updatedCheckboxes[index].checked) {
      setSelectedOptions([
        ...selectedOptions,
        updatedCheckboxes[index].subStatusId,
      ]);
    } else {
      setSelectedOptions(
        selectedOptions.filter(
          (id) => id !== updatedCheckboxes[index].subStatusId
        )
      );
    }
  };

  useEffect(() => {
    setCheckboxes(data);
    let filteredData = data?.filter(item => item.checked === true).map(item => item.subStatusId);
    setSelectedOptions(filteredData)
      //eslint-disable-next-line
  }, [data]);

  return (
    <div>
      {checkboxes.map((checkbox, index) => (
        <Checkbox
          key={index}
          substatusName={checkbox.substatusName}
          checked={checkbox.checked}
          onChange={() => handleCheckboxChange(index)}
        />
      ))}
    </div>
  );
}

const UpdateTicketStatus = () => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [data, setData] = useState([]);
  const { auth } = useSelector((state) => state.auth);
  const { id: userId } = auth.data;
  const { ticketNo, statusId, statusName } = useParams();
  const navigate = useNavigate();
  const getChecklistHandler = async () => {
    setApiLoader(true);
    try {
      let res = await TicketServices.getAppChecklist(
        Number(statusId),
        Number(ticketNo)
      );
      if (res.data.status) {
        let resData = res.data.data;

        setData(resData);
        setNotes(resData[0].notes)
      }
    } catch (error) {
      return error;
    } finally {
      setApiLoader(false);
    }
  };

  const updateChecklistHandler = async () => {

    if(!notes){
      toast.warn("Add status notes.")
return
    }
    setLoading(true);
    let payload = {
      statusId: Number(statusId),
      subStatusId: selectedOptions,
      ticketNo: Number(ticketNo),
      createdBy: userId,
      Notes:notes,
    };

    try {
      let res = await TicketServices.updateTicketChecklist(payload);
      if (res.data.status) {
        toast.success(res.data.message);
        navigate(-1)
      }
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChecklistHandler();
      //eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Update App Status</h2>
        </div>
        <hr />
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-7 block-word">
            {apiLoader ? (
              <Loader />
              ) : (
                <>

              <h4 className="my-1">Checklist</h4>
              <CheckboxList
                data={data}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
              />
              </>
              )}
              </div>
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-12 block-word">
                <h4 className="my-1">Ticket: {ticketNo}</h4>
              </div>
              <div className="col-md-12 block-word ">
                <h4 className="my-1">Status: {statusName}</h4>
              </div>
              <div className="col-md-12 block-word">
                <h4 className="my-1">Notes</h4>
                <textarea
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
                  rows={4}
                  placeholder="Status Notes!"
                  className="form-control form-control-solid"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />
      <div className="row mt-3">
        <div className="col-md-12">
          <button
            type="button"
            className="crete-btn"
            disabled={loading}
            onClick={updateChecklistHandler}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicketStatus;
