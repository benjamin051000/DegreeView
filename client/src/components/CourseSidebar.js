import React, { useState } from 'react';
import {
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react';

export default function CourseSidebar({ courseCode, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <>
    <button onClick={() => {setVisible(!visible)}}>Toggle sidebar</button>
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        direction='right'
        // inverted
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width='wide'
      >
        <Menu.Item>MAC2312</Menu.Item>
        <Menu.Item>Description: Lorem ipsum dolor</Menu.Item>
        
      </Sidebar>
      <Sidebar.Pusher dimmed={visible}>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
    </>
  );
}