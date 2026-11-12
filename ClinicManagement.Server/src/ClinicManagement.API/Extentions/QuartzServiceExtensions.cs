using Quartz;
using ClinicManagement.Infrastructure.Jobs;

namespace ClinicManagement.API.Extentions
{
    public static class QuartzServiceExtensions
    {
        public static IServiceCollection AddQuartzConfiguration(this IServiceCollection services)
        {
            services.AddQuartz(q =>
            {
                q.UseSimpleTypeLoader();
                q.UseInMemoryStore();

                var clearJobKey = new JobKey("ClearExpiredDataJob", "MaintenanceJobs");
                q.AddJob<ClearExpiredDataJob>(opts => opts
                    .WithIdentity(clearJobKey)
                    .WithDescription("Clear expired/used OTP codes"));

                q.AddTrigger(opts => opts
                    .ForJob(clearJobKey)
                    .WithIdentity("ClearExpiredDataTrigger", "MaintenanceJobs")
                    .WithCronSchedule("0 0 3 * * ?")
                    .WithDescription("Runs daily at 3:00 AM"));
            });

            services.AddQuartzHostedService(options =>
            {
                options.WaitForJobsToComplete = true;
                options.AwaitApplicationStarted = true;
            });

            return services;
        }
    }
}
