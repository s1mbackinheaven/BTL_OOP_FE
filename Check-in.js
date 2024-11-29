// Hàm load toàn bộ dữ liệu lịch hẹn
function loadAllBookings() {
    fetch("http://localhost:8080/api/appointments/get_all_appointment", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Lỗi lấy danh sách lịch: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        renderBookings(data); // Hiển thị dữ liệu lên bảng
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Không thể tải danh sách lịch.");
    });
}

// Hàm hiển thị dữ liệu lên bảng
function renderBookings(bookings) {
    const tableBody = document.querySelector("#bookingTable tbody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    bookings.forEach(booking => {
        const row = document.createElement("tr");
        row.dataset.id = booking.id; // Thêm ID vào thuộc tính data-id

        // Cột Tên Pet
        const petNameCell = document.createElement("td");
        petNameCell.textContent = booking.petName || "N/A";
        row.appendChild(petNameCell);

        // Cột Tên User
        const userNameCell = document.createElement("td");
        userNameCell.textContent = booking.ownerName || "N/A";
        row.appendChild(userNameCell);

        // Cột Thời gian Đặt Lịch
        const dateTimeCell = document.createElement("td");
        dateTimeCell.textContent = formatDate(booking.appointmentDateTime);
        row.appendChild(dateTimeCell);

        // Cột Status
        const statusCell = document.createElement("td");
        statusCell.textContent = booking.status || "N/A";
        row.appendChild(statusCell);

        // Cột Check-in
        const checkInCell = document.createElement("td");
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = booking.status === "Checked In"; // Đánh dấu checkbox nếu đã check-in
        checkBox.addEventListener("change", () => handleCheckIn(booking.id, checkBox.checked));
        checkInCell.appendChild(checkBox);
        row.appendChild(checkInCell);

        tableBody.appendChild(row);
    });
}

// Hàm chuyển đổi định dạng ngày giờ
function formatDate(dateTime) {
    if (!dateTime) return "N/A";
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}-${month}-${year}`;
}

// Hàm xử lý check-in
function handleCheckIn(appointmentId, isChecked) {
    fetch(`http://localhost:8080/api/appointments/check_in/${appointmentId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ checkedIn: isChecked }) // Truyền trạng thái check-in
    })
    .then(response => {
        if (!response.ok) {
            // Nếu phản hồi lỗi, trả về lỗi chi tiết từ server
            return response.text().then(text => {
                throw new Error(`Lỗi từ server: ${text}`);
            });
        }
        // Không cần xử lý JSON nếu server không trả dữ liệu
        alert("Check-in thành công!");
        updateRowStatus(appointmentId, isChecked ? "Checked In" : "Scheduled");
    })
    .catch(error => {
        console.error("Lỗi khi cập nhật check-in:", error);
        alert("Không thể cập nhật trạng thái check-in.");
    });
}

// Hàm cập nhật trực tiếp trạng thái trên bảng
function updateRowStatus(appointmentId, newStatus) {
    const tableRows = document.querySelectorAll("#bookingTable tbody tr");

    tableRows.forEach(row => {
        const idCell = row.dataset.id;
        if (idCell == appointmentId) {
            const statusCell = row.querySelector("td:nth-child(4)");
            if (statusCell) {
                statusCell.textContent = newStatus;
            }
        }
    });
}

// Gọi hàm loadAllBookings khi tải trang
loadAllBookings();
