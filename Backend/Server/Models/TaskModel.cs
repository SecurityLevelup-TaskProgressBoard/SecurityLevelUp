using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Server.Models;

public partial class TaskModel
{
    [Key]
    public int TaskId { get; set; }

    public int UserId { get; set; }

    public int BoardId { get; set; }

    [StringLength(50)]
    public string TaskName { get; set; } = null!;

    [StringLength(200)]
    public string TaskDescription { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime Date { get; set; }

    public bool Deleted { get; set; }

    [ForeignKey("BoardId")]
    [InverseProperty("Tasks")]
    public virtual Board Board { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Tasks")]
    public virtual User User { get; set; } = null!;
}
