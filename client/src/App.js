import React, { Component } from "react";
import axios from "axios";
import "./style.css";

const URL_PEOPLE = "http://localhost:3001/people";
const URL_QUOTATIONS = "http://localhost:3001/quotations";


class App extends Component {

  constructor(){
    super();
    this.quotationsDiv = React.createRef();
  }
  
  state = {

    people: [],
     quotationsDivVisible: [],
     quotationsDivDisplay: [],
     arrowImg: [],
     quotation_content: [],
     quotation_date: []
  };

  componentDidMount() {
    this.getPeople();
  }

  getPeople () {
    fetch(URL_PEOPLE)
      .then(data => data.json())
      .then(data => this.setState({ people: data }))
      .then(() => this.setState({ quotationsDivDisplay: Array(this.state.people.length).fill(false) }))
      .then(() => this.setState({ quotationsDivVisible: Array(this.state.people.length).fill("none") }))
      .then(() => this.setState({ quotation_content: Array(this.state.people.length).fill("") }))
      .then(() => this.setState({ quotation_date: Array(this.state.people.length).fill("") }))
      .then(() => this.setState({ arrowImg: Array(this.state.people.length).fill("/assets/angle-arrow-down.png") }));
  };

  async addPerson (name, place, birthday) {
    await axios.post(URL_PEOPLE, {
      name: name,
      place: place,
      birthday: birthday
    });  
    this.getPeople();
    this.resetState();
  };

  async deletePerson (event, person) {
    await axios.delete(URL_PEOPLE, {
      data: {
        id: person.id
      }
    });
    this.getPeople();
  }

  async addQuotation (id, content, date) {
    await axios.put(URL_QUOTATIONS, {
      id: id,
      content: content,
      date: date
    });  
    this.getPeople();
    this.resetState();
  };

  resetState () {
    this.setState({ person_name: "" });
    this.setState({ person_place: "" });
    this.setState({ person_birthday: "" });
    this.setState({ quotation_content: "" });
    this.setState({ quotation_date: "" });
  }

  handleQuotationsFieldVisibility = (e, index) => {
    if(!this.state.quotationsDivVisible[index]) {
      this.state.quotationsDivVisible[index] = true;
      this.state.quotationsDivDisplay[index] = "block";
      this.state.arrowImg[index] = "/assets/up-arrow.png";
    } else {
      this.state.quotationsDivDisplay[index] = "none";
      this.state.quotationsDivVisible[index] = false;
      this.state.arrowImg[index] = "/assets/angle-arrow-down.png";
    }
    this.forceUpdate();
  }

  updateQuotationsContent(e, index){
    this.state.quotation_content[index] = e.target.value;
    this.forceUpdate();
  }

  updateQuotationsDate(e, index){
    this.state.quotation_date[index] = e.target.value;
    this.forceUpdate();
  }
 
  render() {
    const people = this.state.people;
    return (
      <div>
         <img src="/assets/museum.png" style={{    position: "fixed", height: "38px",zIndex: 43,top: "8px", left: "40px"}} />
        <h1 className="header">Digital Museum with Cassandra</h1>
        <div>
          <div id="left">
            <h2 style={{marginLeft: "30px"}}>Add new Person</h2>
            <div className="input-fields">
              <input type="text" onChange={e => this.setState({ person_name: e.target.value })} value={this.state.person_name} placeholder="Name"/>
              <input type="text" onChange={e => this.setState({ person_place: e.target.value })} value={this.state.person_place} placeholder="Place"/>
              <input type="text" onChange={e => this.setState({ person_birthday: e.target.value })} value={this.state.person_birthday} placeholder="Birthday"/>
              <button className="buttons" onClick={() => this.addPerson(this.state.person_name, this.state.person_place, this.state.person_birthday)}>
                Add Person
              </button>
             
            </div>
          </div>
          <div id="content">
            <h2>All People</h2>
            <div>
                {people.length <= 0 ? "No Person" : people.map( (person, index) => (
                  <div key={index} id="person-list">
                    <span className="person-list-entry">{person.id} </span> 
                    <span className="person-list-entry">{person.name} </span> <br/>

                    <img id="arrow" src="/assets/location.png" style={{width: "18px",height: "18px", marginRight: "17px", position: "relative", top: "3px"}} />
                    <span style={{display: "inline-block"}} className="person-list-entry">{person.place}</span>
                    <br/>
                    <img id="arrow" src="/assets/calendar.png" style={{width: "18px",height: "18px", marginRight: "17px", position: "relative", top: "3px"}} />
                    <span className="person-list-entry">{person.birthday}</span>
                    
                    <div id="delete-button" onClick={((e) => this.deletePerson(e, person))}>
                          <img id="quote-arrow" src="/assets/delete-button.png" style={{width: "18px",height: "18px", top: "-90px"}} />
                    </div>

                    <div>
                      {person.quotations != null && person.quotations.length > 0 ?
                      <div className="quotes-wrap">
                        <h3> Quotations </h3>
                      </div> : ""}

                        {person.quotations != null && person.quotations.length > 0  ?
                          person.quotations.map((quote, index) => (
                          <div className="quotes-wrap" key={index}>
                            
                            <span id="quote">{Object.keys(quote)}</span>

                            {parseInt(Object.values(quote)) > 0 ?
                              <div className="quotes-wrap">
                                <span className="quotes-time">{Object.values(quote)}</span>
                              </div>
                            : ""}
                          </div>
                        ))
                        : "" }
                    </div>
                    <div id="show-add-quote" onClick={e => this.handleQuotationsFieldVisibility(e, index)}>
                          <img id="quote-arrow" src={this.state.arrowImg[index]} />
                    </div>
                    <div id="add-quote" style={{display: this.state.quotationsDivDisplay[index]}}>
                          <img src="/assets/two-quotes.png" style={{width: "16px"}} />
                          <span id="quote-span">Enter a quotation...</span>
                          <textarea 
                          id="quote-area" 
                          onChange={e => this.updateQuotationsContent(e, index)} 
                          value={this.state.quotation_content[index]} 
                          placeholder="Quoatation"/>
                          <input type="text" onChange={e => this.updateQuotationsDate(e, index)} value={this.state.quotation_date[index]} placeholder="Date (optional)"/>
                          <button className="buttons" style={{marginBottom: "5px"}} onClick={() => this.addQuotation(person.id, this.state.quotation_content[index], this.state.quotation_date[index])}>Add Quotation</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;