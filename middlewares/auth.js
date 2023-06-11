const jwt = require("jsonwebtoken");

exports.authenticated = (req, res, next) => {
    const authHeader = req.get('Authorization');
    try {
        if(!authHeader){
            res.json({message:" asمجوز کافی ندارید"});
            // console.log("مجوز");
        }

        const token = authHeader.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            res.json({message:"asشما مجوز کافی ندارید"});
            // console.log("مجوز2");
        }
        console.log("log in auth:" ,decodedToken);
        req.body.userId = decodedToken.user.userId;
        next();
console.log(req.userId);
    } catch (error) {
        res.json({message:"as error" + error});
        console.log("ارور");
    }
};
