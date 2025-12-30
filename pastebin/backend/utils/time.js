export function getNow(req) {
  if (process.env.TEST_MODE === '1') {
    const testNow = req.headers['x-test-now-ms'];
    if (testNow !== undefined) {
      return new Date(Number(testNow));
    }
  }
  return new Date();
}
