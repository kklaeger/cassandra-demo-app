import { Request, Response } from "express";
import * as log from "npmlog";
import db from "../db";

export class PeopleController {

    public getPeople (req: Request, res: Response) {

        const cql = "SELECT * FROM person;";
        
        db.execute(cql, (err, result) => {
            if (err) {
                log.error("CassandraDB", "Connection Error", err.message);
            } else {
                if(result) {
                    log.info("CassandraDB", "Found " + result.rows.length + " people");
                    res.send(result.rows);
                }
            }
        });
    }

    public addPerson (req: Request, res: Response) {

        const name = req.body.name.trim();
        const birthday = req.body.birthday;
        const place = req.body.place.trim();

        const cql_create_person = "INSERT INTO person (id, name, birthday, place) VALUES (?,?,?,?);";
        const cql_get_id = "SELECT next_id FROM ids WHERE id_name = 'person_id';";
        const cql_update_id = "UPDATE ids SET next_id = ? WHERE id_name = 'person_id' IF next_id = ?;";
        
        db.execute(cql_get_id, (err_get_id, result_get_id) => {
            if (err_get_id) {
                log.error("CassandraDB", "Connection Error", err_get_id.message);
            } else {
                if(result_get_id) {
                    let old_id = parseInt(result_get_id.rows[0].next_id);
                    let new_id = old_id + 1;
                    db.execute(cql_create_person, [old_id, name, birthday, place], { prepare : true }, (err_create_person, result_create_person) => {
                        if (err_create_person) {
                            log.error("CassandraDB", "Connection Error", err_create_person.message);
                        } else {
                            if(result_create_person) {
                                log.info("CassandraDB", "Added person " + name);
                                db.execute(cql_update_id, [new_id, old_id], { prepare : true }, (err_update_id, result_update_id) => {
                                    if (err_update_id) {
                                        log.error("CassandraDB", "Connection Error", err_update_id.message);
                                    } else {
                                        if(result_update_id) {
                                            log.info("CassandraDB", "Update ID " + old_id + " to new id " + new_id);
                                            res.send(result_create_person);
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

    public deletePerson (req: Request, res: Response) {

        const id = parseInt(req.body.id);
        const cql = "DELETE FROM person WHERE ID = ?;";
        
        db.execute(cql, [id], { prepare : true }, (err, result) => {
            if (err) {
                log.error("CassandraDB", "Connection Error", err.message);
            } else {
                if(result) {
                    log.info("CassandraDB", "Deleted person with id " + id);
                    res.send(result);
                }
            }
        });  
    }

}

