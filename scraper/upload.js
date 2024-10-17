import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';

const show = 'Stargate SG1';

config();

console.info('Connecting to database...');
const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
await client.connect();

console.info('Connected!');

let pendingWrites = [];
const batchedInsert = async (doc) => {
  if (doc) {
    pendingWrites.push({
      updateOne: {
        filter: {
          show,
          title: doc.title,
        },
        update: {
          $set: doc,
        },
        upsert: true,
      },
    });
  }

  if (doc === undefined || pendingWrites.length > 99) {
    console.info('Uploading batch...');
    await client.db('main').collection('scripts').bulkWrite(pendingWrites);
    pendingWrites = [];
    console.info('Batch complete');
  }
};

for (const path of fs.readdirSync(`./scripts/${show}`)) {
  const fqp = `./scripts/${show}/${path}`;
  console.info(fqp);
  const contents = fs.readFileSync(fqp, 'utf8');
  await batchedInsert(JSON.parse(contents));
}

await batchedInsert();
await client.close();

console.info('\nDone!');
