document.addEventListener("DOMContentLoaded", loadDoctorList); // Tự động chạy khi trang tải xong

// Hàm gọi API lấy danh sách bác sĩ và hiển thị trong select box
function loadDoctorList() {
    fetch("http://localhost:8080/api/doctors/get_all_doctor", { // Thay URL theo API của bạn
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`, // Thêm token nếu cần
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Không thể tải danh sách bác sĩ");
        }
        return response.json();
    })
    .then(data => {
        const doctorSelect = document.getElementById("doctor");
        
        // Xóa các bác sĩ cũ nếu đã có (đảm bảo không bị lặp danh sách)
        doctorSelect.innerHTML = '<option value="null">Không ưu tiên</option>';

        // Thêm từng bác sĩ vào select box
        data.forEach(doctor => {
            const option = document.createElement("option");
            option.value = doctor.id; // Gửi ID bác sĩ đến BE
            option.textContent = `${doctor.name} (${doctor.experience} kinh nghiệm)`; // Hiển thị tên và kinh nghiệm
            doctorSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Lỗi khi tải danh sách bác sĩ:", error);
        alert("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau!");
    });
}

// Hàm xử lý sự kiện khi nhấn nút "Đăng ký"
document.getElementById("registerButton").addEventListener("click", function(event) {
    event.preventDefault(); // Ngăn hành động mặc định của nút

    // Lấy giá trị từ các trường input
    const username = document.getElementById("username").value;
    const petName = document.getElementById("petName").value;
    const petAge = parseInt(document.getElementById("petAge").value);
    const appointmentDate = document.getElementById("appointmentDate").value;
    const appointmentTime = document.getElementById("appointmentTime").value;
    const doctorId = document.getElementById("doctor").value; // Lấy ID bác sĩ từ select box
    const note = document.getElementById("note").value;

    // Kiểm tra nếu người dùng không nhập đủ thông tin
    if (!username || !petName || !petAge || !appointmentDate || !appointmentTime || !doctorId) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    // Kiểm tra tuổi của thú cưng
    if (petAge <= 0) {
        alert("Tuổi của Pet phải lớn hơn 0!");
        return;
    }

    // Kiểm tra ngày hẹn không phải ngày trong quá khứ
    const currentDate = new Date();
    if (new Date(appointmentDate) < currentDate) {
        alert("Ngày hẹn không thể là ngày trong quá khứ!");
        return;
    }

    // Ghép ngày và giờ thành datetime hợp lệ
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`).toISOString();

    // Xử lý "Không ưu tiên" (doctorId === "null")
    const preferredDoctorId = doctorId === "null" ? null : parseInt(doctorId);

    // Tạo dữ liệu gửi API
    const formData = {
        ownerName: username,                 // Tên người đăng ký
        petName: petName,                    // Tên thú cưng
        petAge: petAge,                      // Tuổi thú cưng
        appointmentDateTime: appointmentDateTime, // Ngày giờ hẹn
        note: note,                          // Ghi chú
        status: "Đang chờ",                  // Trạng thái cuộc hẹn
        preferredDoctorId: preferredDoctorId // ID bác sĩ (hoặc null nếu không ưu tiên)
    };

    // Gửi request POST đến API
    fetch("http://localhost:8080/api/appointments", { // Thay URL theo API của bạn
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}` // Gửi token nếu cần
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                alert("Lỗi từ server: " + err.message);
                throw new Error(err.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Dữ liệu phản hồi từ API:", data);
        alert("Đăng ký lịch thành công!");
    })
    .catch(error => {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại!");
    });
});
