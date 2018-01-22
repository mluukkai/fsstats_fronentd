import React from 'react'
import courseService from '../services/course'
import { Grid, Message, List } from 'semantic-ui-react'

const File = ({ file, showFile }) => {
  const url = `${BASEURL}/${file.fullName}`

  const klik = (file) => (e) => {
    e.preventDefault()

    showFile(file)
  }

  if (file.type === 'file') {
    return (
      <List.Item onClick={klik(file)}>
        <List.Icon name='file' />
        <List.Content>
        <List.Description>{file.name}</List.Description>
        </List.Content>
      </List.Item>  
    )
  }
  return (
    <List.Item>
      <List.Icon name='folder' />
      <List.Content>
        <List.Description>{file.name}</List.Description>
        <List>
          {file.files.map(file => 
            <File
              key={file.fullName}
              file={file}
              showFile={showFile}
            />
          )}
        </List>
      </List.Content>
    </List.Item>
  )
}

class Solutions extends React.Component {
  constructor() {
    super()
    this.state = {
      files: [],
      file: null,
      data: '',
      content: '',
      error: ''
    }
  }

  componentWillMount = async () => {
    const files = await courseService.getSolutions(this.props.id)
    this.setState({files})
  }

  componentWillReceiveProps = async (newProps) => {
    const files = await courseService.getSolutions(newProps.id)
    this.setState({ files })
  }

  showFile = async (file) => {
    const url = `${BASEURL}/${file.fullName}`
    try{
      const { data, content } = await courseService.getFile(url)
      this.setState({ data, content, file })
    } catch(e) {
      this.setState({ error: `Submit part ${this.props.id} first...` })      
    }

  }

  render(){
    //console.log(this.state.content)

    const show = () => {
      if (this.state.content === 'image/png') {
        const user = JSON.parse(localStorage.getItem('currentFSUser'))
        const url = `${BASEURL}/${this.state.file.fullName}?token=${user.token}`
        return <img src={url} width='500'/>
      }

      if (this.state.content.includes('application/json') ) {
        return(
          <div>
            <pre>
              {JSON.stringify(this.state.data, null, 2)}
            </pre>
          </div>
        )   
      }

      return (
        <pre>
          {this.state.data}
        </pre>
      )
    }

    return (
      <div>
        <h2>Example solutions part {this.props.id}</h2>
        <Grid columns={4}>
          <Grid.Column widht={1}>
            <List>
              {this.state.files.map(file => 
                <File
                  key={file.fullName}
                  file={file}
                  showFile={this.showFile}
                />
              )}
            </List>
          </Grid.Column>

          <Grid.Column widht={3}>
            {(this.state.error)&&(
              <Message color='red'>
                <Message.Header>
                  no permissions
                </Message.Header>
                <p>{this.state.error}</p>  
              </Message>)}
            <h4>{this.state.file &&  this.state.file.fullName}</h4>
            {show()}
          </Grid.Column>
        </Grid>

      </div>
    )
  }
}

export default Solutions