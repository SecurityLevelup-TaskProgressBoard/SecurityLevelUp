using Server.Models;
using Server.Models.Dtos;

namespace Server.Services
{
	public interface IProgressBoardService
	{
		Task<TaskDto> AddTask(TaskModel newTask);
		Task<bool> DeleteTask(int taskId);
		Task<List<TaskDto>> GetUserTasks(int userId);
		Task<TaskDto> UpdateTask(int taskId, string newStatus);
	}
}