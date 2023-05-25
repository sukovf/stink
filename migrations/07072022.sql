CREATE TABLE stink_nature (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB;
ALTER TABLE report ADD stink_nature_id INT NOT NULL, CHANGE comment comment VARCHAR(2048) DEFAULT NULL;
UPDATE report SET stink_nature_id = 1 WHERE id > 1;
ALTER TABLE report ADD CONSTRAINT FK_C42F77849D1C1690 FOREIGN KEY (stink_nature_id) REFERENCES stink_nature (id);
CREATE INDEX IDX_C42F77849D1C1690 ON report (stink_nature_id);