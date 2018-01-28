window.React = require('react')
window.ReactDOM = require('react-dom')
import axios from 'axios'

class DeparturesRow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { origin, trip, destination, scheduledTime, track, lateness, status } = this.props
    return (
      <tr>
        <td>{origin}</td>
        <td>{trip}</td>
        <td>{destination}</td>
        <td>{scheduledTime}</td>
        <td>{lateness}</td>
        <td>{status}</td>
        <td>{track}</td>
      </tr>
    )
  }
}

class DepartureBoard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    axios.get('/departures')
      .then(response => {
        this.setState({
          isLoading: false,
          departures: response.data.departures
        })

      })
      .catch(response => {
        console.error(response)
      })
  }

  render() {
    if(this.state.isLoading == false) {
      console.log(this.state.departures)
      const departures = this.state.departures.map((departure, index) => {
        return <DeparturesRow
          key={index}
          origin={departure.Origin}
          trip={departure.Trip}
          destination={departure.Destination}
          scheduledTime={departure.ScheduledTime}
          track={departure.Track}
          lateness={departure.Lateness}
          status={departure.Status}
        />
      })

      return (
        <table>
          <thead>
            <tr>
              <th>Origin</th>
              <th>Trip</th>
              <th>Destination</th>
              <th>Scheduled Time</th>
              <th>Lateness</th>
              <th>Status</th>
              <th>Track</th>
            </tr>
          </thead>
          <tbody>
            {departures}
          </tbody>
        </table>
      )
    } else {
      return <h3>Loading... </h3>
    }
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
