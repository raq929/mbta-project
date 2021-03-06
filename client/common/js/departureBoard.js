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
    const trackOrTbd = track || 'TBD'
    const latenessInMinutes = lateness > 0? Math.round(lateness/60) : 0
    let statusWithLateness = latenessInMinutes > 0? `${status} ${latenessInMinutes} minutes` : status

    return (
      <tr>
        <td>{currentDepartureTime}</td>
        <td>{destination}</td>
        <td>{trip}</td>
        <td>{trackOrTbd}</td>
        <td>{statusWithLateness}</td>
      </tr>
    )
  }
}

class DepartureBoard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // create an array of departure rows
    const departures = this.props.departures.map((departure, index) => {
      const scheduledTime = moment(+departure.ScheduledTime*1000)
      // add the lateness to the departure time
      const currentDepartureTime = scheduledTime.add(departure.Lateness, 'seconds').format('h:mm A')

      return <DeparturesRow
        key={index}
        trip={departure.Trip}
        destination={departure.Destination}
        currentDepartureTime={currentDepartureTime}
        track={departure.Track}
        status={departure.Status}
      />
    })

    if(departures.length > 0) {
      return(
        <div className="departure-board__wrapper">
          <table className="departure-board__table">
            <thead>
              <tr>
                <th>Departure Time</th>
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
        </div>
      )
    } else {
      return (
        <div className="departure-board__nodata">
          There are no current departures.
        </div>
      )
    }
  }
}

class AllDepartures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      error: false
    }
  }

  getData() {
    axios.get('/departures')
      .then(response => {
        const { departures, timeLoaded } = response.data
        this.setState({
          isLoading: false,
          error: false,
          departures: departures,
          timeLoaded: timeLoaded
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

  componentDidMount() {
    this.getData()
    // refresh data every 10 seconds
    this.timerID = setInterval(
      // ensure that the right this is invoked
      this.getData.bind(this),
      1000 * 10
    )
  }

  render() {
    if(this.state.isLoading === false && this.state.error === false) {
      const departures = this.state.departures
      const southStationDepartures = departures.filter((departure) => {
        return departure.Origin === "South Station"
      })

      const northStationDepartures = departures.filter((departure) => {
        return departure.Origin === "North Station"
      })
      const timeLoadedHumanReadable = moment(+this.state.timeLoaded*1000).format("dddd, MMMM Do YYYY, h:mm:ss a")

      return (
        <main>
          <p>Data Loaded: <em>{timeLoadedHumanReadable}</em></p>
          <section className="departure-board">
            <h2 className="departure-board__header">South Station</h2>
            <DepartureBoard departures={southStationDepartures} />
          </section>
          <section className="departure-board">
            <h2 className="departure-board__header">North Station</h2>
            <DepartureBoard departures={northStationDepartures} />
          </section>
        </main>
      )
    } else if(this.state.isLoading === false && this.state.error === true) {
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
      <AllDepartures />,
      board
    )
  }
})
