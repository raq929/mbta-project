window.React = require('react')
window.ReactDOM = require('react-dom')
import axios from 'axios'

class DepartureBoard extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Origin</th>
            <th>Trip</th>
            <th>Destination</th>
            <th>Scheduled Time</th>
            <th>Lateness</th>
            <th>Track</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    )
  }
}



document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('js-departures-board')
  if (board) {
    ReactDOM.render(
      <DepartureBoard />,
      board
    )
  }
})
