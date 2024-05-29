namespace Server.Models.Dtos
{
	public class TaskDto
	{
		public int TaskId { get; set; }

		public int? UserId { get; set; }

		public string? Status { get; set; }

		public string? TaskName { get; set; }

		public string? TaskDescription { get; set; }

		public DateTime? Date { get; set; }

		public bool? Deleted { get; set; }
	}
}
