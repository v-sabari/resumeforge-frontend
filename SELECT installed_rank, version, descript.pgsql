SELECT installed_rank, version, description, script, success
FROM flyway_schema_history
ORDER BY installed_rank;