using Microsoft.EntityFrameworkCore;
using Server.Context;
using Server.Models;
using Server.Models.Dtos;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using System.Threading.Tasks.Sources;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Server.Services
{
	public class ProgressBoardService : IProgressBoardService
	{
		private readonly TaskProgressDBContext _progressDBContext;

		public ProgressBoardService(TaskProgressDBContext progressDBContext)
		{
			_progressDBContext = progressDBContext;
		}

		public async Task<List<TaskDto>> GetUserTasks(int userId)
		{
			var userTasks = await _progressDBContext.Tasks
							.Include(t => t.Board)
							.Include(t => t.User)
							.Where(t => t.UserId == userId && !t.Deleted)
							.ToListAsync();

			var tasksDto = new List<TaskDto>();
			foreach(var task in userTasks)
			{
				var newDto = TaskModelToTaskDto(task);
				tasksDto.Add(newDto);
			};
			return tasksDto;
		}

		public async Task<TaskDto> UpdateTask(int taskId, string newStatus)
		{
			var taskToUpdate = _progressDBContext.Tasks.Include(t=>t.Board).FirstOrDefault(t => t.TaskId == taskId);
			if(taskToUpdate == null)
				throw new Exception($"Task {taskId} does not exist.");

			// Get boardID for new status
			var newBoard = _progressDBContext.Boards.FirstOrDefault(t => t.Status == newStatus);

			if(newBoard == null)
				throw new Exception($"Status {newStatus} does not exist");

			taskToUpdate.BoardId = newBoard.BoardId;
			await _progressDBContext.SaveChangesAsync();
			var answer = TaskModelToTaskDto(taskToUpdate);
			return answer;
		}

		public async Task<TaskDto> AddTask(TaskModel newTask)
		{
			_progressDBContext.Tasks.Add(newTask);
			var answer = TaskModelToTaskDto(newTask);
			await _progressDBContext.SaveChangesAsync();
			return answer;
		}

		public async Task<bool> DeleteTask(int taskId)
		{
			var taskToDelete = _progressDBContext.Tasks.FirstOrDefault(t => t.TaskId == taskId);
			if(taskToDelete != null)
			{
				taskToDelete.Deleted = true;
				await _progressDBContext.SaveChangesAsync();
				return true;
			}
			else
			{
				throw new Exception($"Task {taskId} does not exist.");
			}
		}

		private TaskDto TaskModelToTaskDto(TaskModel inputTask)
		{
			var answer = new TaskDto()
			{
				TaskId = inputTask.TaskId,
				UserId = inputTask.UserId,
				Status = inputTask.Board.Status,
				TaskName = inputTask.TaskName,
				TaskDescription = inputTask.TaskDescription,
				Date = inputTask.Date,
				Deleted = inputTask.Deleted
			};
			return answer;
		}
	}
}
