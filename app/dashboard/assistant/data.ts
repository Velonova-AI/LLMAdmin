//
// import { drizzle } from 'drizzle-orm/node-postgres';
//
// import { assistants } from '@/lib/db/schema';
// import { desc, eq, or, ilike } from 'drizzle-orm';
// import {Pool} from "pg";
//
//
// if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL environment variable is not set")
// }
//
// // Create a new PostgreSQL connection pool
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// })
//
// // Create a Drizzle ORM instance with the pool
// export const db = drizzle(pool)
//
// const ITEMS_PER_PAGE = 6;
//
// export async function fetchFilteredAssistants2(
//     query: string,
//     currentPage: number,
// ) {
//     const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//
//     try {
//         const filteredAssistants = await db
//             .select()
//             .from(assistants)
//             .where(or(
//                 ilike(assistants.name, `%${query}%`),
//                 ilike(assistants.description, `%${query}%`),
//                 ilike(assistants.provider, `%${query}%`),
//                 ilike(assistants.modelName, `%${query}%`),
//                 ilike(assistants.type, `%${query}%`)
//             ))
//             .orderBy(desc(assistants.createdAt))
//             .limit(ITEMS_PER_PAGE)
//             .offset(offset);
//
//         return filteredAssistants;
//     } catch (error) {
//         console.error('Database Error:', error);
//         throw new Error('Failed to fetch assistants.');
//     }
// }