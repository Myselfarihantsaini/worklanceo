CREATE TABLE `resume_chunks` (
  `resume_key` text NOT NULL,
  `owner` text NOT NULL,
  `chunk_index` integer NOT NULL,
  `data` blob NOT NULL,
  `created` integer NOT NULL,
  PRIMARY KEY (`resume_key`, `chunk_index`)
);

CREATE INDEX `idx_resume_chunks_owner_key`
  ON `resume_chunks` (`owner`, `resume_key`);
