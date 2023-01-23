export default function handler(
  lambda, //lambda
) {
  return async function (event, context) {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 202;
    } catch (e: any) { //Error
      console.error(e);
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    const response = { statusCode, body: JSON.stringify(body) };

    return response;
  };
}
