const cassandra = require("cassandra-driver");

class DB {    
    public db = new cassandra.Client({ 
        contactPoints: ["127.0.0.1"], 
        protocolOptions: { port: 9042 }, 
        localDataCenter: "datacenter1"
    });   
}

export default new DB().db;
