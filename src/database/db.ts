import pgPromise from "pg-promise";
import { IMain, IDatabase } from 'pg-promise';

const cn: string = process.env.DATABASE_URL ?? '';
const pgp: IMain = pgPromise();
const db: IDatabase<any> = pgp(cn);

export default db;
