# Add Complaint entity to JPA
ALTER TABLE IF EXISTS complaint DROP CONSTRAINT IF EXISTS pk_complaint;
DROP TABLE IF EXISTS complaint;
CREATE TABLE complaint (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    content TEXT,
    status VARCHAR(32),
    admin_comment TEXT,
    created_at TIMESTAMP,
    closed_at TIMESTAMP
);
