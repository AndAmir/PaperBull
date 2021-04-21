import React, { useEffect, useState } from 'react';
import CanvasJSReact from './lib/canvasjs.react';
import { socket } from './App';// eslint-disable-line
// var CanvasJSReact = require('./canvasjs.react');
// const { CanvasJS } = CanvasJSReact;
const { CanvasJSChart } = CanvasJSReact;

export function StockChart() {
  const [ticker, setTicker] = useState('');
  const [stockHistory, setStockHistory] = useState([]);
  const [stockVolumeHistory, setStockVolumeHistory] = useState([]);

  // const [badTicker, setBadTicker] = useState(false);
  console.log('IM IN STOCKCHART', ticker);

  useEffect(() => {
    socket.on('changeStockHistoryChart', (data) => {
      setTicker(data.ticker);
      setStockHistory([]);
      setStockVolumeHistory([]);
      // setBadTicker(false);
      console.log('GETTING HISTORY', data.ticker);
      socket.emit('requestStockHistory', data.ticker, (response) => {
        if (response == null) {
          // setBadTicker(true);
          setTicker('Invalid Ticker Symbol');
        } else {
          console.log('GOT RESPONSE', response);
          Object.keys(response.final).forEach((date) => setStockHistory((prev) => [
            ...prev,
            { x: new Date(date), y: response.final[date] },
          ]));
          // Object.keys(response.volume).forEach(
          //   (date) => setStockVolumeHistory((prev) => (
          //     [...prev, { x: new Date(date), y: response.volume[date] }])),
          // );
        }
      });
    });
  }, []);
  const options = {
    theme: 'light2', // "light1", "light2", "dark1", "dark2"
    animationEnabled: true,
    exportEnabled: true,
    zoomEnabled: true,
    title: {
      text: ticker,
    },
    axisX: {
      valueFormatString: 'MMM',
    },
    axisY: {
      prefix: '$',
      title: 'Price (in USD)',
    },
    data: [
      {
        type: 'candlestick',
        // showInLegend: true,
        // name: "Intel Corporation",
        yValueFormatString: '$###0.00',
        xValueFormatString: 'MMMM DD',
        dataPoints: stockHistory,
      },
      {
        type: 'line',
        dataPoints: stockVolumeHistory,
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart
        options={options}
        // onRef={(ref) => this.chart = ref}
      />
      {/* You can get reference to the chart instance as shown above using onRef.
          This allows you to access all chart properties and methods */}
    </div>
  );
}
export default StockChart;
