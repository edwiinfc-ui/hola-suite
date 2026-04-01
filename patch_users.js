const fs = require('fs');
let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
users[0] = { ...users[0], username: "admin@holasuite.com", password: "hola2025" };
fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
