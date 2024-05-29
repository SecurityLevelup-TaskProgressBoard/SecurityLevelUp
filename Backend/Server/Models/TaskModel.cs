using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class TaskModel
{
    public int TaskId { get; set; }

    public int? UserId { get; set; }

    public int? BoardId { get; set; }

    public string? TaskName { get; set; }

    public string? TaskDescription { get; set; }

    public DateTime? Date { get; set; }

    public bool? Deleted { get; set; }

    public virtual Board? Board { get; set; }

    public virtual User? User { get; set; }
}
