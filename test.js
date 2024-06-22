const bcrypt = require("bcrypt");

function hashApiKey(apiKey) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(apiKey, saltRounds);
    return hash;
}

const hashedApiKey = hashApiKey("ep-key-RhYZTTP-7PvLLVR3CD3auY24_rU6kJFX");

console.log(hashedApiKey);