
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteModal({deleteAdHandler,show,handleClose,adId}) {
 
  return (

      <Modal show={show} onHide={handleClose} centered>
     
        <Modal.Body>Are you sure to delete this ad?</Modal.Body>
        <Modal.Footer>

          <Button variant="light" onClick={handleClose}>
          CANCEL
          </Button>
          <Button variant="primary" onClick={()=>deleteAdHandler(adId)}>
          DELETE
          </Button>
        </Modal.Footer>
      </Modal>
 
  );
}

export default DeleteModal;