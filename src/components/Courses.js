import React from 'react'
import { Route } from 'react-router-dom'
import courseService from '../services/course'

class Courses extends React.Component {

  state = {
    courses: []
  }

  componentWillMount = async () => {
    const courses = await courseService.getCourses()
    this.setState({ courses })
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.courses.filter(c=>c.enabled===true).map(c=>
            <li>
              <a href={`#${c.name}`}>
                {c.fullName}
              </a>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Courses