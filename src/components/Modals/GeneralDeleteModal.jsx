
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function GeneralDeleteModal({deleteHandler,show,handleClose,idForDelete}) {
 
  return (

      <Modal show={show} onHide={handleClose} centered>
     
        <Modal.Body>Are you sure to delete this?</Modal.Body>
        <Modal.Footer>

          <Button variant="light" onClick={handleClose}>
          CANCEL
          </Button>
          <Button variant="primary" onClick={()=>deleteHandler(idForDelete)}>
          DELETE
          </Button>
        </Modal.Footer>
      </Modal>
 
  );
}

export default GeneralDeleteModal;