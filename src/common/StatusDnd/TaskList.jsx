import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TicketServices from "../../services/ticket-services";
import { Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const TaskList = (props) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState([]);
  const [ticketData, setTicketData] = useState({notes:"",checkList:[]});
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

     const filteredData = tickets?.filter((item) =>
    item.organisation.toLowerCase().includes(props.filterText.toLowerCase()) ||
    item.fullName.toLowerCase().includes(props.filterText.toLowerCase()) ||
    item.ticketNo.toString().toLowerCase().includes(props.filterText.toLowerCase()) 
  );

  
  const handleShowOffcanvas = () => {
    setShowOffcanvas(true);
  };

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
    setSelectedTicket([]);
    setTicketData({...ticketData,notes:""});
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  }

  useEffect(() => {
    if (props.tickets) {
      setTickets(props.tickets);
    }
  }, [props.tickets]);

  const updateTicketStatus = async (data) => {
    try {
      let res = await TicketServices.addTicketStatus(data);
      if (!res.status) {
        toast.warn("Status is not updated.");
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const updateTicketNotes = async () => {
    // if (!ticketData.notes) {
    //   toast.warn("Enter notes!");
    //   return;
    // }
    setNotesLoading(true);
    const sanitizedChecked = ticketData.checkList
    .filter(item => item.isEnabled)
    .map(item => ({ checkListId: item.subStatusStatusId }));
    const data = {
      statusId: selectedTicket.statusId,
      ticketNo: selectedTicket.ticketNo,
      notes: ticketData.notes,
      appchecklist:sanitizedChecked
    };
    try {
      let res = await TicketServices.addTicketStatusNote(data);
      if (res.status) {
        toast.success("Notes Saved.");
        handleCloseOffcanvas();
      } else {
        toast.warn("Notes is not updated.");
      }
    } catch (error) {
      console.error("Error updating ticket notes:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const draggedTicket = filteredData.find(
      (ticket) => ticket.id.toString() === draggableId
    );

    const col = props?.columns?.find(
      (col) => col.id.toString() === destination.droppableId
    );

    if (draggedTicket && col) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id.toString() === draggableId
          ? { ...ticket, statusName: col.statusName, statusId: col.id }
          : ticket
      );

      setTickets(updatedTickets);

      updateTicketStatus({
        statusId: Number(destination.droppableId),
        ticketNo: Number(draggedTicket.ticketNo),
      });
    }
  };

  const getNotesHandler = async () => {
    setNotesLoading(true);
    try {
      let res = await TicketServices.getTicketNotes(
        selectedTicket.statusId,
        selectedTicket.ticketNo
      );
      if (res.data.status) {
        let dataRes = res.data.data
        setTicketData(dataRes[dataRes.length-1]);
      }
    } catch (error) {
      console.error("Error getting ticket notes:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTicket.statusId && selectedTicket.ticketNo) {
      getNotesHandler();
    }
  }, [selectedTicket]);

  const countByStatusId = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      if (acc[ticket.statusId]) {
        acc[ticket.statusId]++;
      } else {
        acc[ticket.statusId] = 1;
      }
      return acc;
    }, {});
  };

  const handleChecklistChange = (index, isChecked) => {
    const updatedChecklist = [...ticketData.checkList];
    updatedChecklist[index] = {
      ...updatedChecklist[index],
      isEnabled: isChecked,
    };
    setTicketData({ ...ticketData, checkList: updatedChecklist });
  };

  const statusCounts = countByStatusId(tickets);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="d-flex">
        {props?.columns?.map((col, index) => (
          <Droppable droppableId={col.id.toString()} key={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${
                  index === 0
                    ? "order"
                    : index === 1
                    ? "pending ms-1"
                    : index === 2
                    ? "waiting ms-1" : index===3 ? "testing ms-1" : index===4?"publish ms-1"
                    : "done ms-1"
                } small-box ${snapshot.isDraggingOver ? "dragged-over" : ""} `}
              >
                <section className="drag_container">
                  <h4 className="text-center">
                    {col.statusName} ({statusCounts[col.id] || 0})
                  </h4>
                  <div
                    className="container responsive-scroll-container "
                                   >
                    <div className="drag_column">
                      <div className="drag_row">
                        {filteredData
                          ?.filter(
                            (ticket) => ticket.statusName === col.statusName
                          )
                          .map((ticket, index) => (
                            <Draggable
                              key={ticket.id}
                              draggableId={ticket.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className={`card card-task border border-3 shadow-sm ${
                                    snapshot.isDragging ? "" : ""
                                  }`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className="days w-100  text-center mb-0">
                                      <Link
                                        className="mx-1 icon-font text-white"
                                        to={`/app-request/update/${ticket.id}/${ticket.ticketNo}/${ticket.statusId}`}
                                      >
                                        {ticket.fullName.length > 11
                                          ? `${ticket.fullName.substring(
                                              0,
                                              11
                                            )}...`
                                          : ticket.fullName}
                                      </Link>
                                    </div>
                                  <div className="card_left w-100" style={{padding:"0px 6px"}}>
                                    
                                    <div
                                      className="time"
                                      style={{ textWrap: "nowrap" }}
                                    >
                                      Organization:{" "}
                                      {ticket.organisation.length > 12
                                        ? `${ticket.organisation.substring(
                                            0,
                                            12
                                          )}...`
                                        : ticket.organisation}
                                    </div>
                                    <div className="time d-flex justify-content-between">
                                      <span
                                        className="d-inline-block me-2"
                                        style={{
                                          fontSize: "10px",
                                        }}
                                      >
                                        Created On.
                                      </span>{" "}
                                      <span
                                        className="d-inline-block text-end"
                                        style={{
                                          fontSize: "83%",
                                        }}
                                      >
                                        {formatDate(ticket.createdDate)}
                                      </span>
                                    </div>
                                    <div className="status d-flex justify-content-between mb-0">
                                      <span className="d-inline-block">
                                        Ticket
                                      </span>{" "}
                                      <span className="d-inline-block">
                                        #{ticket.ticketNo}
                                      </span>
                                    </div>
                                  </div>
                                  <span
                                    className="mx-1 icon-font" style={{padding:"2px 0px"}}
                                    onClick={() => {
                                      handleShowOffcanvas();
                                      setSelectedTicket(ticket);
                                    }}
                                  >
                                    <i
                                      className="fas fa-edit"
                                      style={{ width: "25px", height: "23px" }}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </Droppable>
        ))}
      </div>

      {/* Offcanvas Component */}
      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement="end"
      >
        <Offcanvas.Header closeButton className="border-bottom pb-0">
          <Offcanvas.Title>
            <h2>{selectedTicket.fullName}</h2>
            <h5>TicketNo: {selectedTicket.ticketNo}</h5>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Checklist Section */}
          <h4 className="">Checklist</h4>
          <div className="checklist-container">
          {ticketData?.checkList?.slice().sort((a, b) => a.priority - b.priority).map((item, reversedIndex) => {
  const originalIndex = ticketData.checkList.length - 1 - reversedIndex; // Get the original index
  return (
    <div
      key={item.subStatusStatusId}
      className="checklist-item d-flex align-items-center my-2"
    >
      <input
        type="checkbox"
        className="form-check-input me-2"
        id={`checklist-${item.subStatusStatusId}`}
        checked={ticketData.checkList[originalIndex].isEnabled} // Use the original index for 'checked'
        onChange={(e) => handleChecklistChange(originalIndex, e.target.checked)} // Use original index for change handler
      />
      <label
        htmlFor={`checklist-${item.subStatusStatusId}`}
        className="form-check-label me-auto"
      >
        {item.subStatusName}
      </label>
    </div>
  );
})}
          </div>

          {/* Notes Section */}
          <h4>Notes!</h4>
          <textarea
            className="form-control form-control-solid"
            rows={4}
            onChange={(e) => setTicketData({...ticketData,notes:e.target.value})}
            value={ticketData.notes}
          ></textarea>
          <div className="mt-2 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              type="button"
              onClick={updateTicketNotes}
              disabled={notesLoading}
            >
              {notesLoading ? "Loading..." : "Save"}
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </DragDropContext>
  );
};

export default TaskList;
