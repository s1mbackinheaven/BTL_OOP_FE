// Hàm để xem bình luận

const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const comment = document.querySelector('#list-comment');
const commentItem = document.querySelectorAll('#list-comment .item');
let translateY = 0;
let count = commentItem.length;

next.addEventListener('click', function (event) {
  event.preventDefault();
  if (count === 100) {
    // Xem hết bình luận
    return false;
  }
  translateY -= 400;
  comment.style.transform = `translateY(${translateY}px)`;
  count--;
});

prev.addEventListener('click', function (event) {
  event.preventDefault();
  if (count === 100) {
    // Xem hết bình luận
    return false;
  }
  translateY += 400;
  comment.style.transform = `translateY(${translateY}px)`;
  count++;
});

// Lắng nghe sự kiện hover với thời gian trì hoãn
const actions = document.getElementById('actions');
const userMenu = document.getElementById('user-menu');

// Thời gian trì hoãn khi chuột di vào
let hoverTimeout;

actions.addEventListener('mouseenter', () => {
  hoverTimeout = setTimeout(() => {
    actions.classList.add('hovered'); // Thêm lớp để hiển thị bảng sau thời gian trì hoãn
  }, 300); // Trì hoãn 300ms (thời gian trì hoãn trước khi bảng xuất hiện)
});

actions.addEventListener('mouseleave', () => {
  clearTimeout(hoverTimeout); // Hủy bỏ thời gian trì hoãn nếu chuột rời trước khi bảng xuất hiện
  actions.classList.remove('hovered'); // Ẩn bảng khi chuột rời khỏi
});

// Lắng nghe sự kiện di chuột ra khỏi bảng
userMenu.addEventListener('mouseenter', () => {
  clearTimeout(hoverTimeout); // Hủy bỏ nếu chuột di vào bảng
  actions.classList.add('hovered'); // Đảm bảo bảng vẫn hiển thị khi chuột trong bảng
});

userMenu.addEventListener('mouseleave', () => {
  actions.classList.remove('hovered'); // Ẩn bảng khi chuột rời khỏi bảng
});

// Hàm lấy tham số từ URL
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Hàm để tải tất cả feedback từ API
function loadFeedback() {
  // Gửi yêu cầu đến API để lấy tất cả feedback
  fetch('http://localhost:8080/api/feedbacks/get_all_feedback', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Thêm token nếu cần
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())  // Chuyển đổi phản hồi thành JSON
  .then(data => {
    displayFeedback(data);  // Hiển thị feedback lên trang
  })
  .catch(error => {
    console.error("Lỗi:", error);
    alert("Không thể tải feedback.");
  });
}

// Hàm hiển thị feedback
function displayFeedback(feedbacks) {
  const listComment = document.getElementById('list-comment');
  listComment.innerHTML = '';  // Xóa danh sách cũ

  feedbacks.forEach(feedback => {
    const feedbackElement = document.createElement('li');
    feedbackElement.classList.add('item');

    feedbackElement.innerHTML = `
      <div class="avatar">
        <img src="Image/user.png" alt="">
      </div>
      <div class="stars">
        ${generateStars(feedback.rating || 5)}  <!-- Hàm tạo sao theo rating -->
      </div>
      <div class="name">${feedback.name}</div>
      <div class="text">
        <p>${feedback.content}</p>
      </div>
    `;

    listComment.appendChild(feedbackElement);
  });
}

// Hàm tạo các sao theo rating (từ 1 đến 5)
function generateStars(rating) {
  let stars = '';
  for (let i = 0; i < rating; i++) {
    stars += `<span><img src="Image/star.png" alt=""></span>`;
  }
  return stars;
}

// Hàm đăng bình luận mới
function postComment() {
    // Lấy giá trị tên và nội dung bình luận
    const name = document.getElementById('input-name').value;
    const feedback = document.getElementById('input-feedback').value;
  
    // Kiểm tra nếu người dùng chưa nhập tên hoặc bình luận
    if (!name || !feedback) {
      alert("Vui lòng nhập tên và bình luận!");
      return;
    }
  
    // Tạo đối tượng mới chứa thông tin bình luận
    const newFeedback = {
      name: name,
      content: feedback
    };
  
    // Gửi yêu cầu POST đến API để đăng bình luận
    fetch('http://localhost:8080/api/feedbacks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newFeedback)  // Gửi dữ liệu bình luận dưới dạng JSON
    })
    .then(response => response.json())
    .then(data => {
      alert("Bình luận đã được gửi!");
      loadFeedback();  // Tải lại feedback sau khi đăng thành công
    })
    .catch(error => {
      console.error("Lỗi:", error);
      alert("Không thể gửi bình luận.");
    });
  }
  
  // Gắn sự kiện click cho nút "Gửi"
  document.querySelector('.post-comment').addEventListener('click', function(event) {
    event.preventDefault(); // Ngừng hành động mặc định của nút (nếu có)
    postComment();  // Gọi hàm đăng bình luận
  });
  
  // Gọi hàm khi trang được tải
  window.onload = function() {
    loadFeedback();  // Tải feedback khi trang được tải
  };
  
