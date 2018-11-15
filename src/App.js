import React from 'react'
import { Menu, Container, Header, Button, Message } from 'semantic-ui-react'
import Login from './components/Login'
import Notification from './components/Notification'
import Instructor from './components/Instructor'
import courseService from './services/course'
import userService from './services/user'
import { initializeCourse, initializeStats } from './reducers/course'
import { setLoginError, clearNotification, setNotification } from './reducers/notification'
import { login, logout, setProject } from './reducers/user'
import { Route } from 'react-router-dom'
import Submissions from './components/Submissions'
import Course from './components/Course'
import Courses from './components/Courses'
import Solutions from './components/Solutions'
import Miniproject from './components/Miniproject'
import axios from 'axios'

class App extends React.Component {
  constructor() {
    super()
    this.state = { 
      modalOpen: false,
      error: false 
    }
  }

  componentWillMount = async () => {
    const userJson = localStorage.getItem('currentFSUser')
    if (userJson) {
      const userData = await userService.getSubmissions()
      this.props.store.dispatch(login(userData))
    }
  }
    
  componentDidCatch(){
    this.setState({
      error: true,
    })
  }

  handleItemClick = (history) => (e, { name }) => {
    const course = this.props.store.getState().course.info.name
    if (name === 'submissions') {
      history.push(`/${course}/submissions`)
    } else if (name === 'miniproject') {
      history.push(`/${course}/miniproject`)
    } else if (name === 'instructor') {
      history.push(`/${course}/instructor`)  
    } else {
      history.push(`/${course}`)
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

  loggedInCourse() {
    const url = document.location.href
    const h = url.indexOf('#')
    return h != -1 && url.substring(h).length>2 && !(this.props.store.getState().user === null)
  }

  miniprojectEnabled() {
    const course = this.props.store.getState().course.info
    return course && course.miniproject
  }

  joinProject = (id) => {
    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token }
    }

    axios.post(`${BASEURL}/projects/${id}`, {}, config)
      .then(response => {
        const user = Object.assign({}, this.props.store.getState().user, { project: response.data })
        this.props.store.dispatch(setProject(user))
        this.props.store.dispatch(setNotification(`you have joined to ${user.project.name}`))
        setTimeout(() => {
          this.props.store.dispatch(clearNotification())
        }, 8000)     
      }).catch(error => {
        this.props.store.dispatch(setNotification(error.response.data.error))
        setTimeout(() => {
          this.props.store.dispatch(clearNotification())
        }, 8000)  
      })
  }

  createProject = (project) => {
    project.user = this.props.store.getState().user

    const user = JSON.parse(localStorage.getItem('currentFSUser'))
    const config = {
      headers: { 'x-access-token': user.token }
    }

    const course = this.props.store.getState().course.info.name
    axios.post(`${BASEURL}/${course}/projects`, project, config)
      .then(response => {
        const user = Object.assign({}, this.props.store.getState().user, { project: response.data })
        this.props.store.dispatch(setProject(user))
        this.props.store.dispatch(setNotification('miniproject created!'))
        setTimeout(() => {
          this.props.store.dispatch(clearNotification())
        }, 8000)        
      }).catch(error => {
        this.props.store.dispatch(setNotification(error.response.data.error))
        setTimeout(() => {
          this.props.store.dispatch(clearNotification())
        }, 8000)   
      })
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

    const name = this.props.store.getState().user ? 
      `${this.props.store.getState().user.first_names} ${this.props.store.getState().user.last_name }` : 
    ''

    const { activeItem } = this.state

    const instructor = () =>  {
      return this.props.store.getState().user && [['laatopi', 'mluukkai', 'kalleilv', ''].includes(this.props.store.getState().user.student_number)
    }


    return (
      <Container>

        <Route path="/" render={({ history, match }) => (

          <Menu>
            <Menu.Item 
              name='stats'
              active={activeItem === 'stats'}
              onClick={this.handleItemClick(history)}
            >
              course stats
          </Menu.Item>

            {this.loggedInCourse() &&
              <Menu.Item
                name='submissions'
                active={activeItem === 'submissions'}
                onClick={this.handleItemClick(history)}
              >
                my submissions
            </Menu.Item>
            }

            {this.loggedInCourse() && this.miniprojectEnabled() &&
              <Menu.Item
                name='miniproject'
                active={activeItem === 'miniproject'}
                onClick={this.handleItemClick(history)}
              >
                miniproject
            </Menu.Item>
            }

            {this.loggedInCourse() && this.miniprojectEnabled() && instructor() && 
              <Menu.Item
                name='instructor'
                active={activeItem === 'instructor'}
                onClick={this.handleItemClick(history)}
              >
                instructor
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

        <Route exact path="/" render={({ history }) =>
          <Courses historyy={history} /> }
        />

        <Route exact path="/:course" render={({ history, match }) =>
          <Course history={history} course={match.params.course} store={this.props.store} />}
        />

        <Route exact path="/:course/submissions" render={({ history, match }) =>
          <Submissions history={history} course={match.params.course} store={this.props.store} />}
        />
        
        <Route path="/:course/solutions/:id" render={({ match }) =>
          <Solutions id={match.params.id} course={match.params.course} />}
        />

        <Route path="/:course/miniproject" exact render={({ match }) =>
          <Miniproject
            createProject={this.createProject}
            joinProject={this.joinProject}
            user={this.props.store.getState().user}
            createPeerReview={this.createPeerReview}
            course={match.params.course} 
            store={this.props.store}
          />
        } /> 

        <Route path="/:course/instructor" exact render={({ match }) =>
          <Instructor
            user={this.props.store.getState().user}
            course={match.params.course} 
          />
        } /> 

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