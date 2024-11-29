// Hàm gửi dữ liệu bài viết
function postArticle() {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const author = document.getElementById('author').value.trim();

    // Kiểm tra các trường bắt buộc
    if (!title || !content || !author) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Tạo đối tượng dữ liệu cần gửi
    const articleData = {
        title: title,
        content: content,
        author: author
        // Lưu ý: không cần gửi trường 'date' vì API sẽ tự động cập nhật
    };

    // Gửi dữ liệu tới API để đăng bài viết
    fetch('http://localhost:8080/api/articles', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Có lỗi xảy ra trong quá trình đăng bài!');
        }
        return response.json();
    })
    .then(data => {
        alert("Đăng bài thành công!");
        loadArticles(); // Sau khi đăng bài thành công, làm mới danh sách bài viết
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại!");
    });
}

// Hàm chuyển đổi định dạng ngày, bao gồm giờ, phút, giây
function formatDate(dateString) {
    const date = new Date(dateString);  // Chuyển đổi chuỗi ngày từ API thành đối tượng Date
    if (isNaN(date)) {
        return 'Ngày không hợp lệ';  // Kiểm tra nếu ngày không hợp lệ
    }

    // Lấy các thành phần ngày, tháng, năm, giờ, phút, giây
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về tháng từ 0 (tháng 0 là tháng 1)
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Trả về chuỗi ngày giờ theo định dạng dd/MM/yyyy HH:mm:ss
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function renderArticles(articles) {
    const articleList = document.querySelector('.article-list');
    articleList.innerHTML = ''; // Xóa danh sách cũ

    articles.forEach(article => {
        const articleItem = document.createElement('div');
        articleItem.classList.add('article-item');

        const title = document.createElement('h2');
        title.textContent = article.title;

        const author = document.createElement('p');
        author.classList.add('author');
        author.textContent = `Tác giả: ${article.author}`;

        const date = document.createElement('p');
        date.classList.add('date');
        // Kiểm tra lại ngày giờ từ API và định dạng lại
        date.textContent = `Ngày đăng: ${formatDate(article.createdAt)}`;

        const content = document.createElement('p');    
        content.classList.add('content');
        content.textContent = article.content;

        // Thêm nút "Xem chi tiết"
        const detailButton = document.createElement('button');
        detailButton.textContent = 'Xem chi tiết';
        detailButton.addEventListener('click', function() {
            // Chuyển hướng đến trang chi tiết bài viết
            window.location.href = `Chi tiết bài viết.html?id=${article.id}`;
        });

        articleItem.appendChild(title);
        articleItem.appendChild(author);
        articleItem.appendChild(date);
        articleItem.appendChild(content);
        articleItem.appendChild(detailButton); // Thêm nút chi tiết vào bài viết

        articleList.appendChild(articleItem);
    });
}


// Hàm tải danh sách bài viết
function loadArticles() {
    fetch('http://localhost:8080/api/articles/get_all_article', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Có lỗi khi tải danh sách bài viết!');
        }
        return response.json();
    })
    .then(data => {
        renderArticles(data); // Hiển thị bài viết lên trang
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Không thể tải danh sách bài viết.");
    });
}

// Gọi hàm loadArticles khi tải trang
loadArticles();


// Xử lý sự kiện gửi bài viết
const form = document.getElementById('submitArticleForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    postArticle(); // Gửi bài viết
});
