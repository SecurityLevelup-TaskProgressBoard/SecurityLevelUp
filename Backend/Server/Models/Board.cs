using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class Board
{
    public int BoardId { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
}
