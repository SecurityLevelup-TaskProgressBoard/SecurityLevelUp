using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Models.Helpers;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
	[Route("ProgressBoard")]
	public class ProgressBoardController : ControllerBase
	{
		private static readonly string[] Summaries = new[]
		{
			"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
		};

		private readonly ILogger<ProgressBoardController> _logger;
		private readonly IProgressBoardService _progressBoardService;

		public ProgressBoardController(ILogger<ProgressBoardController> logger, IProgressBoardService progressBoardService)
		{
			_logger = logger;
			_progressBoardService = progressBoardService;
		}

		[HttpGet("UserTasks/{UserId}")]
		public async Task<IEnumerable<TaskModel>> GetUserTasks(int UserId)
		{
			var result = await _progressBoardService.GetUserTasks(UserId);
			return result;
		}

		[HttpPut("UpdateTask")]
		public async Task<TaskModel> UpdateTask([FromBody] TaskUpdate taskUpdate)
		{
			// Get Task from DB
			// Set new Status
			// Save changes
			// Return task
			var result = await _progressBoardService.UpdateTask(taskUpdate.TaskId, taskUpdate.NewStatus);
			return result;
		}

		[HttpPost("AddTask")]
		public async Task<TaskModel> AddTask([FromBody] TaskModel newTask)
		{
			var result = await _progressBoardService.AddTask(newTask);
			return result;
		}

		[HttpPut("DeleteTask/{TaskId}")]
		public async Task<bool> DeleteTask(int TaskId)
		{
			var result = await _progressBoardService.DeleteTask(TaskId);
			return result;
		}
	}
}
