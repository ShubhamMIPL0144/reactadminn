import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function SeeBlockModal({ showView, handleCloseView }) {
  return (
    <>
      <Modal show={showView} onHide={handleCloseView}>
        <Modal.Header closeButton>
          <h4 className="text-muted" style={{ fontWeight: "400" }}>
            Block app
          </h4>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="example-textarea" className="form-label">
            Remark / Comment
          </label>
         <p>Lorem ipsum dolor sit amet.</p>
        </Modal.Body>
        <Modal.Footer>
        
          <Button variant="secondary" onClick={handleCloseView}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SeeBlockModal;
