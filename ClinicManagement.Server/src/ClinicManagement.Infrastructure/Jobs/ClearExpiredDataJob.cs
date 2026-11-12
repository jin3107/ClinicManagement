using Quartz;
using ClinicManagement.Application.Interfaces.Background;

namespace ClinicManagement.Infrastructure.Jobs
{
    [DisallowConcurrentExecution]
    public class ClearExpiredDataJob : IJob
    {
        private readonly IClearExpiredDataHandler _handler;

        public ClearExpiredDataJob(IClearExpiredDataHandler handler)
        {
            _handler = handler;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            await _handler.HandleAsync();
        }
    }
}
