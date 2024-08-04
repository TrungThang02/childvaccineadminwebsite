import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import emailjs from 'emailjs-com'; // Import EmailJS

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

    const handleApprove = async (id, email) => {
        // Cảnh báo xác nhận
        if (window.confirm("Bạn có chắc chắn muốn duyệt lịch tiêm này?")) {
            try {
                const appointmentDoc = doc(db, 'MakeAppointments', id);
                await updateDoc(appointmentDoc, { status: 'done' });
                
                // Cập nhật lại danh sách các lịch tiêm sau khi cập nhật
                const updatedAppointments = appointments.map(appointment =>
                    appointment.id === id ? { ...appointment, status: 'done' } : appointment
                );
                setAppointments(updatedAppointments);

                // Gửi email thông báo
                await emailjs.send('service_evfiy2d', 'template_3cb7mew', { to_email: email }, 'trantrungthang');
                
                alert("Lịch tiêm đã được duyệt và email thông báo đã được gửi.");
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
                                            onClick={() => handleApprove(appointment.id, appointment.email)}
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
