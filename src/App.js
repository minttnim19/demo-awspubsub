import "./App.css";
import React, { useEffect, useState } from "react";
import Amplify from "@aws-amplify/core";
import * as gen from "./generated";

Amplify.configure(gen.config);

function App() {
  const [send, setSend] = useState("");
  const [received, setReceived] = useState(null);

  //Define the channel name here
  let channel = "d8f51b09b51e2314eaf674fea0389ad6";
  let channelName = "demo-awspubsub"
  //Publish data to subscribed clients
  async function handleSubmit(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    await gen.publish(channel, send);
    setSend("Enter valid JSON here... (use quotes for keys and values)");
  }

  useEffect(() => {
    //Subscribe via WebSockets
    const subscription = gen.subscribe(channel, ({ data }) =>
      setReceived(data)
    );
    return () => subscription.unsubscribe();
  }, [channel]);

  //Display pushed data on browser
  return (
    <div className="App">
      <header className="App-header">
        <p>Send/Push JSON to channel "{channelName}"...</p>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="5"
            cols="60"
            name="description"
            onChange={(e) => setSend(e.target.value)}
          >
            Enter valid JSON here... (use quotes for keys and values)
          </textarea>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <p>Subscribed/Listening to channel "{channelName}"...</p>
        <pre>{JSON.stringify(JSON.parse(received), null, 2)}</pre>
      </header>
    </div>
  );
}

export default App;
