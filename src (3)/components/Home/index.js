import {Component} from 'react'
import './index.css' // Make sure to import the CSS
import Header from '../Header'

class Home extends Component {
  handleStartAssessment = () => {
    alert('Starting Assessment...')
    // Add navigation or logic here
  }

  render() {
    return (
      <div className="bg-container">
        <Header />
        <div className="container">
          <div className="content">
            <div className="instructions-card">
              <h2 className="title">Instructions</h2>
              <ol className="instruction-list">
                <li>
                  <strong>Total Questions:</strong> 10
                </li>
                <li>
                  <strong>Types of Questions:</strong> MCQs
                </li>
                <li>
                  <strong>Duration:</strong> 10 Mins
                </li>
                <li>
                  <strong>Marking Scheme:</strong> Every correct response, get 1
                  mark
                </li>
                <li>
                  All the progress will be lost if you reload during the
                  assessment.
                </li>
              </ol>
              <button
                className="start-button"
                onClick={this.handleStartAssessment}
              >
                Start Assessment
              </button>
            </div>
            <img
              className="image"
              src="/path-to-image.png"
              alt="Assessment Illustration"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Home
