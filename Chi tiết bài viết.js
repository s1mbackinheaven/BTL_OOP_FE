// Hàm lấy tham số từ URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Hàm để lấy tên người dùng từ token
function getUsernameFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwt_decode(token);  // Giải mã token
            return decoded.sub || 'Ẩn danh';  // Lấy tên người dùng hoặc 'Người dùng' nếu không có
        } catch (error) {
            console.error('Lỗi giải mã token:', error);
            return 'Người dùng';
        }
    }
    return 'Người dùng';
}

// Hàm để tải bình luận từ API
function loadComments() {
    const articleId = getUrlParameter('id');  // Lấy id từ URL

    if (!articleId) {
        alert("Không tìm thấy bài viết!");
        return;
    }

    fetch(`http://localhost:8080/api/comments/get_all_comment_by_articleId/${articleId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Thêm token nếu cần
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayComments(data);  // Hiển thị danh sách bình luận
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Không thể tải bình luận.");
    });
}

// Hàm hiển thị bình luận
function displayComments(comments) {
    const commentsSection = document.getElementById('comments-section');
    commentsSection.innerHTML = '';  // Xóa danh sách cũ

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        
        // Định dạng ngày và tên người dùng
        const formattedDate = formatDate(comment.createdAt);
        const username = getUsernameFromToken();  // Lấy tên người dùng từ token

        commentElement.innerHTML = `
            <div class="comment-header">
                <img src="Image/user.png" alt="Avatar" class="avatar">
                <span class="name">${username}</span>
                <span class="date">${formattedDate}</span>
            </div>
            <div class="comment-text">
                ${comment.content}
            </div>
        `;

        commentsSection.appendChild(commentElement);
    });
}

// Hàm định dạng ngày
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
}

// Hàm đăng bình luận mới
function postComment() {
    const articleId = getUrlParameter('id');
    const commentContent = document.querySelector('.input-comment').value;

    if (!commentContent) {
        alert("Vui lòng nhập nội dung bình luận!");
        return;
    }

    if (!articleId) {
        alert("Không tìm thấy bài viết!");
        return;
    }

    const newComment = {
        content: commentContent,
        author: getUsernameFromToken(),  // Lấy tên người dùng từ token
        createdAt: new Date().toISOString()
    };

    fetch(`http://localhost:8080/api/comments/${articleId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    })
    .then(response => response.json())
    .then(data => {
        alert("Bình luận đã được gửi!");
        loadComments();  // Tải lại bình luận sau khi đăng thành công
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Không thể gửi bình luận.");
    });
}

// Hàm để tải chi tiết bài viết từ API
function loadArticleDetail() {
    const articleId = getUrlParameter('id');  // Lấy id từ URL

    if (!articleId) {
        alert("Không tìm thấy bài viết!");
        return;
    }

    fetch(`http://localhost:8080/api/articles/get_article_by_id/${articleId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayArticleDetail(data);  // Hiển thị chi tiết bài viết
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Không thể tải bài viết.");
    });
}

// Hàm hiển thị chi tiết bài viết
function displayArticleDetail(article) {
    const titleElement = document.querySelector('.article-item h2');
    const authorElement = document.querySelector('.article-item .author');
    const dateElement = document.querySelector('.article-item .date');
    const contentElement = document.querySelector('.article-list .content');

    titleElement.textContent = article.title;
    authorElement.textContent = `Tác giả: ${article.author}`;
    dateElement.textContent = `Ngày đăng: ${formatDate(article.createdAt)}`;
    contentElement.textContent = article.content;
}

// Đảm bảo các sự kiện chạy sau khi tài liệu đã tải xong
document.addEventListener('DOMContentLoaded', function () {
    loadArticleDetail();  // Tải chi tiết bài viết
    loadComments();  // Tải danh sách bình luận
    document.querySelector('.post-comment').addEventListener('click', postComment);  // Gửi bình luận mới khi nhấn nút
});
