using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class LichLamViecRequest
    {
        public Guid? MaLLV { get; set; }

        [Required(ErrorMessage = "Ngày làm việc là bắt buộc.")]
        public DateTime NgayLamViec { get; set; }

        [Required(ErrorMessage = "Giờ bắt đầu là bắt buộc.")]
        public DateTime GioBatDau { get; set; }

        [Required(ErrorMessage = "Giờ kết thúc là bắt buộc.")]
        public DateTime GioKetThuc { get; set; }

        public Guid? MaBS { get; set; }
    }
}
