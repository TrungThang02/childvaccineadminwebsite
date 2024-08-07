import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2';
const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [newAppointment, setNewAppointment] = useState({ Name: '', Time: '' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, 'appointment');
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

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewAppointment({ Name: '', Time: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditing && currentAppointmentId) {
        // Update document in Firestore
        const appointmentRef = doc(db, 'appointment', currentAppointmentId);
        await updateDoc(appointmentRef, newAppointment);
        setAppointments(prev => prev.map(appointment =>
          appointment.id === currentAppointmentId ? { ...appointment, ...newAppointment } : appointment
        ));
      } else {
        // Add new document to Firestore
        const appointmentsCollection = collection(db, 'appointment');
        const docRef = await addDoc(appointmentsCollection, newAppointment);
        setAppointments([...appointments, { id: docRef.id, ...newAppointment }]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving appointment: ", error);
    }
  };

  const handleEdit = (appointment) => {
    setNewAppointment({ Name: appointment.Name, Time: appointment.Time });
    setCurrentAppointmentId(appointment.id);
    setIsEditing(true);
    handleOpenModal();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Xóa lịch tiêm?',
      text: "Bạn có chắc chắn muốn xóa lịch tiêm này?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        // Delete document from Firestore
        await deleteDoc(doc(db, 'appointment', id));
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        Swal.fire(
          'Đã xóa!',
          'Lịch tiêm đã được xóa.',
          'success'
        );
      } catch (error) {
        console.error("Error deleting appointment: ", error);
      }
    }
  };

  return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lịch tiêm</h2>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4 "
        onClick={handleOpenModal}
      >
        Thêm lịch tiêm
      </button>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="w-full bg-gray-100 border-b">
            <th className="py-2 px-4 border-r">Tên vắc xin</th>
            <th className="py-2 px-4 border-r">Giờ tiêm</th>
            <th className="py-2 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 border-r">{appointment.Name}</td>
              <td className="py-2 px-4 border-r">{appointment.Time}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                  onClick={() => handleEdit(appointment)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Chỉnh sửa lịch tiêm" : "Thêm lịch tiêm"}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Tên vắc xin</label>
              <input
                type="text"
                name="Name"
                value={newAppointment.Name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Giờ tiêm</label>
              <input
                type="text"
                name="Time"
                value={newAppointment.Time}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {isEditing ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
