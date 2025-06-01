import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Spin, Divider, Button, Typography, Space,
  notification, Input, List, Modal, Select
} from 'antd';
import axios from 'axios';
import './AccommodationDetail.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const translations = {
  en: {
    back: '← Back',
    loadingError: 'Cannot load accommodation data',
    notFound: 'Accommodation not found.',
    address: 'Address',
    phone: 'Phone',
    description: 'Description',
    noDescription: 'No description available',
    like: 'Like',
    dislike: 'Dislike',
    commentsTitle: 'Guest Comments',
    commentPlaceholder: 'Enter your comment...',
    sendComment: 'Send Comment',
    emptyCommentWarning: 'Empty comment',
    emptyCommentDescription: 'Please enter comment content.',
    loginRequiredTitle: 'Login Required',
    loginRequiredContentLike: 'You need to log in to perform this action. Go to login page?',
    loginRequiredContentComment: 'You need to log in to comment. Go to login page?',
    loginButton: 'Login',
    cancelButton: 'Cancel',
    addCommentSuccess: 'Comment added successfully',
    actionFail: 'Action failed',
    sendCommentFail: 'Failed to send comment',
    noComments: 'No comments yet.',
  },
  ko: {
    back: '← 뒤로가기',
    loadingError: '숙소 데이터를 불러올 수 없습니다',
    notFound: '숙소를 찾을 수 없습니다.',
    address: '주소',
    phone: '전화번호',
    description: '설명',
    noDescription: '설명이 없습니다',
    like: '좋아요',
    dislike: '싫어요',
    commentsTitle: '손님 댓글',
    commentPlaceholder: '댓글을 입력하세요...',
    sendComment: '댓글 보내기',
    emptyCommentWarning: '빈 댓글',
    emptyCommentDescription: '댓글 내용을 입력해주세요.',
    loginRequiredTitle: '로그인 필요',
    loginRequiredContentLike: '이 작업을 수행하려면 로그인해야 합니다. 로그인 페이지로 이동하시겠습니까?',
    loginRequiredContentComment: '댓글을 작성하려면 로그인해야 합니다. 로그인 페이지로 이동하시겠습니까?',
    loginButton: '로그인',
    cancelButton: '취소',
    addCommentSuccess: '댓글이 성공적으로 추가되었습니다',
    actionFail: '작업 실패',
    sendCommentFail: '댓글 전송 실패',
    noComments: '아직 댓글이 없습니다.',
  },
  'zh-CN': {
    back: '← 返回',
    loadingError: '无法加载住宿数据',
    notFound: '未找到住宿。',
    address: '地址',
    phone: '电话',
    description: '描述',
    noDescription: '暂无描述',
    like: '点赞',
    dislike: '踩',
    commentsTitle: '客人评论',
    commentPlaceholder: '请输入您的评论...',
    sendComment: '发送评论',
    emptyCommentWarning: '评论为空',
    emptyCommentDescription: '请输入评论内容。',
    loginRequiredTitle: '需要登录',
    loginRequiredContentLike: '您需要登录才能执行此操作。前往登录页面？',
    loginRequiredContentComment: '您需要登录才能发表评论。前往登录页面？',
    loginButton: '登录',
    cancelButton: '取消',
    addCommentSuccess: '评论添加成功',
    actionFail: '操作失败',
    sendCommentFail: '发送评论失败',
    noComments: '暂无评论。',
  },
  vi: {
    back: '← Quay lại',
    loadingError: 'Không thể tải dữ liệu khách sạn',
    notFound: 'Không tìm thấy khách sạn.',
    address: 'Địa chỉ',
    phone: 'Điện thoại',
    description: 'Mô tả',
    noDescription: 'Không có mô tả',
    like: 'Like',
    dislike: 'Dislike',
    commentsTitle: 'Bình luận của khách',
    commentPlaceholder: 'Nhập bình luận của bạn...',
    sendComment: 'Gửi bình luận',
    emptyCommentWarning: 'Bình luận trống',
    emptyCommentDescription: 'Vui lòng nhập nội dung bình luận.',
    loginRequiredTitle: 'Yêu cầu đăng nhập',
    loginRequiredContentLike: 'Bạn cần đăng nhập để thực hiện thao tác này. Chuyển đến trang đăng nhập?',
    loginRequiredContentComment: 'Bạn cần đăng nhập để bình luận. Chuyển đến trang đăng nhập?',
    loginButton: 'Đăng nhập',
    cancelButton: 'Hủy',
    addCommentSuccess: 'Đã thêm bình luận',
    actionFail: 'Thao tác không thành công',
    sendCommentFail: 'Lỗi gửi bình luận',
    noComments: 'Chưa có bình luận nào.',
  }
};

