import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './WebSocket.css';
import GlobalFooter from './GlobalFooter';
import GlobalHeader from './GlobalHeader';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  const generateRandomNumber = () => {
    return Math.floor(100 + Math.random() * 900);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/get-username/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        const randomNum = generateRandomNumber();
        setUsername(`anon${randomNum}`);
      }
    };

    fetchUsername();
  }, []);

  const messageAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messageAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectWebSocket = () => {
    const newSocket = new WebSocket('ws://127.0.0.1:8080/ws/socket-server/');
    setSocket(newSocket);

    newSocket.addEventListener('open', () => {
      console.log('WebSocket connected!');
      setAlertMessage('WebSocket connected!');
      setAlertType('success');
      setConnected(true);
    });

    newSocket.addEventListener('message', ({ data }) => {
      const parsedData = JSON.parse(data);
      const timestamp = new Date().toLocaleTimeString();
      setMessages(prevMessages => [...prevMessages, { ...parsedData, timestamp }]);
    });

    newSocket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setAlertMessage('WebSocket connection error.');
      setAlertType('danger');
    });

    newSocket.addEventListener('close', () => {
      console.log('WebSocket closed.');
      setAlertMessage('WebSocket connection closed. Reconnecting...');
      setAlertType('warning');
      setConnected(false);
      setTimeout(connectWebSocket, 3000);
    });

    return newSocket;
  };

  const handleClickConnect = () => {
    connectWebSocket();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      setAlertMessage('WebSocket connection not active.');
      setAlertType('danger');
      return;
    }

    if (!username) {
      setAlertMessage('Username is not available.');
      setAlertType('danger');
      return;
    }

    socket.send(JSON.stringify({ username, message: inputMessage }));
    setAlertMessage('Message sent successfully!');
    setAlertType('success');
    setInputMessage('');
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    setInputMessage(e.target.value);
  };

  return (
    <div>
      <GlobalHeader />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body message-area">
                {messages.map((msg, index) => {
                  const isCurrentUser = msg.username === username;
                  const messageClass = isCurrentUser ? 'message-right' : 'message-left';
                  return (
                    <div key={index} className="message-container">
                      <div className={`message mb-3 p-2 ${messageClass}`}>
                        <div className="message-header">
                          <span className="username">{msg.username}</span>
                          <span className="timestamp">{msg.timestamp}</span>
                        </div>
                        <div className="message-text">{msg.message}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageAreaRef}></div>
              </div>
              <div className="card-footer">
                {!connected ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-primary btn-lg btn-block" onClick={handleClickConnect}>
                      Connect
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        placeholder="Enter your message..."
                        value={inputMessage}
                        onChange={handleChange}
                        required
                      />
                      <div className="input-group-append">
                        <button type="submit" className="btn btn-primary">Send</button>
                      </div>
                    </div>
                  </form>
                )}
                {alertMessage && (
                  <div className={`alert alert-${alertType} fixed-top-center`} role="alert">
                    {alertMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default WebSocketComponent;
