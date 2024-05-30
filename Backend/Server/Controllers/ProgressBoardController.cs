using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Models.Dtos;
using Server.Models.Helpers;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
	[EnableCors("AllowSpecificOrigin")]
	[Route("ProgressBoard")]
	public class ProgressBoardController : ControllerBase
	{
		private readonly ILogger<ProgressBoardController> _logger;
		private readonly IProgressBoardService _progressBoardService;

		public ProgressBoardController(ILogger<ProgressBoardController> logger, IProgressBoardService progressBoardService)
		{
			_logger = logger;
			_progressBoardService = progressBoardService;
		}

		[HttpGet("UserTasks/{UserId}")]
		public async Task<IEnumerable<TaskDto>> GetUserTasks(int UserId)
		{
			var result = await _progressBoardService.GetUserTasks(UserId);
			return result;
		}

		[HttpPut("UpdateTask")]
		public async Task<TaskDto> UpdateTask([FromBody] TaskUpdate taskUpdate)
		{
			// Get Task from DB
			// Set new Status
			// Save changes
			// Return task
			var result = await _progressBoardService.UpdateTask(taskUpdate.TaskId, taskUpdate.NewStatus);
			return result;
		}

		[HttpPost("AddTask")]
		public async Task<TaskDto> AddTask([FromBody] TaskDto newTask)
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
