try {
  new URL("123");
}
catch (error) {
  console.error(error instanceof Error);
  console.error(error.name);
  console.error(error.__proto__ === TypeError.prototype);
  console.error(error.__proto__.__proto__ === Error.prototype);
}