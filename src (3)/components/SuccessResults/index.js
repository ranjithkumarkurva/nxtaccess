import React from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const ResultPage = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (!jwtToken) {
    return <Redirect to="/login" />
  }

  const {location, history} = props
  const {state} = location

  if (!state) {
    return <Redirect to="/" />
  }

  const {score, timeTaken, isTimeUp} = state
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const handleRetake = () => {
    history.replace('/assessment')
  }

  return (
    <>
      <Header />
      <div className="result-container">
        <div className="result-card">
          <img
            src={isTimeUp ? 'time-up-image-url' : 'submit-image-url'}
            alt={isTimeUp ? 'time up' : 'submit'}
            className="result-image"
          />
          <h1>{isTimeUp ? "Time's Up!" : 'Assessment Completed!'}</h1>
          <p>Time Taken: {timeString}</p>
          <p>Your Score: {score}/10</p>
          <button
            type="button"
            onClick={handleRetake}
            className="retake-button"
          >
            Reattempt
          </button>
        </div>
      </div>
    </>
  )
}

export default ResultPage
