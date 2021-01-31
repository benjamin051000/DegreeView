import React from 'react'
import { Button, Header, Modal, Form} from 'semantic-ui-react'

function ExportModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button style={{backgroundColor:"rgb(40, 87, 151)"}} className="ui blue button">Export</Button>}
    >
      <Modal.Header>Export Planner</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Additional Information</Header>
          <p>
            If you want to add your name and UFID to your semester plan, you may do so here:
          </p>
          <Form>
            <Form.Input
                id='name'
                label='Name'
                placeholder='Name'
            />
            <Form.Input
                id='UFID'
                label='UFID'
                placeholder='UFID'
            />
          </Form>
          <p style={{marginTop:"15px"}}>These boxes may be left blank if desired</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          type='submit'
          content="Export to PDF"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ExportModal
