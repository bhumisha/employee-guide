const showBanner = require('node-banner');
const controller = require('./controller/employeeOperations');

console.table("Employee Guide!!");

(async () => {
    await showBanner('Employee Guide', "View employee's detail and perform several operations.");
})();
 