using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Server.Context;

namespace Server.Context;

public partial class TaskProgressDbContext : DbContext
{
    public TaskProgressDbContext()
    {
    }

    public TaskProgressDbContext(DbContextOptions<TaskProgressDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Board> Boards { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        RegisterDb(optionsBuilder);
    }
        

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Board>(entity =>
        {
            entity.HasKey(e => e.BoardId).HasName("PK__Boards__F9646BF2A2074E7D");

            entity.Property(e => e.BoardId).ValueGeneratedNever();
            entity.Property(e => e.Status).HasMaxLength(255);
        });

        modelBuilder.Entity<TaskModel>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Tasks__7C6949B1D5312E3B");

            entity.Property(e => e.TaskId).ValueGeneratedNever();
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.TaskDescription).HasMaxLength(200);
            entity.Property(e => e.TaskName).HasMaxLength(50);

            entity.HasOne(d => d.Board).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.BoardId)
                .HasConstraintName("FK__Tasks__BoardId__5165187F");

            entity.HasOne(d => d.User).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Tasks__UserId__5070F446");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CA89924EC");

            entity.Property(e => e.UserId).ValueGeneratedNever();
            entity.Property(e => e.IconUrl)
                .HasMaxLength(255)
                .HasColumnName("IconURL");
            entity.Property(e => e.UserName).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
