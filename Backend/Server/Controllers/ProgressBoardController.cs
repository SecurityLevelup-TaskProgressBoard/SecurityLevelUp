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
		public async Task<IActionResult> GetUserTasks(int UserId)
		{
			try
			{
				var result = await _progressBoardService.GetUserTasks(UserId);
				return Ok(result);
			}
			catch(Exception ex)
			{
				return BadRequest(ex.Message);
			}


		}

		[HttpPut("UpdateTask")]
		public async Task<IActionResult> UpdateTask([FromBody] TaskUpdate taskUpdate)
		{
			try
			{
				var result = await _progressBoardService.UpdateTask(taskUpdate.TaskId, taskUpdate.NewStatus, taskUpdate.NewDescription, taskUpdate.NewName);
				return Ok(result);
			}
			catch(Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpPost("AddTask")]
		public async Task<IActionResult> AddTask([FromBody] TaskDto newTask)
		{
			try
			{
				var result = await _progressBoardService.AddTask(newTask);
				return Ok(result);
			}
			catch(Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[HttpPut("DeleteTask/{TaskId}")]
		public async Task<IActionResult> DeleteTask(int TaskId)
		{
			try
			{
				var result = await _progressBoardService.DeleteTask(TaskId);
				return Ok(result);
			}
			catch(Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
	}
}
