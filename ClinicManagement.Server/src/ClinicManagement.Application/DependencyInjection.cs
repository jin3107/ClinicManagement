using Microsoft.Extensions.DependencyInjection;
using ClinicManagement.Application.Implementations.Doctors;
using ClinicManagement.Application.Implementations.Patients;
using ClinicManagement.Application.Implementations.MedicalServices;
using ClinicManagement.Application.Implementations.Medicines;
using ClinicManagement.Application.Implementations.Prescriptions;
using ClinicManagement.Application.Implementations.Invoices;
using ClinicManagement.Application.Implementations.Appointments;
using ClinicManagement.Application.Implementations.WorkSchedules;
using ClinicManagement.Application.Implementations.Staffs;
using ClinicManagement.Application.Implementations.MedicalExaminations;
using ClinicManagement.Application.Implementations.MedicalExaminationServices;
using ClinicManagement.Application.Interfaces.Doctors;
using ClinicManagement.Application.Interfaces.Patients;
using ClinicManagement.Application.Interfaces.MedicalServices;
using ClinicManagement.Application.Interfaces.Medicines;
using ClinicManagement.Application.Interfaces.Prescriptions;
using ClinicManagement.Application.Interfaces.Invoices;
using ClinicManagement.Application.Interfaces.Appointments;
using ClinicManagement.Application.Interfaces.WorkSchedules;
using ClinicManagement.Application.Interfaces.Staffs;
using ClinicManagement.Application.Interfaces.MedicalExaminations;
using ClinicManagement.Application.Interfaces.MedicalExaminationServices;

namespace ClinicManagement.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ClinicManagement.Application.Interfaces.Identity.IPatientScopeService, ClinicManagement.Application.Services.PatientScopeService>();

            services.AddScoped<ICreateDoctorHandler, CreateDoctorHandler>();
            services.AddScoped<IUpdateDoctorHandler, UpdateDoctorHandler>();
            services.AddScoped<IDeleteDoctorHandler, DeleteDoctorHandler>();
            services.AddScoped<IGetDoctorByIdHandler, GetDoctorByIdHandler>();
            services.AddScoped<ISearchDoctorHandler, SearchDoctorHandler>();

            services.AddScoped<ICreatePatientHandler, CreatePatientHandler>();
            services.AddScoped<IUpdatePatientHandler, UpdatePatientHandler>();
            services.AddScoped<IDeletePatientHandler, DeletePatientHandler>();
            services.AddScoped<IGetPatientByIdHandler, GetPatientByIdHandler>();
            services.AddScoped<ISearchPatientHandler, SearchPatientHandler>();

            services.AddScoped<ICreateMedicalServiceHandler, CreateMedicalServiceHandler>();
            services.AddScoped<IUpdateMedicalServiceHandler, UpdateMedicalServiceHandler>();
            services.AddScoped<IDeleteMedicalServiceHandler, DeleteMedicalServiceHandler>();
            services.AddScoped<IGetMedicalServiceByIdHandler, GetMedicalServiceByIdHandler>();
            services.AddScoped<ISearchMedicalServiceHandler, SearchMedicalServiceHandler>();

            services.AddScoped<ICreateMedicineHandler, CreateMedicineHandler>();
            services.AddScoped<IUpdateMedicineHandler, UpdateMedicineHandler>();
            services.AddScoped<IDeleteMedicineHandler, DeleteMedicineHandler>();
            services.AddScoped<IGetMedicineByIdHandler, GetMedicineByIdHandler>();
            services.AddScoped<ISearchMedicineHandler, SearchMedicineHandler>();

            services.AddScoped<ICreatePrescriptionHandler, CreatePrescriptionHandler>();
            services.AddScoped<IUpdatePrescriptionHandler, UpdatePrescriptionHandler>();
            services.AddScoped<IDeletePrescriptionHandler, DeletePrescriptionHandler>();
            services.AddScoped<IGetPrescriptionByIdHandler, GetPrescriptionByIdHandler>();
            services.AddScoped<ISearchPrescriptionHandler, SearchPrescriptionHandler>();

            services.AddScoped<ICreateInvoiceHandler, CreateInvoiceHandler>();
            services.AddScoped<IUpdateInvoiceHandler, UpdateInvoiceHandler>();
            services.AddScoped<IDeleteInvoiceHandler, DeleteInvoiceHandler>();
            services.AddScoped<IGetInvoiceByIdHandler, GetInvoiceByIdHandler>();
            services.AddScoped<ISearchInvoiceHandler, SearchInvoiceHandler>();

            services.AddScoped<ICreateAppointmentHandler, CreateAppointmentHandler>();
            services.AddScoped<IUpdateAppointmentHandler, UpdateAppointmentHandler>();
            services.AddScoped<IDeleteAppointmentHandler, DeleteAppointmentHandler>();
            services.AddScoped<IGetAppointmentByIdHandler, GetAppointmentByIdHandler>();
            services.AddScoped<ISearchAppointmentHandler, SearchAppointmentHandler>();

            services.AddScoped<ICreateWorkScheduleHandler, CreateWorkScheduleHandler>();
            services.AddScoped<IUpdateWorkScheduleHandler, UpdateWorkScheduleHandler>();
            services.AddScoped<IDeleteWorkScheduleHandler, DeleteWorkScheduleHandler>();
            services.AddScoped<IGetWorkScheduleByIdHandler, GetWorkScheduleByIdHandler>();
            services.AddScoped<ISearchWorkScheduleHandler, SearchWorkScheduleHandler>();

            services.AddScoped<ICreateStaffHandler, CreateStaffHandler>();
            services.AddScoped<IUpdateStaffHandler, UpdateStaffHandler>();
            services.AddScoped<IDeleteStaffHandler, DeleteStaffHandler>();
            services.AddScoped<IGetStaffByIdHandler, GetStaffByIdHandler>();
            services.AddScoped<ISearchStaffHandler, SearchStaffHandler>();

            services.AddScoped<ICreateMedicalExaminationHandler, CreateMedicalExaminationHandler>();
            services.AddScoped<IUpdateMedicalExaminationHandler, UpdateMedicalExaminationHandler>();
            services.AddScoped<IDeleteMedicalExaminationHandler, DeleteMedicalExaminationHandler>();
            services.AddScoped<IGetMedicalExaminationByIdHandler, GetMedicalExaminationByIdHandler>();
            services.AddScoped<ISearchMedicalExaminationHandler, SearchMedicalExaminationHandler>();

            services.AddScoped<ICreateMedicalExaminationServiceHandler, CreateMedicalExaminationServiceHandler>();
            services.AddScoped<IGetMedicalExaminationServicesByExamHandler, GetMedicalExaminationServicesByExamHandler>();
            services.AddScoped<IDeleteMedicalExaminationServiceHandler, DeleteMedicalExaminationServiceHandler>();

            return services;
        }
    }
}
