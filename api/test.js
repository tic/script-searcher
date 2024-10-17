import { handler } from "./lambda.js";

const show = 'Seinfeld';
const query = 'there is nothing dirtier than a big ball of oil';

const response = await handler({ body: { show, query } });

if (response.statusCode !== 200) {
  console.warn('Expected a successful response, got HTTP', response.statusCode);
  process.exit(1);
}

const data = JSON.parse(response.body);
console.log('Returned items:', data.length);
console.log('Titles:', data.map((d) => d.title));
