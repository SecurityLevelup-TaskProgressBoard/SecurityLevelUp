CREATE TABLE [Users] (
  [UserId] int,
  [UserName] nvarchar(255),
  [IconURL] nvarchar(255),
  PRIMARY KEY ([UserId])
);

CREATE TABLE [Boards] (
  [BoardId] int,
  [Status] nvarchar(255),
  PRIMARY KEY ([BoardId])
);

CREATE TABLE [Tasks] (
  [TaskId] int,
  [UserId] int,
  [BoardId] int,
  [TaskName] nvarchar(50),
  [TaskDescription] nvarchar(200),
  [Date] Datetime,
  [Deleted] bit,
  PRIMARY KEY ([TaskId]),
  FOREIGN KEY ([UserId]) REFERENCES Users([UserId]),
  FOREIGN KEY ([BoardId]) REFERENCES Boards([BoardId])
);
