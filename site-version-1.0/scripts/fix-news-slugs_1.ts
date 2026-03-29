import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { normalizeDatabaseUrl } from '../lib/database-url';
import { slugify } from '../lib/slug';

normalizeDatabaseUrl();

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: 'asc' },
  });

  for (const post of posts) {
    const nextSlug = slugify(post.slug || post.title);

    if (nextSlug && nextSlug !== post.slug) {
      await prisma.newsPost.update({
        where: { id: post.id },
        data: { slug: nextSlug },
      });

      console.log(`${post.title} -> ${nextSlug}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
