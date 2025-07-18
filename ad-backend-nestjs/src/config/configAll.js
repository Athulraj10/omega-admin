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
        console.error('\x1b[33m', '💡 For development, you can use placeholder values:');
        console.error('\x1b[33m', 'AMZ_ACCESS_KEY=dev-access-key');
        console.error('\x1b[33m', 'AMZ_SECRET_ACCESS_KEY=dev-secret-key');
        console.error('\x1b[33m', 'AMZ_REGION=us-east-1');
        console.error('\x1b[33m', 'AMZ_BUCKET=dev-bucket');
        console.error('\x1b[33m', 'AMZ_BUCKET_URL=https://dev-bucket.s3.amazonaws.com');
        console.error('\x1b[0m', '');
        process.exit(1);
    }

    console.log('\x1b[32m', '✅ All required environment variables are present');
    console.log('\x1b[0m', '');
}

const requiredENV = ['NODE_ENV', 'PORT', "MONGO_CONNECTION_STRING"];

validateEnv(requiredENV);

const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_CONNECTION_STRING,
    // AWS S3 - optional for development
    aws: {
        accessKey: process.env.AMZ_ACCESS_KEY || 'dev-access-key',
        secretKey: process.env.AMZ_SECRET_ACCESS_KEY || 'dev-secret-key',
        region: process.env.AMZ_REGION || 'us-east-1',
        bucket: process.env.AMZ_BUCKET || 'dev-bucket',
        bucketUrl: process.env.AMZ_BUCKET_URL || 'https://dev-bucket.s3.amazonaws.com',
    },
    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '6h',
    },
    // Rate limiting
    throttle: {
        ttl: process.env.THROTTLE_TTL || 60,
        limit: process.env.THROTTLE_LIMIT || 100,
    }
};

module.exports = { config }; 