
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to database...');
        await prisma.$connect();
        console.log('Connected successfully.');

        console.log('Attempting to create a test user...');
        const user = await prisma.user.create({
            data: {
                email: `test-${Date.now()}@example.com`,
                passwordHash: 'test-hash',
            },
        });
        console.log('User created:', user);

        console.log('Attempting to delete the test user...');
        await prisma.user.delete({
            where: { id: user.id },
        });
        console.log('User deleted successfully.');
    } catch (error) {
        console.error('Error during database test:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
