const password = process.env.SHOWCASE_TEST_PASSWORD ?? "";
console.log(JSON.stringify({ present: Boolean(password), length: password.length, starts: password.slice(0, 4), ends: password.slice(-4) }));
