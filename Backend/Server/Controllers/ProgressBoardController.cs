using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Models.Dtos;
using Server.Models.Helpers;
using Server.Services;
using System.Security.Claims;

namespace Server.Controllers
{
	[Authorize]
	[ApiController]
	[EnableCors("AllowSpecificOrigin")]
	[Route("ProgressBoard")]
	public class ProgressBoardController : ControllerBase
	{
		private readonly ILogger<ProgressBoardController> _logger;
		private readonly IProgressBoardService _progressBoardService;
        private readonly ITokenService _tokenService;

		public ProgressBoardController(ILogger<ProgressBoardController> logger, IProgressBoardService progressBoardService, ITokenService tokenService)
		{
			_logger = logger;
			_progressBoardService = progressBoardService;
			_tokenService = tokenService;
		}

        [HttpGet("email")]
        public IActionResult GetEmail()
        {
            var email = _tokenService.GetEmail(User);
            return Ok(new { Email = email });
        }

        [Authorize]
		[HttpGet("UserTasks/{UserId}")]
		public async Task<IActionResult> GetUserTasks(int UserId)
		{
			try
			{
				var email = _tokenService.GetEmail(User);
				var result = await _progressBoardService.GetUserTasks(UserId);
				return Ok(result);
			}
			catch (Exception ex)
			{
                return BadRequest(ex.Message);
			}


		}

		[Authorize]
		[HttpPut("UpdateTask")]
		public async Task<IActionResult> UpdateTask([FromBody] TaskUpdate taskUpdate)
		{
			try
			{
				var result = await _progressBoardService.UpdateTask(taskUpdate.TaskId, taskUpdate.NewStatus, taskUpdate.NewDescription, taskUpdate.NewName);
				return Ok(result);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[Authorize]
		[HttpPost("AddTask")]
		public async Task<IActionResult> AddTask([FromBody] TaskDto newTask)
		{
			try
			{
				var result = await _progressBoardService.AddTask(newTask);
				return Ok(result);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}

		[Authorize]
		[HttpPut("DeleteTask/{TaskId}")]
		public async Task<IActionResult> DeleteTask(int TaskId)
		{
			try
			{
				var result = await _progressBoardService.DeleteTask(TaskId);
				return Ok(result);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
    }
}
