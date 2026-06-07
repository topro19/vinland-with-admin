const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.siteContent.findMany().then(c => {
  console.log(JSON.stringify(c, null, 2));
  prisma.$disconnect();
}).catch(e => {
  console.error(e);
  prisma.$disconnect();
});
