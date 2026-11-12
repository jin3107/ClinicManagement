using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClinicManagement.DTOs.Requests
{
    public class LichHenRequest
    {
        public Guid MaLH { get; set; }

        [Required(ErrorMessage = "Thời gian khám là bắt buộc.")]
        public DateTime ThoiGianKham { get; set; }

        [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
        [MaxLength(1000, ErrorMessage = "Trạng thái không vượt quá 1000 ký tự.")]
        public string TrangThai { get; set; }

        public Guid? MaBN { get; set; }

        public Guid? MaBS { get; set; }
    }
}
