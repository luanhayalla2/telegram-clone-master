try {
  console.log('Attempting to require @expo/cli...');
  const cli = require('@expo/cli');
  console.log('Success!');
} catch (e) {
  console.error('Failed with error trace:');
  console.error(e.stack);
  console.error('Error Code:', e.code);
}
