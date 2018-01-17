import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import SubmissionForm from './SubmissionForm'

class Submissions extends React.Component {

  render() {

    if (this.props.submissions.length===0) {
      return (
        <div>
          <SubmissionForm />
        </div>
      )
    }

    const byPart = (p1, p2) => p1.week-p2.week

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
              </Table.Row>)
            )}

          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    submissions: state.user ? state.user.submissions : []
  }
}

export default connect(mapStateToProps)(Submissions)
