CREATE TABLE [Users] (
  [UserId] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [UserName] nvarchar(255) NOT NULL,
);

CREATE TABLE [Boards] (
  [BoardId] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [Status] nvarchar(255) NOT NULL,
);

CREATE TABLE [Tasks] (
  [TaskId] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [UserId] int NOT NULL,
  [BoardId] int NOT NULL,
  [TaskName] nvarchar(50) NOT NULL,
  [TaskDescription] nvarchar(200) NOT NULL,
  [Date] Datetime NOT NULL,
  [Deleted] bit NOT NULL,
  FOREIGN KEY ([UserId]) REFERENCES Users([UserId]),
  FOREIGN KEY ([BoardId]) REFERENCES Boards([BoardId])
);