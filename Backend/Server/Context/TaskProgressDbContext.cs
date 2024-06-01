using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Context;

namespace Server.Context;

public partial class TaskProgressDBContext : DbContext
{
	public TaskProgressDBContext()
	{
	}

	public TaskProgressDBContext(DbContextOptions<TaskProgressDBContext> options)
		: base(options)
	{
	}

	public virtual DbSet<Board> Boards { get; set; }

	public virtual DbSet<TaskModel> Tasks { get; set; }

	public virtual DbSet<User> Users { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Board>(entity =>
		{
			entity.HasKey(e => e.BoardId).HasName("PK__Boards__F9646BF2EEF3E3A6");
		});

		modelBuilder.Entity<TaskModel>(entity =>
		{
			entity.HasKey(e => e.TaskId).HasName("PK__Tasks__7C6949B1D0C22D01");

			entity.HasOne(d => d.Board).WithMany(p => p.Tasks)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK__Tasks__BoardId__5BE2A6F2");

			entity.HasOne(d => d.User).WithMany(p => p.Tasks)
				.OnDelete(DeleteBehavior.ClientSetNull)
				.HasConstraintName("FK__Tasks__UserId__5AEE82B9");
		});

		modelBuilder.Entity<User>(entity =>
		{
			entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C62D21B87");
		});

		OnModelCreatingPartial(modelBuilder);
	}

	partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
