import { drizzle } from "drizzle-orm/postgres-js"



import postgres from "postgres";


const client = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })
export const db = drizzle(client)


