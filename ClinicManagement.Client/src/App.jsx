import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";

const lazyWithPreload = (factory) => {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
};

const Booking = lazyWithPreload(() => import("./pages/Appointment/Booking/Booking"));
const Cancellation = lazyWithPreload(() =>
  import("./pages/Appointment/Cancellation/Cancellation"),
);
const Reschedule = lazyWithPreload(() =>
  import("./pages/Appointment/Reschedule/Reschedule"),
);
const ScheduleView = lazyWithPreload(() =>
  import("./pages/Appointment/ScheduleView/ScheduleView"),
);
const Payment = lazyWithPreload(() => import("./pages/Finance/Payment/Payment"));
const WorkingSchedule = lazyWithPreload(() =>
  import("./pages/Admin/WorkingSchedule/WorkingSchedule"),
);
const Revenue = lazyWithPreload(() => import("./pages/Reports/Revenue/Revenue"));
const DoctorActivity = lazyWithPreload(() =>
  import("./pages/Reports/DoctorActivity/DoctorActivity"),
);
const PatientCount = lazyWithPreload(() =>
  import("./pages/Reports/PatientCount/PatientCount"),
);
const Register = lazyWithPreload(() => import("./pages/Auth/Register/Register"));
const Login = lazyWithPreload(() => import("./pages/Auth/Login/Login"));
const Logout = lazyWithPreload(() => import("./pages/Auth/Logout/Logout"));
const ForgotPassword = lazyWithPreload(() =>
  import("./pages/Auth/ForgotPassword/ForgotPassword"),
);
const AdminDashboard = lazyWithPreload(() =>
  import("./pages/Admin/Dashboard/Dashboard"),
);
const AdminUserRoles = lazyWithPreload(() =>
  import("./pages/Admin/UserRoles/UserRoles"),
);
const AdminDoctors = lazyWithPreload(() => import("./pages/Admin/Doctors/Doctors"));
const AdminMedicines = lazyWithPreload(() => import("./pages/Admin/Medicines/Medicines"));
const AdminServices = lazyWithPreload(() => import("./pages/Admin/Services/Services"));
const DoctorDashboard = lazyWithPreload(() =>
  import("./pages/Doctor/Dashboard/Dashboard"),
);
const PatientInfo = lazyWithPreload(() =>
  import("./pages/Doctor/PatientInfo/PatientInfo"),
);
const PatientView = lazyWithPreload(() =>
  import("./pages/Doctor/PatientView/PatientView"),
);
const Prescription = lazyWithPreload(() =>
  import("./pages/Doctor/Prescription/Prescription"),
);
const ServiceRequest = lazyWithPreload(() =>
  import("./pages/Doctor/ServiceRequest/ServiceRequest"),
);
const ReceptionistDashboard = lazyWithPreload(() =>
  import("./pages/Receptionist/Dashboard/Dashboard"),
);
const PatientIntake = lazyWithPreload(() =>
  import("./pages/Receptionist/PatientIntake/PatientIntake"),
);
const PatientDashboard = lazyWithPreload(() =>
  import("./pages/Patient/Dashboard/Dashboard"),
);
const MedicalRecord = lazyWithPreload(() =>
  import("./pages/Patient/MedicalRecord/MedicalRecord"),
);
const HistoryView = lazyWithPreload(() =>
  import("./pages/Patient/HistoryView/HistoryView"),
);

const routePreloads = {
  admin: [AdminDashboard, AdminUserRoles, AdminDoctors, AdminMedicines, AdminServices, WorkingSchedule],
  doctor: [DoctorDashboard, PatientInfo, PatientView, Prescription, ServiceRequest],
  receptionist: [ReceptionistDashboard, MedicalRecord, PatientIntake, HistoryView, Payment],
  patient: [PatientDashboard, ScheduleView, Booking, Cancellation, Reschedule],
};

const getRoleKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[_\s-]+/g, "");

const normalizeRole = (value) => {
  const key = getRoleKey(value);
  if (["superadmin", "admin", "quanly", "manager"].includes(key)) return "admin";
  if (["bacsi", "doctor"].includes(key)) return "doctor";
  if (["letan", "receptionist"].includes(key)) return "receptionist";
  return "patient";
};

