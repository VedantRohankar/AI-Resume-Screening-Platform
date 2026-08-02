import db from '../config/db.js';

export const getDashboardStats = async () => {
  const result = await db.query(
    `SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM users WHERE role = 'candidate') AS candidates,
      (SELECT COUNT(*) FROM users WHERE role = 'recruiter') AS recruiters,
      (SELECT COUNT(*) FROM companies) AS companies,
      (SELECT COUNT(*) FROM jobs) AS jobs,
      (SELECT COUNT(*) FROM applications) AS applications;
    `);

    return result.rows[0];
};

