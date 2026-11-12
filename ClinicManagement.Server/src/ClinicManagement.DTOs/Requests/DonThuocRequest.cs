using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class DonThuocRequest
    {
        public Guid? MaDT { get; set; }

        [Required(ErrorMessage = "Mã phiếu khám là bắt buộc.")]
        public Guid MaPK { get; set; }

        [Required(ErrorMessage = "Danh sách thuốc không được rỗng.")]
        [MinLength(1, ErrorMessage = "Phải có ít nhất 1 thuốc.")]
        public List<ChiTietDonThuocRequest> ChiTietDonThuocs { get; set; } = [];
    }
}
