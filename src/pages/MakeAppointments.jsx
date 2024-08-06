import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import axios from 'axios'; // Import axios
import Swal from 'sweetalert2'; // Import sweetalert2

const MakeAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const appointmentsCollection = collection(db, 'MakeAppointments');
                const appointmentSnapshot = await getDocs(appointmentsCollection);
                const appointmentsList = appointmentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAppointments(appointmentsList);
            } catch (error) {
                console.error("Error fetching appointments: ", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleApprove = async (id, userEmail, patientName) => {
        // Hiển thị hộp thoại xác nhận
        const result = await Swal.fire({
            title: 'Xác nhận',
            text: "Bạn có chắc chắn muốn duyệt lịch tiêm này?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Duyệt',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const appointmentDoc = doc(db, 'MakeAppointments', id);
                await updateDoc(appointmentDoc, { status: 'done' });

                const updatedAppointments = appointments.map(appointment =>
                    appointment.id === id ? { ...appointment, status: 'done' } : appointment
                );
                setAppointments(updatedAppointments);

                // Gửi email thông báo bằng axios
                const htmlContent = `
                    <p>Kính gửi,</p>
                    <p>Đã xác nhận tiêm thành công cho hồ sơ ${patientName}</p>
                   
                    <p>Trân trọng,</p>
                `;

                try {
                    const response = await axios.post('http://192.168.1.3:3001/send-email', {
                        recipient: userEmail,
                        subject: 'Xác nhận đặt lịch tiêm chủng',
                        html: htmlContent,
                    });

                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Thành công',
                            text: "Lịch tiêm đã được duyệt và email thông báo đã được gửi.",
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        Swal.fire({
                            title: 'Cảnh báo',
                            text: "Lịch tiêm đã được duyệt, nhưng không thể gửi email thông báo.",
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (emailError) {
                    console.error("Error sending email: ", emailError);
                    Swal.fire({
                        title: 'Lỗi',
                        text: "Đã có lỗi xảy ra khi gửi email thông báo.",
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error("Error updating appointment: ", error);
            }
        }
    };

    return (
        <div className="mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lịch tiêm đã đặt</h2>
            {appointments.length === 0 ? (
                <p className="text-gray-500">Chưa có lịch tiêm nào được đặt.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="w-full bg-gray-100 border-b">
                            <th className="py-2 px-4 border-r">Email</th>
                            <th className="py-2 px-4 border-r">Tên Bệnh Nhân</th>
                            <th className="py-2 px-4 border-r">Ngày Sinh</th>
                            <th className="py-2 px-4 border-r">Ngày Tiêm</th>
                            <th className="py-2 px-4 border-r">Giờ Tiêm</th>
                            <th className="py-2 px-4 border-r">Tên Vắc Xin</th>
                            <th className="py-2 px-4 border">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appointment => (
                            <tr key={appointment.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 border-r">{appointment.email}</td>
                                <td className="py-2 px-4 border-r">{appointment.patientName}</td>
                                <td className="py-2 px-4 border-r">
                                    {new Date(appointment.patientDOB).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-r">
                                    {new Date(appointment.vaccinationDate.seconds * 1000).toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-r">{appointment.vaccinationTime}</td>
                                <td className="py-2 px-4 border-r">{appointment.vaccineName}</td>
                                <td className="py-2 px-4 border-r">
                                    {appointment.status === 'pending' ? (
                                        <button
                                            onClick={() => handleApprove(appointment.id, appointment.email, appointment.patientName)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Duyệt
                                        </button>
                                    ) : (
                                        <span className="text-green-500 font-semibold">Hoàn thành</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MakeAppointments;
