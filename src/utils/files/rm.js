const fs = require("fs-extra");

module.exports = async function rm (path) {
    if(fs.existsSync(path)) {
        await fs.rm(path);
        return true;
    } else if(fs.existsSync(`data/${path}`)) {
        await fs.rm(`data/${path}`);
        return true;
    } else if(fs.existsSync(`data/${path}.1`)) {
        await fs.rm(`data/${path}.1`);
        await fs.rm(`data/${path}.2`);
        return true;
    } 
    return false;
    
};
