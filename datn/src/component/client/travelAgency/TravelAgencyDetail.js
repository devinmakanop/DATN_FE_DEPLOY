import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space,
  notification, Input, List, Modal,
} from 'antd';
import axiosToken from '../../context/axiosToken';
import './TravelAgencyDetail.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const translations = {
  en: {
    address: '🏢 Address:',
    phone: '📞 Phone:',
    email: '✉️ Email:',
    description: '📝 Description:',
    noDescription: 'No description available',
    like: '👍 Like',
    dislike: '👎 Dislike',
    customerComments: '💬 Customer Comments',
    commentPlaceholder: 'Enter your comment...',
    submitComment: 'Submit Comment',
    noComments: 'No comments yet.',
    loginRequiredTitle: 'Login Required',
    loginRequiredLikeContent: 'You need to log in to perform this action. Go to login page?',
    loginRequiredCommentContent: 'You need to log in to comment. Go to login page?',
    loginText: 'Login',
    cancelText: 'Cancel',
    emptyCommentWarningTitle: 'Empty Comment',
    emptyCommentWarningDesc: 'Please enter comment content.',
    commentAdded: 'Comment added',
    failedLoad: 'Failed to load travel agency details',
    failedLike: 'Action failed',
    failedComment: 'Failed to send comment',
    notFound: 'Travel agency not found.',
    back: 'Back',
    backWithArrow: '← Back',
  },
  vi: {
    address: '🏢 Địa chỉ:',
    phone: '📞 Điện thoại:',
    email: '✉️ Email:',
    description: '📝 Mô tả:',
    noDescription: 'Không có mô tả',
    like: '👍 Like',
    dislike: '👎 Dislike',
    customerComments: '💬 Bình luận của khách',
    commentPlaceholder: 'Nhập bình luận của bạn...',
    submitComment: 'Gửi bình luận',
    noComments: 'Chưa có bình luận nào.',
    loginRequiredTitle: 'Yêu cầu đăng nhập',
    loginRequiredLikeContent: 'Bạn cần đăng nhập để thực hiện thao tác này. Chuyển đến trang đăng nhập?',
    loginRequiredCommentContent: 'Bạn cần đăng nhập để bình luận. Chuyển đến trang đăng nhập?',
    loginText: 'Đăng nhập',
    cancelText: 'Hủy',
    emptyCommentWarningTitle: 'Bình luận trống',
    emptyCommentWarningDesc: 'Vui lòng nhập nội dung bình luận.',
    commentAdded: 'Đã thêm bình luận',
    failedLoad: 'Không tải được chi tiết công ty du lịch',
    failedLike: 'Thao tác không thành công',
    failedComment: 'Lỗi gửi bình luận',
    notFound: 'Không tìm thấy công ty du lịch.',
    back: 'Quay lại',
    backWithArrow: '← Quay lại',
  },
  ko: {
    address: '🏢 住所：',
    phone: '📞 電話番号：',
    email: '✉️ メール：',
    description: '📝 説明：',
    noDescription: '説明はありません',
    like: '👍 いいね',
    dislike: '👎 よくない',
    customerComments: '💬 お客様のコメント',
    commentPlaceholder: 'コメントを入力してください...',
    submitComment: 'コメントを送信',
    noComments: 'まだコメントはありません。',
    loginRequiredTitle: 'ログインが必要です',
    loginRequiredLikeContent: 'この操作を行うにはログインが必要です。ログインページに移動しますか？',
    loginRequiredCommentContent: 'コメントするにはログインが必要です。ログインページに移動しますか？',
    loginText: 'ログイン',
    cancelText: 'キャンセル',
    emptyCommentWarningTitle: 'コメントが空です',
    emptyCommentWarningDesc: 'コメント内容を入力してください。',
    commentAdded: 'コメントが追加されました',
    failedLoad: '旅行代理店の詳細を読み込めませんでした',
    failedLike: '操作に失敗しました',
    failedComment: 'コメントの送信に失敗しました',
    notFound: '旅行代理店が見つかりません。',
    back: '戻る',
    backWithArrow: '← 戻る',
  },
  'zh-CN': {
    address: '🏢 地址：',
    phone: '📞 电话：',
    email: '✉️ 邮箱：',
    description: '📝 说明：',
    noDescription: '暂无说明',
    like: '👍 点赞',
    dislike: '👎 踩',
    customerComments: '💬 用户评论',
    commentPlaceholder: '请输入您的评论...',
    submitComment: '提交评论',
    noComments: '暂无评论。',
    loginRequiredTitle: '需要登录',
    loginRequiredLikeContent: '您需要登录才能执行此操作。前往登录页面？',
    loginRequiredCommentContent: '您需要登录才能发表评论。前往登录页面？',
    loginText: '登录',
    cancelText: '取消',
    emptyCommentWarningTitle: '评论为空',
    emptyCommentWarningDesc: '请输入评论内容。',
    commentAdded: '评论已添加',
    failedLoad: '加载旅行社详情失败',
    failedLike: '操作失败',
    failedComment: '发送评论失败',
    notFound: '未找到旅行社。',
    back: '返回',
    backWithArrow: '← 返回',
  },
};

function TravelAgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL_CLIENT;

  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Lấy ngôn ngữ hiện tại
  const lng = localStorage.getItem('lng') || 'vi';
  const t = translations[lng] || translations.vi;

  const fetchAgencyDetail = async () => {
    setLoading(true);
    try {
      const res = await axiosToken.get(`${API_BASE_URL}/travelAgency/${id}?lng=${lng}`);
      setAgency(res.data);
    } catch (error) {
      notification.error({
        message: t.failedLoad,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLikeAction = async (action) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      Modal.confirm({
        title: t.loginRequiredTitle,
        content: t.loginRequiredLikeContent,
        okText: t.loginText,
        cancelText: t.cancelText,
        onOk: () => navigate('/login'),
        zIndex: 99999,
      });
      return;
    }

    setLikeLoading(true);
    try {
      await axiosToken.post(`${API_BASE_URL}/likes/travelAgency/${id}?action=${action}`);
      await fetchAgencyDetail();
    } catch (err) {
      notification.error({
        message: t.failedLike,
        description: err.message,
      });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    const user = JSON.parse(localStorage.getItem('user'))?.fullName;

    if (!user) {
      Modal.confirm({
        title: t.loginRequiredTitle,
        content: t.loginRequiredCommentContent,
        okText: t.loginText,
        cancelText: t.cancelText,
        onOk: () => navigate('/login'),
        zIndex: 99999,
      });
      return;
    }

    if (!comment.trim()) {
      return notification.warning({
        message: t.emptyCommentWarningTitle,
        description: t.emptyCommentWarningDesc,
      });
    }

    setCommentLoading(true);
    try {
      await axiosToken.post(`${API_BASE_URL}/comments/travelAgency/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchAgencyDetail();
      notification.success({ message: t.commentAdded });
    } catch (error) {
      notification.error({
        message: t.failedComment,
        description: error.message,
      });
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyDetail();
  }, [id, lng]);

  if (loading) return <Spin className="loading-center" size="large" />;

  if (!agency)
    return (
      <div className="text-center">
        <Title level={3}>{t.notFound}</Title>
        <Button onClick={() => navigate(-1)}>{t.back}</Button>
      </div>
    );

  return (
    <div className="travel-agency-detail-container">
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        {t.backWithArrow}
      </Button>

      <Card bordered={false}>
        <div className="travel-agency-header" style={{ display: 'flex', gap: 20 }}>
          {agency.imageUrl && (
            <img
              src={agency.imageUrl}
              alt={agency.name}
              style={{ width: 280, height: 180, objectFit: 'cover', borderRadius: 6 }}
            />
          )}

          <div style={{ flex: 1 }}>
            <Title level={2}>{agency.name}</Title>
            <Paragraph><Text strong>{t.address}</Text> {agency.address}</Paragraph>
            <Paragraph><Text strong>{t.phone}</Text> {agency.phone}</Paragraph>
            <Paragraph><Text strong>{t.email}</Text> {agency.email}</Paragraph>
            <Paragraph>
              <Text strong>{t.description}</Text> {agency.description || t.noDescription}
            </Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button onClick={() => handleLikeAction('like')} loading={likeLoading}>
                {t.like} ({agency.likeCount ?? 0})
              </Button>
              <Button onClick={() => handleLikeAction('dislike')} loading={likeLoading} danger>
                {t.dislike} ({agency.dislikeCount ?? 0})
              </Button>
            </Space>
          </div>
        </div>

        <Divider />

        <Title level={4}>{t.customerComments}</Title>

        <TextArea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t.commentPlaceholder}
          maxLength={300}
          showCount
        />

        <div style={{ textAlign: 'right', marginTop: 25 }}>
          <Button
            type="primary"
            onClick={handleAddComment}
            loading={commentLoading}
          >
            {t.submitComment}
          </Button>
        </div>

        <List
          style={{ marginTop: 24 }}
          dataSource={agency.comments || []}
          locale={{ emptyText: t.noComments }}
          itemLayout="horizontal"
          renderItem={(cmt, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.user)}`}
                    alt="avatar"
                    style={{ borderRadius: '50%' }}
                    width={40}
                  />
                }
                title={<strong>{cmt.user}</strong>}
                description={cmt.comment}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default TravelAgencyDetail;
