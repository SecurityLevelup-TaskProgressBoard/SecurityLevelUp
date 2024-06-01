namespace Server.Models.Helpers
{
	public partial class TaskUpdate
	{
		public int TaskId { get; set; }
		public string? NewStatus { get; set; }
		public string? NewDescription { get; set; }
		public string? NewName { get; set; }
	}
}
