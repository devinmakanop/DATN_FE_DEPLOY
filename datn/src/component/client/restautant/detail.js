import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space,
  notification, Input, List, Modal
} from 'antd';
import axios from 'axios';
import './RestaurantDetail.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const zh = `zh-CN`

// Định nghĩa bản dịch cho các chuỗi UI
const translations = {
  en: {
    address: '📍 Address:',
    cuisine: '🍲 Cuisine:',
    description: '📝 Description:',
    noDescription: 'No description available',
    like: '👍 Like',
    dislike: '👎 Dislike',
    viewOnMap: '🗺️ View on map',
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
    failedLoad: 'Failed to load restaurant details',
    failedLike: 'Action failed',
    failedComment: 'Failed to send comment',
    notFound: 'Restaurant not found.',
  },
  vi: {
    address: '📍 Địa chỉ:',
    cuisine: '🍲 Ẩm thực:',
    description: '📝 Mô tả:',
    noDescription: 'Không có mô tả',
    like: '👍 Like',
    dislike: '👎 Dislike',
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
    failedLoad: 'Không tải được chi tiết nhà hàng',
    failedLike: 'Thao tác không thành công',
    failedComment: 'Lỗi gửi bình luận',
    notFound: 'Không tìm thấy nhà hàng.',
  },
  'zh-CN': {
    address: '📍 地址：',
    cuisine: '🍲 美食：',
    description: '📝 描述：',
    noDescription: '无描述',
    like: '👍 赞',
    dislike: '👎 踩',
    viewOnMap: '🗺️ 查看地图',
    customerComments: '💬 顾客评论',
    commentPlaceholder: '输入您的评论...',
    submitComment: '发送评论',
    noComments: '暂无评论。',
    loginRequiredTitle: '需要登录',
    loginRequiredLikeContent: '您需要登录以执行此操作。前往登录页面？',
    loginRequiredCommentContent: '您需要登录才能发表评论。前往登录页面？',
    loginText: '登录',
    cancelText: '取消',
    emptyCommentWarningTitle: '评论为空',
    emptyCommentWarningDesc: '请输入评论内容。',
    commentAdded: '已添加评论',
    failedLoad: '加载餐厅详情失败',
    failedLike: '操作失败',
    failedComment: '发送评论失败',
    notFound: '未找到餐厅。',
  },
   ko: {
    address: '📍 주소:',
    cuisine: '🍲 요리:',
    description: '📝 설명:',
    noDescription: '설명 없음',
    like: '👍 좋아요',
    dislike: '👎 싫어요',
    viewOnMap: '🗺️ 지도에서 보기',
    customerComments: '💬 고객 댓글',
    commentPlaceholder: '댓글을 입력하세요...',
    submitComment: '댓글 제출',
    noComments: '아직 댓글이 없습니다.',
    loginRequiredTitle: '로그인 필요',
    loginRequiredLikeContent: '이 작업을 수행하려면 로그인해야 합니다. 로그인 페이지로 이동하시겠습니까?',
    loginRequiredCommentContent: '댓글을 작성하려면 로그인해야 합니다. 로그인 페이지로 이동하시겠습니까?',
    loginText: '로그인',
    cancelText: '취소',
    emptyCommentWarningTitle: '빈 댓글',
    emptyCommentWarningDesc: '댓글 내용을 입력하세요.',
    commentAdded: '댓글이 추가되었습니다',
    failedLoad: '식당 정보를 불러오지 못했습니다',
    failedLike: '작업 실패',
    failedComment: '댓글 작성 실패',
    notFound: '식당을 찾을 수 없습니다.',
  },
};

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Lấy ngôn ngữ hiện tại, mặc định là 'en'
  const lng = localStorage.getItem('lng') || 'en';
  const t = translations[lng] || translations.en;

  // Lấy chi tiết nhà hàng
  const fetchRestaurant = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurants/${id}?lng=${lng}`);
      setRestaurant(res.data);
    } catch (error) {
      notification.error({
        message: t.failedLoad,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý like / dislike
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
      await axios.post(`http://localhost:5000/api/likes/restaurant/${id}?action=${action}`);
      await fetchRestaurant();
    } catch (err) {
      notification.error({
        message: t.failedLike,
        description: err.message,
      });
    } finally {
      setLikeLoading(false);
    }
  };

  // Thêm bình luận
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
      await axios.post(`http://localhost:5000/api/comments/restaurant/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchRestaurant();
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
    fetchRestaurant();
  }, [id]);

  if (loading) return <Spin className="loading-center" size="large" />;

  if (!restaurant) return <p className="text-center">{t.notFound}</p>;

  return (
    <div className="restaurant-detail-container">
      <Card bordered={false}>
        <div className="restaurant-header">
          {restaurant.imageUrl && (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="restaurant-image"
              style={{ height: 280, objectFit: 'cover', width: '100%' }}
            />
          )}

          <div className="restaurant-info">
            <Title level={2}>{restaurant.name}</Title>
            <Paragraph><strong>{t.address}</strong> {restaurant.address}</Paragraph>
            <Paragraph><strong>{t.cuisine}</strong> {restaurant.cuisine}</Paragraph>
            <Paragraph><strong>{t.description}</strong> {restaurant.description || t.noDescription}</Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button onClick={() => handleLikeAction('like')} loading={likeLoading}>
                {t.like} ({restaurant.likeCount ?? 0})
              </Button>
              <Button onClick={() => handleLikeAction('dislike')} loading={likeLoading} danger>
                {t.dislike} ({restaurant.dislikeCount ?? 0})
              </Button>
            </Space>

            {restaurant.coordinates?.lat && restaurant.coordinates?.lng && (
              <div className="mt-2">
                <Button
                  type="link"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`,
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
          dataSource={restaurant.comments || []}
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

export default RestaurantDetail;
