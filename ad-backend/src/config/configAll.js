function validateEnv(requiredVars) {
    const missingVars = [];

    requiredVars.forEach((varName) => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        console.error('\x1b[31m', '❌ Missing required environment variables:');
        missingVars.forEach((varName) => {
            console.error('\x1b[31m', `- ${varName}`);
        });
        console.error('\x1b[0m', '');
        process.exit(1);
    }

    console.log('\x1b[32m', '✅ All required environment variables are present');
    console.log('\x1b[0m', '');
}

const requiredENV = ['NODE_ENV', 'PORT', "AMZ_ACCESS_KEY", "MONGO_CONNECTION_STRING",
    "AMZ_SECRET_ACCESS_KEY",
    "AMZ_REGION",
    "AMZ_BUCKET",
    "AMZ_BUCKET_URL"];

validateEnv(requiredENV);

export const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_CONNECTION_STRING,
};