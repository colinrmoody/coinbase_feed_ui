import React from 'react'
import { Table } from 'antd'
import "./App.css"
import Socket from './ws.js';

const columns  = [
  {
    title: 'Price',
    dataIndex: 'Price'
  }, 
  {
    title: 'Size',
    dataIndex: 'Size'
  }
];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      bids: [],
      asks: [],
    }
  }

  componentDidMount() {
    let ws = new WebSocket('ws://localhost:4000');

    let socket = this.socket = new Socket(ws);

    socket.on('connect', this.onConnect);
    socket.on('disconnect', this.onDisconnect);

    socket.on('msgFromServer', this.msgFromServer);
  }

  render() {
    return (
      <div className="App">
        <h4>Asks</h4>
        <Table columns={columns} dataSource={this.state.asks.reverse().map((ask, idx) => (
          { key: idx,  Price: ask.Price.toFixed(2), Size: ask.Size.toFixed(5) }
        ))} />
        <h4>Bids</h4>
        <Table columns={columns} dataSource={this.state.bids.map((bid, idx) => (
          { key: idx,  Price: bid.Price.toFixed(2), Size: bid.Size.toFixed(5) }
        ))} />
      </div>
    );
  }

  onConnect = () => {
    this.setState({connected: true});
  }

  onDisconnect = () => {
      this.setState({connected: false});
  }

  msgFromServer = (data) => {
      this.setState({bids: data.Bids, asks: data.Asks});
  }

}