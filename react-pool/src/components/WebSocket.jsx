import React, { useEffect, useState } from 'react';
import './WebSocket.css';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://127.0.0.1:8080/ws/socket-server/');
    setSocket(newSocket);

    newSocket.addEventListener('open', () => {
      console.log('WebSocket connected!');
      setAlertMessage('WebSocket connected!');
      setAlertType('success');
    });

    newSocket.addEventListener('message', ({ data }) => {
      const parsedData = JSON.parse(data);
      setMessages(prevMessages => [...prevMessages, parsedData.message]);
    });

    newSocket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setAlertMessage('WebSocket connection error.');
      setAlertType('danger');
    });

    newSocket.addEventListener('close', () => {
      console.log('WebSocket closed.');
      setAlertMessage('WebSocket connection closed.');
      setAlertType('warning');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setAlertMessage('WebSocket connection not active.');
      setAlertType('danger');
      return;
    }

    socket.send(JSON.stringify({ message: inputMessage }));
    setAlertMessage('Message sent successfully!');
    setAlertType('success');
    setInputMessage('');
  };

  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className='Container1'>
      <div className='ContentContainer1 d-flex flex-column'>
        <h2>WebSocket Component</h2>
        {alertMessage && (
          <div className={`alert alert-${alertType}`} role="alert">
            {alertMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className='create-form'>
          <div className='form-group'>
            <label htmlFor='message'>Message:</label>
            <input
              type='text'
              id='message'
              name='message'
              value={inputMessage}
              onChange={handleChange}
              className='form-control'
              required
            />
          </div>
          <button type='submit' className='btn btn-primary'>Send</button>
        </form>
        <div className='message-container'>
          <h3>Received Messages:</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index} className='diggers'>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebSocketComponent;
