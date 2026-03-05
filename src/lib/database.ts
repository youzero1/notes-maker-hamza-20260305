import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { NoteEntity } from '@/entities/Note';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './data/notes.db';
  const resolvedPath = path.resolve(process.cwd(), dbPath);
  const dbDir = path.dirname(resolvedPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedPath,
    entities: [NoteEntity],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
  });

  await dataSource.initialize();
  return dataSource;
}

export async function getNoteRepository() {
  const ds = await getDataSource();
  return ds.getRepository(NoteEntity);
}
