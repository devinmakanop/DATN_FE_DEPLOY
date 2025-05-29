import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { RobotOutlined , CloseOutlined, SendOutlined } from '@ant-design/icons';
import './ChatWidget.css';
import { ReactComponent as BotIcon } from './hubot-svgrepo-com.svg';

function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setVisible(!visible);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL_CLIENT}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });

      const data = await res.json();
      const botReply = data.answer || 'AI không có phản hồi.';
      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: '❌ Lỗi kết nối với AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-widget-container">
      {!visible && (
        <Button
          type="primary"
          size="large"
           icon={<BotIcon style={{ width: 24, height: 24 }} />}
          className="chat-toggle-button"
          onClick={toggleChat}
        />
      )}

      {visible && (
        <div className="chat-box">
          <div className="chat-header">
            <span>Trợ lý AI</span>
            <Button type="text" icon={<CloseOutlined />} onClick={toggleChat} />
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${msg.from === 'user' ? 'user' : 'bot'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <Input
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
