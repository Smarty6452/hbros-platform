using HandyBrosApi.Data;
using HandyBrosApi.DTOs;
using HandyBrosApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HandyBrosApi.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public JobsController(AppDbContext db) => _db = db;

        private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET: api/jobs?page=1&size=10&search=developer
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

        // POST: api/jobs → Only Poster role
        [HttpPost]
        [Authorize(Roles = "Poster")]
        public async Task<IActionResult> CreateJob(CreateJobDto dto)
        {
            var job = new Job
            {
                Title = dto.Title,
                Body = dto.Body,
                PosterId = CurrentUserId
            };

            _db.Jobs.Add(job);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
        }

        // GET: api/jobs/5
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

        // PUT: api/jobs/5 → Only the original Poster can edit
        [HttpPut("{id}")]
        [Authorize(Roles = "Poster")]
        public async Task<IActionResult> UpdateJob(int id, CreateJobDto dto)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null || job.PostedDate < DateTime.UtcNow.AddMonths(-2))
                return NotFound();

            if (job.PosterId != CurrentUserId)
                return Forbid("You can only edit your own jobs");

            job.Title = dto.Title;
            job.Body = dto.Body;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/jobs/5 → Only the original Poster can delete
        [HttpDelete("{id}")]
        [Authorize(Roles = "Poster")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _db.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            if (job.PosterId != CurrentUserId)
                return Forbid("You can only delete your own jobs");

            _db.Jobs.Remove(job);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/jobs/5/interest → Any logged-in user (Viewer or Poster)
        [HttpPost("{id}/interest")]
        [Authorize]
        public async Task<IActionResult> ExpressInterest(int id)
        {
            var job = await _db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.PostedDate >= DateTime.UtcNow.AddMonths(-2));
            if (job == null) return NotFound("Job not found or expired");

            var alreadyInterested = await _db.JobInterests
                .AnyAsync(ji => ji.JobId == id && ji.UserId == CurrentUserId);

            if (alreadyInterested)
                return BadRequest("Already expressed interest");

            _db.JobInterests.Add(new JobInterest
            {
                JobId = id,
                UserId = CurrentUserId
            });

            await _db.SaveChangesAsync();
            return Ok("Interest recorded");
        }

        // GET: api/jobs/my → Only Poster sees their own jobs (including old ones for editing)
        [HttpGet("my")]
        [Authorize(Roles = "Poster")]
        public async Task<ActionResult> GetMyJobs()
        {
            var jobs = await _db.Jobs
                .Where(j => j.PosterId == CurrentUserId)
                .OrderByDescending(j => j.PostedDate)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Body,
                    j.PostedDate,
                    InterestedCount = j.InterestedUsers.Count
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // GET: api/jobs/my-interested-users → Poster sees who is interested in their jobs
        [HttpGet("my-interested-users")]
        [Authorize(Roles = "Poster")]
        public async Task<ActionResult> GetInterestedUsers()
        {
            var data = await _db.JobInterests
                .Include(ji => ji.User)
                .Include(ji => ji.Job)
                .Where(ji => ji.Job.PosterId == CurrentUserId)
                .Select(ji => new
                {
                    JobId = ji.Job.Id,
                    JobTitle = ji.Job.Title,
                    UserName = ji.User.Name,
                    UserEmail = ji.User.Email,
                    InterestedAt = ji.InterestedAt
                })
                .ToListAsync();

            return Ok(data);
        }
    }
}