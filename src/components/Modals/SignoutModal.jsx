import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAuth } from "../../store/authSlice";

function SignoutModal({ show, handleClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout=()=>{
    dispatch(resetAuth())
    navigate('/login')
  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h4 className="text-muted" style={{ fontWeight: "400" }}>
          Ready to Leave?
          </h4>
        </Modal.Header>
        <Modal.Body>
        Select "Logout" below if you are ready to end your current session.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
          Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignoutModal;
