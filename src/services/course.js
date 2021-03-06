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

const getInfoOf = async (name) => {
  try {
    const url = `${BASEURL}/${name}/info`
    const result = await axios.get(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getStatsOf = async (name) => {
  try {
    const url = `${BASEURL}/${name}/stats`
    const result = await axios.get(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getCourses = async () => {
  try {
    const url = `${BASEURL}/courses`
    const result = await axios.get(url)
    return result.data
  } catch (ex) {
    console.log(ex)
  }
}

const getSolutions = async (course, id) => {
  try {
    const url = `${BASEURL}/${course}/solution_files/${id}`
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
  getStatsOf, getSolutions, getFile, getInfoOf, getCourses
}