// モジュールのインポート
const express = require('express');
// 呼び出し元で定義されたパラメータを有効にする
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
// モデルのインポート
const Campground = require('../models/campground');
const Review = require('../models/review');
// ミドルウェアのインポート
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');


// レビュー投稿
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータを取得
    const campground = await Campground.findById(req.params.id);
    // フォームで受け取った値で新しいインスタンス生成
    const review = new Review(req.body.review);
    review.author = req.user._id;
    // 配列属性にプッシュ
    campground.reviews.push(review);
    // それぞれ登録
    await review.save();
    await campground.save();
    // 登録成功時フラッシュ表示
    req.flash('success', 'レビューを登録しました');
    // 更新したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// レビュー削除
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    // パスパラメータから分割代入
    const { id, reviewId } = req.params;
    // 配列属性から条件に一致する要素を削除
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    // 登録成功時フラッシュ表示
    req.flash('success', 'レビューを削除しました');
    // 更新したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${id}`);
}));


// モジュールのエクスポート
module.exports = router;