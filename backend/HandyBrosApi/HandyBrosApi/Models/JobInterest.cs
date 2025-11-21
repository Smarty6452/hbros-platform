using System;

namespace HandyBrosApi.Models
{
    public class JobInterest
    {
        public int JobId { get; set; }
        public Job Job { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public DateTime InterestedAt { get; set; } = DateTime.UtcNow;
    }
}