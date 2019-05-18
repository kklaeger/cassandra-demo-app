import { Request, Response } from "express";
import * as log from "npmlog";
import db from "../db";

export class QuotationController {

    public addQuotation (req: Request, res: Response) {

        const id = parseInt(req.body.id);
        const content = req.body.content.trim();
        const date = req.body.date;

        let cql = "";

        if(date != null && date != '') {
            cql = "UPDATE person SET quotations = quotations + [{'" + content + "':'" + date + "'}] where ID=?;";
        } else {
            cql = "UPDATE person SET quotations = quotations + [{'" + content + "':'0'}] where ID=?;";
        }
         
        db.execute(cql, [id], { prepare : true }, (err, result) => {
            if (err) {
                log.error("CassandraDB", "Connection Error", err.message);
            } else {
                if(result) {
                    log.info("CassandraDB", "Added quotation " + content);
                    res.send(result);
                }
            }
        });  
    }

    public getAllQuotations (req: Request, res: Response) {

        const cql = "SELECT quotations FROM person;";
        
        db.execute(cql, { prepare : true }, (err, result) => {
            if (err) {
                log.error("CassandraDB", "Connection Error", err.message);
            } else {
                if(result) {
                    let quoatations = [];
                    result.rows.forEach(row => {
                        row.quotations.forEach(entry => {
                            quoatations.push(entry);
                        });
                    });
                    log.info("CassandraDB", "Found " + result.rows.length + " quotations");
                    res.send(quoatations);
                }
            }
        });
    }

    public getQuotationsById (req: Request, res: Response) {

        const id = parseInt(req.body.id);
        const cql = "SELECT quotations FROM person WHERE ID=?;";
        
        db.execute(cql, [id], { prepare : true }, (err, result) => {
            if (err) {
                log.error("CassandraDB", "Connection Error", err.message);
            } else {
                if(result) {
                    log.info("CassandraDB", "Found " + result.rows.length + " quotations");
                    res.send(result.rows);
                }
            }
        });
    }
    
}

