/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:GW7j8MVRFSAs@ep-morning-rice-a52ylh3x.us-east-2.aws.neon.tech/PrepMate_db?sslmode=require',
    }
  };