const redis = require('redis');
const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

checkCache = (req, res, next) => {
    const { id } = req.params;
    console.log("checking cache")
    
    //get data value for key =id
    redis_client.get(id, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        //if no match found
        if (data != null) {
            res.send(data);
        } 
        else {
            //proceed to next middleware function
            next(); 
        }
    });
};