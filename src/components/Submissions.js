import React from 'react'
import { connect } from 'react-redux'
import { Table, Button } from 'semantic-ui-react'
import SubmissionForm from './SubmissionForm'
import courseService from '../services/course'
import { initializeCourse } from '../reducers/course'
const Highlight = require('react-syntax-highlight')

class Submissions extends React.Component {

  componentWillMount = async () => {
    const info = await courseService.getInfoOf(this.props.course)
    this.props.store.dispatch(initializeCourse(info))
  }

  showModelSolutuions = (part) => () => {
    this.props.history.push(`solutions/${part}`)
  }

  render() {

    if (this.props.submissions.length === 0) {
      return (
        <div>
          <SubmissionForm />
        </div>
      )
    }

    const byPart = (p1, p2) => p1.week - p2.week

    const solutions = (part) => {
      if ( part===0) {
        return <div>not available yet</div>
      }
      return(
        <Button onClick={this.showModelSolutuions(part)}>
          show
        </Button>
      )
    }
    const sum = (s,i) => s+i
    const exerciseTotal = 
      this.props.submissions.map(s => s.exercises.length).reduce(sum, 0)
    const hoursTotal = 
      this.props.submissions.map(s => s.time).reduce(sum, 0)
    return (
      <div>
        <h3>My submissions</h3>
        <SubmissionForm />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>part</Table.HeaderCell>
              <Table.HeaderCell>exercises</Table.HeaderCell>
              <Table.HeaderCell>hours</Table.HeaderCell>
              <Table.HeaderCell>github</Table.HeaderCell>
              <Table.HeaderCell>comment</Table.HeaderCell>  
              <Table.HeaderCell>solutions</Table.HeaderCell>    
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.submissions.sort(byPart).map(s=>(
              <Table.Row key={s._id}>
                <Table.Cell>{s.week}</Table.Cell>
                <Table.Cell>{s.exercises.length}</Table.Cell>
                <Table.Cell>{s.time}</Table.Cell>
                <Table.Cell><a href={`${s.github}`}>{s.github}</a></Table.Cell>
                <Table.Cell>{s.comment}</Table.Cell>
                <Table.Cell>
                  {solutions(s.week)}
                </Table.Cell>
              </Table.Row>)
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>total</Table.HeaderCell>
              <Table.HeaderCell>{exerciseTotal}</Table.HeaderCell>
              <Table.HeaderCell>{hoursTotal}</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submissions: state.user && state.course.info  ? 
      state.user.submissions.filter(s => s.courseName === state.course.info.name) : 
      []
  }
}

export default connect(mapStateToProps)(Submissions)
