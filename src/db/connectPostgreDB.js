import { getEnv } from '../helpers/getEnv.js';
import { ENV_VARS } from '../constants/env.js';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = getEnv(ENV_VARS.postgre.URL);

const pool = new pg.Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
