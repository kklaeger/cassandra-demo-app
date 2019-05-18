import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/Routes";
import * as log from "npmlog";
import db from "./db";

const cors = require("cors"); 

class App {

    public app: express.Application;
    public routes: Routes = new Routes();
    
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.initCassandraDB()
        this.config();        
        this.routes.initRoutes(this.app);    
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private initCassandraDB() {
        const keyspace_name = "digital_museum";
        const table_name = "person";

        const cql_create_keyspace = "CREATE KEYSPACE IF NOT EXISTS " + keyspace_name + " WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true";
        const cql_use_keyspace = "USE " + keyspace_name;  
        const cql_create_table = "CREATE TABLE IF NOT EXISTS " + table_name + " (ID int, name text, birthday date, place text, quotations list<frozen<map<text,date>>>, PRIMARY KEY(ID));";



        db.execute(cql_create_keyspace, (err, result) => {
            if (err) {
                log.error("CassandraDB", "Connection Error", err.message);
            } else {
                if(result) {
                    log.info("CassandraDB", "Created Keyspace " + keyspace_name);
                    db.execute(cql_use_keyspace, (err, result) => {
                        if (err) {
                            log.error("CassandraDB", "Connection Error", err.message);
                        } else {
                            if(result) {
                                log.info("CassandraDB", "Use Keyspace " + keyspace_name);
                                db.execute(cql_create_table, (err, result) => {
                                    if (err) {
                                        log.error("CassandraDB", "Connection Error", err.message);
                                    } else {
                                        if(result) {
                                            log.info("CassandraDB", "Created table " + table_name);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }

}

export default new App().app;