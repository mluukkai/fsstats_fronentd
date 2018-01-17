import axios from 'axios'

const getInfo = async () => {
  try {
    const url = `${BASEURL}/courseInfo`
    const result = await axios.get(url)
    return result.data
  } catch(ex) {
    console.log(ex)
  }
}

const getStats = async () => {
  try {
    const url = `${BASEURL}/stats`
    const result = await axios.get(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getSolutions = async (id) => {
  try {
    const url = `${BASEURL}/solution_files/${id}`
    const result = await axios.get(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getFile = async (url) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))
  const config = {
    headers: { 'x-access-token': user.token }
  }  
  try {
    console.log('HEADERS', config)
    const result = await axios.get(url, config)
    return {
      data: result.data, 
      content: result.headers['content-type']
    }
  } catch (ex) {
    console.log(ex)
  }
}

export default {
  getInfo, getStats, getSolutions, getFile
}