function AccommodationDetail() {
  // Lấy lang từ localStorage hoặc default 'vi'
  const [lang, setLang] = useState(localStorage.getItem('lng') || 'vi');
  const t = translations[lang];

  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Khi đổi lang, lưu localStorage và reload data
  const handleChangeLang = (value) => {
    localStorage.setItem('lng', value);
    setLang(value);
  };

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/accommodations/${id}?lng=${lang}`);
      setHotel(res.data);
    } catch (error) {
      notification.error({
        message: t.loadingError,
        description: error.message,
      });
      setHotel(null);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (!hotel?.images) return;
    setCarouselIndex((prev) => (prev + 1 >= hotel.images.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!hotel?.images) return;
    setCarouselIndex((prev) => (prev - 1 < 0 ? hotel.images.length - 1 : prev - 1));
  };

  const handleLikeAction = async (action) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      Modal.confirm({
        title: t.loginRequiredTitle,
        content: t.loginRequiredContentLike,
        okText: t.loginButton,
        cancelText: t.cancelButton,
        onOk: () => navigate('/login'),
        zIndex: 99999,
      });
      return;
    }
    setLikeLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/likes/accommodation/${id}?action=${action}`);
      await fetchHotel();
    } catch (error) {
      notification.error({
        message: t.actionFail,
        description: error.message,
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
        content: t.loginRequiredContentComment,
        okText: t.loginButton,
        cancelText: t.cancelButton,
        onOk: () => navigate('/login'),
        zIndex: 99999,
      });
      return;
    }
    if (!comment.trim()) {
      return notification.warning({
        message: t.emptyCommentWarning,
        description: t.emptyCommentDescription,
      });
    }
    setCommentLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/comments/accommodation/${id}`, {
        user,
        comment,
      });
      setComment('');
      await fetchHotel();
      notification.success({ message: t.addCommentSuccess });
    } catch (error) {
      notification.error({
        message: t.sendCommentFail,
        description: error.message,
      });
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
    setCarouselIndex(0); // reset slide khi id hoặc lang thay đổi
  }, [id, lang]);

  if (loading) {
    return <Spin className="loading-center" size="large" />;
  }

  if (!hotel) {
    return <Paragraph style={{ textAlign: 'center', marginTop: 50 }}>{t.notFound}</Paragraph>;
  }

  const currentImage = hotel.images && hotel.images.length > 0
    ? hotel.images[carouselIndex]
    : null;

  return (
    <div className="accommodation-detail-container" style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Button type="primary" onClick={() => navigate(-1)}>
          {t.back}
        </Button>

        {/* Select đổi ngôn ngữ */}
        <Select value={lang} onChange={handleChangeLang} style={{ width: 120 }}>
          <Option value="vi">Tiếng Việt</Option>
          <Option value="en">English</Option>
          <Option value="ko">한국어</Option>
          <Option value="zh">中文</Option>
        </Select>
      </Space>

      <Card bordered={false}>
        <div
          className="accommodation-top-section"
          style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
        >
          {currentImage && (
            <div
              className="accommodation-carousel-wrapper"
              style={{
                flex: '1 1 40%',
                maxWidth: '40%',
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={currentImage}
                alt={`Image ${carouselIndex + 1}`}
                style={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Button
                size="small"
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 8,
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  borderRadius: '50%',
                  opacity: 0.7,
                }}
              >
                ‹
              </Button>
              <Button
                size="small"
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  borderRadius: '50%',
                  opacity: 0.7,
                }}
              >
                ›
              </Button>
            </div>
          )}
          <div style={{ flex: '1 1 60%' }}>
            <Title level={3}>{hotel.name}</Title>
            <Paragraph>
              <Text strong>{t.address}: </Text>
              {hotel.address}
            </Paragraph>
            <Paragraph>
              <Text strong>{t.phone}: </Text>
              {hotel.phone || '-'}
            </Paragraph>
            <Paragraph>
              <Text strong>{t.description}: </Text>
              {hotel.description || t.noDescription}
            </Paragraph>

            <Space style={{ marginTop: 12 }}>
              <Button
                loading={likeLoading}
                type="primary"
                onClick={() => handleLikeAction('like')}
              >
                {t.like} ({hotel.likes || 0})
              </Button>
              <Button
                loading={likeLoading}
                danger
                onClick={() => handleLikeAction('dislike')}
              >
                {t.dislike} ({hotel.dislikes || 0})
              </Button>
            </Space>
          </div>
        </div>

        <Divider />

        <Title level={4}>{t.commentsTitle}</Title>
        <List
          locale={{ emptyText: t.noComments }}
          dataSource={hotel.comments || []}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{item.user}</Text>}
                description={item.comment}
              />
            </List.Item>
          )}
        />
        <TextArea
          rows={3}
          placeholder={t.commentPlaceholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          style={{ marginTop: 12 }}
        />
        <Button
          type="primary"
          onClick={handleAddComment}
          loading={commentLoading}
          style={{ marginTop: 8 }}
        >
          {t.sendComment}
        </Button>
      </Card>
    </div>
  );
}

export default AccommodationDetail;
