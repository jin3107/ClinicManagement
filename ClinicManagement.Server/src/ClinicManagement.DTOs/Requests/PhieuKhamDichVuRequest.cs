using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicManagement.DTOs.Requests
{
    public class PhieuKhamDichVuRequest
    {
        [Required(ErrorMessage = "Mã phiếu khám là bắt buộc.")]
        public Guid MaPK { get; set; }

        [Required(ErrorMessage = "Danh sách dịch vụ không được rỗng.")]
        [MinLength(1, ErrorMessage = "Phải có ít nhất 1 dịch vụ.")]
        public List<Guid> MaDichVus { get; set; } = [];
    }
}
