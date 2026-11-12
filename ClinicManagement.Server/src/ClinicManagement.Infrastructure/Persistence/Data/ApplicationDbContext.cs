using MayNghien.Infrastructures.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ClinicManagement.Domain.Entities;
using ClinicManagement.Infrastructure.Persistence.Entities;

namespace ClinicManagement.Infrastructure.Persistence.Data
{
    public class ApplicationDbContext : BaseContext<ApplicationUser>
    {
        public ApplicationDbContext() { }

        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalExamination> MedicalExaminations { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<PrescriptionDetail> PrescriptionDetails { get; set; }
        public DbSet<MedicalService> MedicalServices { get; set; }
        public DbSet<WorkSchedule> WorkSchedules { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<RefreshTokenModel> RefreshTokenModels { get; set; }
        public DbSet<OtpCode> OtpCodes { get; set; }
        public DbSet<MedicalExaminationService> MedicalExaminationServices { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var appSetting = JsonConvert.DeserializeObject<AppSetting>(File.ReadAllText("appsettings.json"));
                optionsBuilder.UseMySql(appSetting!.ConnectionString,
                    new MySqlServerVersion(new Version(8, 0, 44)));
            }
        }
    }
}
