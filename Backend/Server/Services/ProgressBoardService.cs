using Server.Models;
using Server.Models.Dtos;

namespace Server.Services
{
	public class ProgressBoardService : IProgressBoardService
	{
		public async Task<List<TaskDto>> GetUserTasks(int userId)
		{
			// Delete these. Only here for now
			var userTitles = new List<string>() { "Card Title", "Spiderman sighted in brooklyn swinging from webs", "A Card Title that is very long and too long actually", "Last One" };
			var userDescriptions = new List<string>() { "This is a description of the card. It provides some information about the content of the card.", "The dog needs to be washed and groomed. Remember to buy new shampoo as well, and to use luke warm water. The dog needs to be washed and groomed. Remember to buy new shampoo as well, and to use luke warm water.", "This is a description of the card. It provides some information about the content of the card.", "Last descitpion of what happened" };
			var userDates = new List<DateTime>() {
				new DateTime(2024, 5, 27, 17, 00, 0),
				new DateTime(2024, 5, 25, 09, 00, 0),
				new DateTime(2024, 5, 28, 10, 40, 0),
				new DateTime(2024, 5, 15, 21, 55, 0)
			};
			var userStatus = new List<string>() { "ToDo", "In Progress", "Done", "ToDo" };  // TODO: <-- This needs to be mapped from the int boardId to Status somehow
			var userTaskIds = new List<int>() { 1, 2, 3, 4 };
			// Until here

			var answer = new List<TaskDto>();
			for(int i = 0; i < 4; i++)
			{
				var tempTask = new TaskDto()
				{
					TaskId = userTaskIds.ElementAt(i),
					UserId = 1,
					Status = userStatus.ElementAt(i),
					TaskName = userTitles.ElementAt(i),
					TaskDescription = userDescriptions.ElementAt(i),
					Date = userDates.ElementAt(i),
					Deleted = false
				};
				answer.Add(tempTask);
			}
			return answer;
		}

		public async Task<TaskDto> UpdateTask(int taskId, string newStatus)
		{
			var answer = new TaskDto();
			return answer;
		}

		public async Task<TaskDto> AddTask(TaskModel newTask)
		{
			var answer = new TaskDto()
			{
				TaskId = 1,
				UserId = 1,
				Status = "To do",
				TaskName = "Add DB Conn",
				TaskDescription = "ASAP",
				Date = DateTime.Now,
				Deleted = false
			};
			return answer;
		}

		public async Task<bool> DeleteTask(int taskId)
		{
			return true;
		}
	}
}
