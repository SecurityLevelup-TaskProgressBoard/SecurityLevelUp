using Server.Models;

namespace Server.Services
{
	public interface IProgressBoardService
	{
		Task<TaskModel> AddTask(TaskModel newTask);
		Task<bool> DeleteTask(int taskId);
		Task<List<TaskModel>> GetUserTasks(int userId);
		Task<TaskModel> UpdateTask(int taskId, string newStatus);
	}
}