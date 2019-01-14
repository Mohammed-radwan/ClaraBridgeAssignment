import React, { Component } from 'react';
import './App.css';

const MY_ACCESS_TOKEN = process.env.REACT_APP_API_KEY;

const ReplyItem=(props)=>{

  return(
    <tr>
      <th scope="row">{props.item.name}</th>
      <td>{props.item.message}</td>
      <td>{props.item.sentiment}</td>
    </tr> 
        )
}

class App extends Component {
  constructor(props){
    super(props)
      this.state={
	      loading:true,
        replies:[],
      }   
  }
checkErrors(response){
  if (response.meta.code !== 200) {
      throw new Error('Invalid response:' + response.error_description);
    }
  }
encodeParams(params) {
    return Object.entries(params).map(([k, v]) => `${k}=${encodeURI(v)}`).join('&')
  }
  
componentDidMount= async()=>{

  const res = await  fetch (`https://cors.io/?https://api.engagor.com/17966/settings/canned_responses/?access_token=${MY_ACCESS_TOKEN}`);
  
  const responses= await res.json();
  this.checkErrors(responses);
  const data=responses.response.data
 
  
  const messages = data.map(r => r.message);

  const params = {
    access_token: `${MY_ACCESS_TOKEN}`, 
    string:JSON.stringify(messages),
    language: 'en'
  }
  const response = await fetch(`https://cors.io/?https://api.engagor.com/tools/sentiment/?`+ this.encodeParams(params));
  const json = await response.json();
  this.checkErrors(responses);
  const sentiments=json.response
  
  const replies = data.map((r, i) => ({ ...r, sentiment: sentiments[i]}));
  
  this.setState({ loading: false, replies });
  
 }
  render() {
 	  if (this.state.loading) { return <p>Loading....</p> }
        const replies =this.state.replies.map((item)=>{
    return(
            <ReplyItem key={item.id} item={item} />
          )
    })
      return (
        <div className="main_div">
        <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Message</th>
            <th scope="col">Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {replies}
        </tbody>
        </table>
       </div>
      )
  }
}

export default App;


