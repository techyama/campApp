// モジュールのインポート
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
// 自動でindex.jsを見に行くため省略可
const { storage } = require('../cloudinary');
// ファイルアップロード先
const upload = multer({ storage });
// コントローラーのインポート
const campgrounds = require('../controllers/campgrounds');
// ミドルウェアのインポート
const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');


router.route('/')
    // 一覧取得ページ
    .get(catchAsync(campgrounds.index))
    // 新規登録
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
    .post(upload.single('image'), function (req, res, next) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
    })



// 新規登録ページ
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    // 詳細ページ
    .get(catchAsync(campgrounds.showCampground))
    // 編集
    .put(isLoggedIn, isCampAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    // 削除
    .delete(isLoggedIn, isCampAuthor, catchAsync(campgrounds.deleteCampground));



// 編集ページ
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(campgrounds.renderEditForm));


// モジュールのエクスポート
module.exports = router;