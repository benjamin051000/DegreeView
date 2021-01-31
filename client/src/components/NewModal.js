import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

function NewModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      trigger={<Button style={{backgroundColor:"rgb(40, 87, 151)"}} className="ui blue button">New</Button>}
    >
      <Header icon>
        <Icon name='file outline' />
        <Header.Content>
          Create New Planner
          <Header.Subheader style={{color:"white"}}>Are you sure you want to restart?</Header.Subheader>
        </Header.Content>
      </Header>
      
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={() => setOpen(false)}>
          <Icon name='checkmark' /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default NewModal