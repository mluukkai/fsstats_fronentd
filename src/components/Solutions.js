import React from 'react'
import courseService from '../services/course'
import { Grid, Message } from 'semantic-ui-react'

const File = ({ file, showFile }) => {
  const url = `${BASEURL}/${file.fullName}`

  const klik = (file) => (e) => {
    e.preventDefault()
    console.log('*')
    showFile(file)
  }

  const style = {
    borderStyle: 'solid',
    borderWidth: 1
  }

  if (file.type === 'file') {
    return (
      <li style={style} onClick={klik(file)}>
        {file.name}
      </li>
    )
  }
  return (
    <li><em>{file.name}</em>
      <ul>
        {file.files.map(file => 
          <File
            key={file.fullName}
            file={file}
            showFile={showFile}
          />
        )}
      </ul>
    </li>
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
        <div>
          <pre>
            {this.state.data}
          </pre>
        </div>
      )
    }

    return (
      <div>
        <h2>Example solutions part {this.props.id}</h2>
        <ul>
          {this.state.files.map(file => <File
            key={file.fullName}
            file={file}
            showFile={this.showFile}
          />)}
        </ul>
        <Grid columns={5}>
          <Grid.Column widht={1}>
            <ul>
              {this.state.files.map(file => <File
                key={file.fullName}
                file={file}
                showFile={this.showFile}
              />)}
            </ul>
          </Grid.Column>
          <Grid.Column widht={1}>
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