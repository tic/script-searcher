const buildResponseWithHeaders = (statusCode, response) => ({
  statusCode,
  body: JSON.stringify(response),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
});

export const success = (response) => buildResponseWithHeaders(200, response);
export const badRequest = (reason) => buildResponseWithHeaders(400, { message: reason });
export const error = (err) => {
  console.error(err);
  return buildResponseWithHeaders(500, { message: 'Unknown error' });
};
