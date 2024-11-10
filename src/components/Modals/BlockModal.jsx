import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function BlockModal({ show, handleClose }) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h4 className="text-muted" style={{ fontWeight: "400" }}>
            Block app
          </h4>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="example-textarea" className="form-label">
            Remark / Comment
          </label>
          <textarea
            className="form-control"
            id="example-textarea"
            rows="4"
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BlockModal;
