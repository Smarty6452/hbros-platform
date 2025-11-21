namespace HandyBrosApi.DTOs
{
    public class JobResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public string PosterName { get; set; } = string.Empty;
        public int InterestedCount { get; set; }
    }
}