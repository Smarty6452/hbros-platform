using HandyBrosApi.Data;
using HandyBrosApi.DTOs;
using HandyBrosApi.Hubs;          
using HandyBrosApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;     
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HandyBrosApi.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IHubContext<NotificationHub> _hubContext;  

        public JobsController(AppDbContext db, IHubContext<NotificationHub> hubContext)
        {
            _db = db;
            _hubContext = hubContext;  
        }

        private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        private string CurrentUserName => User.FindFirst(ClaimTypes.Name)?.Value ?? "Someone";

      

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobResponseDto>>> GetJobs(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string search = "")
        {
            var twoMonthsAgo = DateTime.UtcNow.AddMonths(-2);
            var query = _db.Jobs
                .Include(j => j.Poster)
                .Include(j => j.InterestedUsers)
                .Where(j => j.PostedDate >= twoMonthsAgo);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(j => j.Title.Contains(search) || j.Body.Contains(search));

            var jobs = await query
                .OrderByDescending(j => j.PostedDate)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(j => new JobResponseDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Body = j.Body,
                    PostedDate = j.PostedDate,
                    PosterName = j.Poster.Name,
                    InterestedCount = j.InterestedUsers.Count
                })
                .ToListAsync();

            return Ok(jobs);
        }

        [HttpPost]
        [Authorize(Roles = "Poster")]
        public async Task<IActionResult> CreateJob(CreateJobDto dto)
        {
            var job = new Job
            {
                Title = dto.Title,
                Body = dto.Body,
                PosterId = CurrentUserId,
                PostedDate = DateTime.UtcNow
            };
            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobResponseDto>> GetJobById(int id)
        {
            var job = await _db.Jobs
                .Include(j => j.Poster)
                .Include(j => j.InterestedUsers)
                .FirstOrDefaultAsync(j => j.Id == id && j.PostedDate >= DateTime.UtcNow.AddMonths(-2));
            if (job == null) return NotFound();
            return Ok(new JobResponseDto
            {
                Id = job.Id,
                Title = job.Title,
                Body = job.Body,
                PostedDate = job.PostedDate,
                PosterName = job.Poster.Name,
                InterestedCount = job.InterestedUsers.Count
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Poster")]
        public async Task<IActionResult> UpdateJob(int id, CreateJobDto dto)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            if (job.PosterId != CurrentUserId) return Forbid();
            job.Title = dto.Title;
            job.Body = dto.Body;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Poster")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            if (job.PosterId != CurrentUserId) return Forbid();
            _db.Jobs.Remove(job);
            await _db.SaveChangesAsync();
            return NoContent();
        }

   
        [HttpPost("{id}/interest")]
        [Authorize]
        public async Task<IActionResult> ExpressInterest(int id)
        {
            var job = await _db.Jobs
                .Include(j => j.Poster)
                .FirstOrDefaultAsync(j => j.Id == id && j.PostedDate >= DateTime.UtcNow.AddMonths(-2));

            if (job == null) return NotFound("Job not found or expired");

            var alreadyInterested = await _db.JobInterests
                .AnyAsync(ji => ji.JobId == id && ji.UserId == CurrentUserId);

            if (alreadyInterested)
                return BadRequest("You have already expressed interest in this job");

            _db.JobInterests.Add(new JobInterest
            {
                JobId = id,
                UserId = CurrentUserId,
                InterestedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();

            // ONLY NEW PART: Send real-time notification to the Poster
            var notification = new
            {
                type = "NewInterest",
                jobId = job.Id,
                jobTitle = job.Title,
                userName = CurrentUserName,
                message = $"{CurrentUserName} showed interest in your job!",
                timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients
                .Group($"User_{job.PosterId}")
                .SendAsync("ReceiveNotification", notification);

            return Ok("Interest recorded successfully");
        }

        [HttpGet("my")]
        [Authorize(Roles = "Poster")]
        public async Task<ActionResult> GetMyJobs()
        {
            var jobs = await _db.Jobs
                .Where(j => j.PosterId == CurrentUserId)
                .OrderByDescending(j => j.PostedDate)
                .Select(j => new
                {
                    id = j.Id,
                    title = j.Title,
                    body = j.Body,
                    postedDate = j.PostedDate,
                    interestedCount = j.InterestedUsers.Count
                })
                .ToListAsync();
            return Ok(jobs);
        }

        [HttpGet("my-interested-users")]
        [Authorize(Roles = "Poster")]
        public async Task<ActionResult> GetInterestedUsers()
        {
            var data = await _db.JobInterests
                .Include(ji => ji.User)
                .Include(ji => ji.Job)
                .Where(ji => ji.Job.PosterId == CurrentUserId)
                .OrderByDescending(ji => ji.InterestedAt)
                .Select(ji => new
                {
                    jobId = ji.Job.Id,
                    jobTitle = ji.Job.Title,
                    userName = ji.User.Name,
                    userEmail = ji.User.Email,
                    interestedAt = ji.InterestedAt
                })
                .ToListAsync();
            return Ok(data);
        }
    }
}