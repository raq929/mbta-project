window.React = require('react')
window.ReactDOM = require('react-dom')
import axios from 'axios'
import moment from 'moment'

class DeparturesRow extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { origin, trip, destination, currentDepartureTime, track, lateness, status } = this.props

    return (
      <tr>
        <td>{currentDepartureTime}</td>
        <td>{origin}</td>
        <td>{destination}</td>
        <td>{trip}</td>
        <td>{track}</td>
        <td>{status}</td>
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
      // create an array of departure rows
      const departures = this.state.departures.map((departure, index) => {
        const scheduledTime = moment(+departure.ScheduledTime*1000)
        const currentDepartureTime = scheduledTime.add(departure.Lateness, 'seconds').format('h:mm A')

        return <DeparturesRow
          key={index}
          origin={departure.Origin}
          trip={departure.Trip}
          destination={departure.Destination}
          currentDepartureTime={currentDepartureTime}
          track={departure.Track}
          lateness={departure.Lateness}
          status={departure.Status}
        />
      })

      return (
        <table>
          <thead>
            <tr>
              <th>Departure Time</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Trip</th>
              <th>Track</th>
              <th>Status</th>
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
