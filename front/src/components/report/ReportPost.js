import { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'

export default function ReportModal() {
  const [show, setShow] = useState(false)
  const [reason, setReason] = useState('')

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleReasonChange = (event) => {
    setReason(event.target.value)
  }

  const handleReportSubmit = (event) => {
    event.preventDefault()
    console.log(`Reported for ${reason}`)
    handleClose()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Want to report this Post?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReportSubmit}>
            <Form.Group controlId="reasonSelect">
              <Form.Label>Reason for reporting:</Form.Label>
              <Form.Select onChange={handleReasonChange}>
                <option>Choose a reason...</option>
                <option>Illegal content</option>
                <option>Sexually explicit content</option>
                <option>Violent or repulsive content</option>
                <option>Hateful or abusive content</option>
                <option>Spam or misleading</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}