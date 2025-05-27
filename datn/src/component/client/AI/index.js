import React, { useState } from 'react';
import { Card, Input, Button, Typography, notification, List, Avatar } from 'antd';
import axios from 'axios';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

function AIAnswer({
  placeholder = 'Hỏi AI bất kỳ điều gì...',
  title = '🤖 Hỏi AI'
}) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const currentQuestion = question.trim();
    setLoading(true);
    setQuestion('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        question: currentQuestion,
      });

      console.log(res)

      const aiAnswer = res.data.answer;

      // Cập nhật lịch sử đoạn hội thoại
      setChatHistory(prev => [
        ...prev,
        { type: 'user', content: currentQuestion },
        { type: 'ai', content: aiAnswer },
      ]);
    } catch (err) {
      notification.error({
        message: 'Lỗi phản hồi AI',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <Title level={4}>{title}</Title>

      <TextArea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder}
      />
      <Button
        type="primary"
        style={{ marginTop: 10 }}
        loading={loading}
        onClick={handleAsk}
      >
        Gửi câu hỏi
      </Button>

      <Card style={{ marginTop: 24, maxHeight: 400, overflowY: 'auto' }}>
        <List
          dataSource={chatHistory}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  item.type === 'user' ? (
                    <Avatar icon={<UserOutlined />} />
                  ) : (
                    <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  )
                }
                title={item.type === 'user' ? 'Bạn' : 'AI'}
                description={<Paragraph style={{ whiteSpace: 'pre-line' }}>{item.content}</Paragraph>}
              />
            </List.Item>
          )}
          locale={{ emptyText: 'Chưa có câu hỏi nào.' }}
        />
      </Card>
    </div>
  );
}

export default AIAnswer;
