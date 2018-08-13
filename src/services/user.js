import axios from 'axios'

const login = async (username, password) => {
  const response = await axios.post(`${BASEURL}/login`, { username, password })
  return response.data
}

const getSubmissions = async (username) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))

  const config = {
    headers: { 'x-access-token': user.token }
  }

  const response = await axios.get(`${BASEURL}/users/${user.username}`, config)
  return response.data
}

const submitExercises = async (exercises, course) => {
  const user = JSON.parse(localStorage.getItem('currentFSUser'))
  const config = {
    headers: { 'x-access-token': user.token }
  }

  const response = await axios.post(`${BASEURL}/${course}/users/${user.username}/exercises`, exercises, config)
  return response.data
}

export default {
  login, getSubmissions, submitExercises
}