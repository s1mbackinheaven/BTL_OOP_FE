document.getElementById("loginButton").addEventListener("click", function(event) {
    event.preventDefault();  // Ngừng hành động mặc định của nút (ví dụ: không tải lại trang)

    // Lấy dữ liệu từ các trường input
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Kiểm tra xem các trường đăng nhập có bị bỏ trống không
    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
        return;
    }

    // Tạo đối tượng dữ liệu cần gửi tới API
    const loginData = {
        username: username,
        password: password
    };
    // console.log("Dữ liệu gửi lên:", loginData);
    // Gửi yêu cầu POST tới API backend
    fetch("http://localhost:8080/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"  // Gửi dữ liệu dưới dạng JSON
        },
        body: JSON.stringify(loginData)
    })

    .then(response => {
        console.log("Phản hồi từ server:", response);

        if (!response.ok) {
            throw new Error(`Lỗi HTTP ${response.status}`);
        }
        return response.json();  // Chuyển đổi dữ liệu phản hồi thành JSON
    })
    .then(data => {
        console.log("Dữ liệu nhận được:", data);

        // Kiểm tra kết quả đăng nhập từ API
        if (data.result && data.result.authenticated) {
            alert("Đăng nhập thành công!");
            
            // Truy cập vào token nằm trong lớp con result của data
            const token = data.result.token;
            
            // Lưu token vào localStorage
            localStorage.setItem("token", token);
            
            // Redirect đến trang chính sau khi đăng nhập thành công
            window.location.href = "Trangchu2.html";
        } else {
            alert("Thông tin đăng nhập sai. Vui lòng thử lại.");
        }
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập.");
    });
});
