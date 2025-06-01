import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space,
  notification, Input, List, Modal
} from 'antd';
import axios from 'axios';
import './LocationDetail.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// Định nghĩa các bản dịch chuỗi giao diện
const translations = {
  en: {
    address: '📍 Address:',
    type: '📌 Type:',
    description: '📝 Description:',
    noDescription: 'No description available',
    like: '👍 Like',
    dislike: '👎 Dislike',
    viewOnMap: '🗺️ View on map',
    customerComments: '💬 Visitor Comments',
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
    failedLoad: 'Failed to load location details',
    failedLike: 'Action failed',
    failedComment: 'Failed to send comment',
    notFound: 'Location not found.',
  },
  vi: {
    address: '📍 Địa chỉ:',
    type: '📌 Loại:',
    description: '📝 Mô tả:',
    noDescription: 'Không có mô tả',
    like: '👍 Thích',
    dislike: '👎 Không thích',
    viewOnMap: '🗺️ Xem trên bản đồ',
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
    failedLoad: 'Không tải được chi tiết địa điểm',
    failedLike: 'Thao tác không thành công',
    failedComment: 'Lỗi gửi bình luận',
    notFound: 'Không tìm thấy địa điểm.',
  },
  'zh-CN': {
    address: '📍 地址：',
    type: '📌 类型：',
    description: '📝 描述：',
    noDescription: '暂无描述',
    like: '👍 喜欢',
    dislike: '👎 不喜欢',
    viewOnMap: '🗺️ 查看地图',
    customerComments: '💬 游客评论',
    commentPlaceholder: '输入您的评论...',
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
    failedLoad: '加载地点详情失败',
    failedLike: '操作失败',
    failedComment: '发送评论失败',
    notFound: '未找到地点。',
  },
  ko: {
    address: '📍 주소:',
    type: '📌 유형:',
    description: '📝 설명:',
    noDescription: '설명 없음',
    like: '👍 좋아요',
    dislike: '👎 싫어요',
    viewOnMap: '🗺️ 지도 보기',
    customerComments: '💬 방문자 댓글',
    commentPlaceholder: '댓글을 입력하세요...',
    submitComment: '댓글 제출',
    noComments: '댓글이 없습니다.',
    loginRequiredTitle: '로그인 필요',
    loginRequiredLikeContent: '이 작업을 수행하려면 로그인해야 합니다. 로그인 페이지로 이동할까요?',
    loginRequiredCommentContent: '댓글을 작성하려면 로그인해야 합니다. 로그인 페이지로 이동할까요?',
    loginText: '로그인',
    cancelText: '취소',
    emptyCommentWarningTitle: '빈 댓글',
    emptyCommentWarningDesc: '댓글 내용을 입력해주세요.',
    commentAdded: '댓글이 추가되었습니다',
    failedLoad: '장소 세부정보를 불러오지 못했습니다',
    failedLike: '작업 실패',
    failedComment: '댓글 전송 실패',
    notFound: '장소를 찾을 수 없습니다.',
  },
};

function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const lng = localStorage.getItem('lng') || 'en';
  const t = translations[lng] || translations.en;

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/locations/${id}?lng=${lng}`);
      setLocation(res.data);
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
      });
      return;
    }

    setLikeLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/likes/location/${id}?action=${action}`);
      await fetchLocation();
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
      await axios.post(`http://localhost:5000/api/comments/location/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchLocation();
      notification.success({ message: t.commentAdded });
    } catch (err) {
      notification.error({
        message: t.failedComment,
        description: err.message,
      });
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [id]);

  if (loading) return <Spin className="loading-center" size="large" />;
  if (!location) return <p className="text-center">{t.notFound}</p>;

  return (
    <div className="location-detail-container">
      <Card bordered={false}>
        <div className="location-header">
          {location.imageUrl && (
            <img
              src={location.imageUrl}
              alt={location.name}
              className="location-image"
              style={{ height: 280, objectFit: 'cover', width: '100%' }}
            />
          )}

          <div className="location-info">
            <Title level={2}>{location.name}</Title>
            <Paragraph><strong>{t.address}</strong> {location.address}</Paragraph>
            <Paragraph><strong>{t.type}</strong> {location.type}</Paragraph>
            <Paragraph><strong>{t.description}</strong> {location.description || t.noDescription}</Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button onClick={() => handleLikeAction('like')} loading={likeLoading}>
                {t.like} ({location.likeCount ?? 0})
              </Button>
              <Button onClick={() => handleLikeAction('dislike')} loading={likeLoading} danger>
                {t.dislike} ({location.dislikeCount ?? 0})
              </Button>
            </Space>

            {location.coordinates?.lat && location.coordinates?.lng && (
              <div className="mt-2">
                <Button
                  type="link"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`,
                      '_blank'
                    )
                  }
                >
                  {t.viewOnMap}
                </Button>
              </div>
            )}
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
          dataSource={location.comments || []}
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

export default LocationDetail;
