import React from 'react'
import { Menu, Container, Header, Button, Message } from 'semantic-ui-react'
import Login from './components/Login'
import Statistics from './components/Statistics'
import Notification from './components/Notification'
import courseService from './services/course'
import userService from './services/user'
import { initializeCourse, initializeStats } from './reducers/course'
import { setLoginError, clearNotification, setNotification } from './reducers/notification'
import { login, logout } from './reducers/user'
import { Route } from 'react-router-dom'
import Submissions from './components/Submissions'
import Solutions from './components/Solutions'

class App extends React.Component {
  constructor() {
    super()
    this.state = { 
      modalOpen: false,
      error: false 
    }
  }

  componentWillMount = async () => {
    const info = await courseService.getInfo()
    const action = initializeCourse(info)
    this.props.store.dispatch(action)

    const stats = await courseService.getStats()
    const action2 = initializeStats(stats)
    this.props.store.dispatch(action2)

    const userJson = localStorage.getItem('currentFSUser')
    if (userJson) {
      const userData = await userService.getSubmissions()
      const action = login(userData)
      this.props.store.dispatch(action)
    }
  }
    
  componentDidCatch(){
    this.setState({
      error: true,
    })
  }

  handleItemClick = (history) => (e, { name }) => {
    if (name === 'submissions') {
      history.push('/submissions')
    } else {
      history.push('/')
    }
    
    this.setState({ activeItem: name })
  }

  handleOpen = () => {
    this.setState({ modalOpen: true })
  }

  logout = (history) => () => {
    this.props.store.dispatch(logout())
    history.push('/')
    this.props.store.dispatch(setNotification(`logged out`))
    setTimeout(() => {
      this.props.store.dispatch(clearNotification())
    }, 8000)
    localStorage.removeItem('currentFSUser')
  }

  handleClose = async (username, password) => {
    try {
      const user = await userService.login(username, password)
      user.username = username

      localStorage.setItem('currentFSUser', JSON.stringify(user))
      const userData = await userService.getSubmissions()
      this.props.store.dispatch(login(userData))
      this.props.store.dispatch(setNotification(`${user.username} logged in`))
      setTimeout(() => {
        this.props.store.dispatch(clearNotification())
      }, 8000)
      this.setState({ modalOpen: false })
    } catch(e){
      this.props.store.dispatch(setLoginError('wrong username/password'))
      setTimeout(()=>{
        this.props.store.dispatch(clearNotification())
      }, 8000)
      
    }

  }

  loggedIn() {
    return !(this.props.store.getState().user === null)
  }

  render() {
    if (this.state.error) {
      return <Container style={{margin: 10}}>
        <Message color='red'>    
          <Message.Header>
            Something bad happened
          </Message.Header>
          <p>
            raport bug in Telegram or by email mluukkai@cs.helsinki.fi
          </p>  
        </Message>
      </Container>
    }

    if (this.props.store.getState().course.info === null ) {
      return null
    }

    const name = this.props.store.getState().user ? 
      `${this.props.store.getState().user.first_names} ${this.props.store.getState().user.last_name }` : 
    ''

    const { activeItem } = this.state
    const course = this.props.store.getState().course.info

    return (
      <Container>

        <Route path="/" render={({history}) => (

          <Menu>
            <Menu.Item 
              name='stats'
              active={activeItem === 'stats'}
              onClick={this.handleItemClick(history)}
            >
              course stats
          </Menu.Item>

            {this.loggedIn() &&
              <Menu.Item
                name='submissions'
                active={activeItem === 'submissions'}
                onClick={this.handleItemClick(history)}
              >
                my submissions
            </Menu.Item>
            }

            {!this.loggedIn() &&
              <Menu.Item
                name='login'
                onClick={this.handleOpen}
              >
                login
            </Menu.Item>
            }

            {this.loggedIn() &&
              <Menu.Item
                name='name'
              >
                <em>
                  {name}
                </em>
              </Menu.Item>
            }

            {this.loggedIn() &&
              <Menu.Item
                name='logout'
                onClick={this.logout(history)}
              >
                logout
            </Menu.Item>
            }
          </Menu>
        )} />

        <Notification />

        <Route exact path="/" render={() => (
          <div>
            <h2>{course.name}</h2>
            <p><a href={course.url}>course page</a></p>
            <Statistics />  
          </div>
        )} />

        <Route exact path="/submissions" render={({history}) => 
          <Submissions history={history}/> }
        />

        <Route path="/solutions/:id" render={({match}) => 
          <Solutions id={match.params.id} />}
        />

        <Login
          handleClose={this.handleClose}
          handleOpen={this.handleOpen}
          open={this.state.modalOpen}
        />

      </Container>
    )
  }
}

export default App