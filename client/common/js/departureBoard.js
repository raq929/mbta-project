window.React = require('react')
window.ReactDOM = require('react-dom')
import axios from 'axios'
import moment from 'moment'

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
      isLoading: true,
      error: false
    }
  }

  componentDidMount() {
    axios.get('/departures')
      .then(response => {
        this.setState({
          isLoading: false,
          error: false,
          departures: response.data.departures
        })

      })
      .catch(response => {
        this.setState({
          isLoading: false,
          error: true
        })
        console.error(response)
      })
  }

  render() {
    if(this.state.isLoading == false && this.state.error == false) {
      console.log(this.state.departures)
      const departures = this.state.departures.map((departure, index) => {
      const scheduledTime = moment(+departure.ScheduledTime*1000).format('h:mm A')
        return <DeparturesRow
          key={index}
          origin={departure.Origin}
          trip={departure.Trip}
          destination={departure.Destination}
          scheduledTime={scheduledTime}
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
    } else if(this.state.loading == false && this.state.error == true) {
      return <h3>Departure data cannot be loaded. Please try again later.</h3>
    } else {
      return <h3>Loading...</h3>
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
