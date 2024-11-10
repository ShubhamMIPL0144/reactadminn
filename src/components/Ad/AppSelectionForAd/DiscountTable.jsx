import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';



function OffCanvasEnd({discount, name, ...props }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="me-2">
        {name}
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Discounts</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <div className="card-content">
        <div className="table-responsive custom-scroll">
            <table
              id="demo-foo-addrow"
              className="table m-t-10 highlight contact-list"
              data-page-size="10"
            >
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                {
                  discount?.map(item=>
                    <tr key={item.id}>
                  <td>{`>${item.amount}`}</td>
                  <td>{`${item.discount}%`}</td>
                </tr>
                    )
                }
               
              </tbody>
            </table>
          </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}


const DiscountTable = ({discount}) => {
  return (
    <div className="">
        <OffCanvasEnd placement="end" name="Discounts"  discount={discount}/>
    </div>
  );
};



       
 

export default React.memo(DiscountTable);
