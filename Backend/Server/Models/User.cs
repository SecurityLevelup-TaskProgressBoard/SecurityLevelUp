using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? UserName { get; set; }

    public string? IconUrl { get; set; }

    public virtual ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
}
