using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HandyBrosApi.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public int PosterId { get; set; }
        public User Poster { get; set; } = null!;
        public List<JobInterest> InterestedUsers { get; set; } = new();

        [NotMapped]
        public bool IsActive => PostedDate.AddMonths(2) > DateTime.UtcNow;
    }
}