const AppFallback = () => <div className="app-route-loading">Đang tải...</div>;

function App() {
  useEffect(() => {
    const role = normalizeRole(
      sessionStorage.getItem("role") ||
        sessionStorage.getItem("userRole") ||
        sessionStorage.getItem("user_role") ||
        sessionStorage.getItem("Role"),
    );
    const preload = () => {
      Login.preload();
      Logout.preload();
      routePreloads[role].forEach((component) => component.preload());
    };
    const timer = window.setTimeout(preload, 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<AppFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Login" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Register" element={<Navigate to="/register" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/Logout" element={<Navigate to="/logout" replace />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/ForgotPassword" element={<Navigate to="/forgotpassword" replace />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />

          <Route path="patient/dashboard" element={<PatientDashboard />} />
          <Route path="scheduleview" element={<ScheduleView />} />
          <Route path="Scheduleview" element={<Navigate to="/scheduleview" replace />} />
          <Route path="booking" element={<Booking />} />
          <Route path="cancellation" element={<Cancellation />} />
          <Route path="Cancellation" element={<Navigate to="/cancellation" replace />} />
          <Route path="reschedule" element={<Reschedule />} />
          <Route path="Reschedule" element={<Navigate to="/reschedule" replace />} />

          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="Admin/Dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="admin/user-roles" element={<AdminUserRoles />} />
          <Route path="Admin/User-roles" element={<Navigate to="/admin/user-roles" replace />} />
          <Route path="admin/doctors" element={<AdminDoctors />} />
          <Route path="Admin/Doctors" element={<Navigate to="/admin/doctors" replace />} />
          <Route path="admin/medicines" element={<AdminMedicines />} />
          <Route path="admin/services" element={<AdminServices />} />
          <Route path="admin/working-schedule" element={<WorkingSchedule />} />
          {/* Đường dẫn cũ: /WorkingSchedule. Giữ redirect để không làm hỏng link đã có. */}
          <Route path="WorkingSchedule" element={<Navigate to="/admin/working-schedule" replace />} />

          <Route path="doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="Doctor/Dashboard" element={<Navigate to="/doctor/dashboard" replace />} />
          <Route path="doctor/patient-info" element={<PatientInfo />} />
          <Route path="Doctor/Patient-info" element={<Navigate to="/doctor/patient-info" replace />} />
          <Route path="doctor/patient-view" element={<PatientView />} />
          <Route path="doctor/Patient-view" element={<Navigate to="/doctor/patient-view" replace />} />
          <Route path="doctor/prescription" element={<Prescription />} />
          <Route path="Doctor/Prescription" element={<Navigate to="/doctor/prescription" replace />} />
          <Route path="doctor/service-request" element={<ServiceRequest />} />
          <Route path="Doctor/Service-request" element={<Navigate to="/doctor/service-request" replace />} />

          <Route path="receptionist/dashboard" element={<ReceptionistDashboard />} />
          <Route
            path="Receptionist/Dashboard"
            element={<Navigate to="/receptionist/dashboard" replace />}
          />
          <Route path="receptionist/medical-record" element={<MedicalRecord />} />
          <Route path="receptionist/patient-intake" element={<PatientIntake />} />
          <Route
            path="Receptionist/Patient-intake"
            element={<Navigate to="/receptionist/patient-intake" replace />}
          />
          <Route path="receptionist/history-view" element={<HistoryView />} />

          <Route path="payment" element={<Payment />} />
          <Route path="Payment" element={<Navigate to="/payment" replace />} />
          <Route path="finance/payment" element={<Navigate to="/payment" replace />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="Revenue" element={<Navigate to="/revenue" replace />} />
          <Route path="admin/doctoractivity" element={<DoctorActivity />} />
          <Route path="doctoractivity" element={<Navigate to="/admin/doctoractivity" replace />} />
          <Route path="DoctorActivity" element={<Navigate to="/admin/doctoractivity" replace />} />          <Route path="patientcount" element={<PatientCount />} />
          <Route path="patientCount" element={<Navigate to="/patientcount" replace />} />
          <Route path="MedicalRecord" element={<Navigate to="/receptionist/medical-record" replace />} />
          <Route path="historyView" element={<Navigate to="/receptionist/history-view" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
