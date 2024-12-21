const jwtToken = require("jsonwebtoken");

const generateToken = (id)=>{
    return jwtToken.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
};

module.exports = generateToken;