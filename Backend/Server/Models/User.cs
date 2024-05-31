using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

public partial class User
{
    [Key]
    public int UserId { get; set; }

    [StringLength(255)]
    public string UserName { get; set; } = null!;

    [StringLength(255)]
    public string IconURL { get; set; } = null!;

    [InverseProperty("User")]
    public virtual ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
}
