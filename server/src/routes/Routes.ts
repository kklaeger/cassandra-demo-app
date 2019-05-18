import { PeopleController } from "../controllers/PeopleController";
import { QuotationController } from "../controllers/QuotationController";

export class Routes {    

    public peopleController: PeopleController = new PeopleController();
    public quotationController: QuotationController = new QuotationController();
    
    public initRoutes(app): void {   
        
        app.route("/people")
            .get(this.peopleController.getPeople)
            .post(this.peopleController.addPerson)
            .delete(this.peopleController.deletePerson);

        app.route("/quotations")
            .get(this.quotationController.getAllQuotations)
            .post(this.quotationController.getQuotationsById)
            .put(this.quotationController.addQuotation);
    }
}