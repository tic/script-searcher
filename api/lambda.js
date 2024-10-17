import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import { badRequest, success, error } from './responses.js';

config();

console.info('Connecting to database...');
const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
await client.connect();
const scripts = client.db('main').collection('scripts');
console.info('Connected!');

export const handler = async (event) => {
  try {
    const req = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  
    console.log('Show:', req.show);
    console.log('Query:', req.query);
  
    if (!req.show || !req.query || !req.show.length || !req.query.length) {
      return badRequest('Must provide body parameters `show` and `query`.');
    }
  
    const pipeline = [
      {
        $search: {
          compound: {
            must: [
              {
                text: {
                  path: 'show',
                  query: req.show,
                  score: { constant: { value: 0 } },
                },
              },
              {
                text: {
                  path: 'script',
                  query: req.query,
                },
              },
            ],
          },
        },
      },
      { $set: { score: { $meta: 'searchScore' } } },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ];
  
    const results = await scripts.aggregate(pipeline).toArray();
    return success(results);
  } catch (err) {
    return error(err);
  }
};
