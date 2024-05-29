using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

public partial class Board
{
    [Key]
    public int BoardId { get; set; }

    [StringLength(255)]
    public string Status { get; set; } = null!;

    [InverseProperty("Board")]
    public virtual ICollection<TaskModel> Tasks { get; set; } = new List<TaskModel>();
}
