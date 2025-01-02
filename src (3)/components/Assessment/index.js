import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

class Assessment extends Component {
  state = {
    questionsData: [],
    currentQuestionIndex: 0,
    answers: {},
    isLoading: true,
    error: null,
    timeLeft: 600, // 10 minutes in seconds
    submitting: false,
  }

  componentDidMount() {
    this.getQuestionDetails()
    this.startTimer()
  }

  componentWillUnmount() {
    this.clearTimerAndSubmit()
  }

  clearTimerAndSubmit = () => {
    if (this.timerID) {
      clearInterval(this.timerID)
    }
    if (!this.submitting) {
      this.handleTimeUp()
    }
  }

  startTimer = () => {
    this.timerID = setInterval(() => {
      this.setState(
        prevState => ({
          timeLeft: prevState.timeLeft - 1,
        }),
        () => {
          if (this.timeLeft <= 0) {
            this.handleTimeUp()
          }
        },
      )
    }, 1000)
  }

  handleTimeUp = () => {
    const {history} = this.props
    const {answers, questionsData} = this.state

    const score = this.calculateScore(answers, questionsData)
    history.replace('/results', {
      score,
      timeUp: true,
      timeTaken: this.calculateTimeTaken(),
    })
  }

  calculateScore = (answers, questions) => {
    let score = 0
    questions.forEach(question => {
      const selectedAnswerId = answers[question.id]
      const correctOption = question.options.find(
        opt => opt.is_correct === 'true',
      )
      if (selectedAnswerId === correctOption?.id) {
        score += 1
      }
    })
    return score
  }

  calculateTimeTaken = () => {
    const timeSpent = 600 - this.timeLeft // 600 seconds = 10 minutes
    const minutes = Math.floor(timeSpent / 60)
    const seconds = timeSpent % 60
    return `${minutes}m ${seconds}s`
  }

  formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }

  getQuestionDetails = async () => {
    this.setState({isLoading: true, error: null})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/assess/questions'

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }

      const data = await response.json()
      const initialAnswers = {}
      data.questions.forEach(question => {
        if (question.options_type === 'SINGLE_SELECT') {
          initialAnswers[question.id] = question.options[0].id
        }
      })

      this.setState({
        questionsData: data.questions,
        isLoading: false,
        answers: initialAnswers,
      })
    } catch (error) {
      this.setState({
        error: 'Failed to load questions. Please try again.',
        isLoading: false,
      })
    }
  }

  handleOptionClick = (option, questionId) => {
    this.setState(prevState => ({
      answers: {
        ...prevState.answers,
        [questionId]: option.id,
      },
    }))
  }

  renderDefaultOptions = (options, questionId) => {
    const {answers} = this.state
    return (
      <div className="options-container">
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            className={`option-button ${
              answers[questionId] === option.id ? 'selected' : ''
            }`}
            onClick={() => this.handleOptionClick(option, questionId)}
          >
            {option.text}
          </button>
        ))}
      </div>
    )
  }

  renderImageOptions = (options, questionId) => {
    const {answers} = this.state
    return (
      <div className="image-options-grid">
        {options.map(option => (
          <div
            key={option.id}
            className={`image-option ${
              answers[questionId] === option.id ? 'selected' : ''
            }`}
            onClick={() => this.handleOptionClick(option, questionId)}
            role="button"
            tabIndex={0}
          >
            <img src={option.image_url} alt={option.text} />
            <p className="option-label">{option.text}</p>
          </div>
        ))}
      </div>
    )
  }

  renderSingleSelect = (options, questionId) => {
    const {answers} = this.state
    return (
      <div className="select-container">
        <select
          className="select-input"
          value={answers[questionId] || options[0].id}
          onChange={e => {
            const selectedOption = options.find(
              opt => opt.id === e.target.value,
            )
            if (selectedOption) {
              this.handleOptionClick(selectedOption, questionId)
            }
          }}
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    )
  }

  handleQuestionChange = index => {
    this.setState({currentQuestionIndex: index})
  }

  handleSubmitAssessment = () => {
    const {history} = this.props
    const {answers, questionsData} = this.state

    this.setState({submitting: true})
    clearInterval(this.timerID)

    const score = this.calculateScore(answers, questionsData)
    const timeTaken = this.calculateTimeTaken()

    history.replace('/results', {
      score,
      timeUp: false,
      timeTaken,
    })
  }

  renderQuestions = () => {
    const {questionsData, currentQuestionIndex} = this.state
    const question = questionsData[currentQuestionIndex]

    if (!question) return null

    return (
      <div className="question-container" data-testid="questionItem">
        <h3 className="question-number">
          Question {currentQuestionIndex + 1} of {questionsData.length}
        </h3>
        <p className="question-text">{question.question_text}</p>

        {question.options_type === 'DEFAULT' &&
          this.renderDefaultOptions(question.options, question.id)}
        {question.options_type === 'IMAGE' &&
          this.renderImageOptions(question.options, question.id)}
        {question.options_type === 'SINGLE_SELECT' &&
          this.renderSingleSelect(question.options, question.id)}

        {currentQuestionIndex < questionsData.length - 1 && (
          <button
            type="button"
            className="next-button"
            onClick={() => this.handleQuestionChange(currentQuestionIndex + 1)}
          >
            Next Question
          </button>
        )}
      </div>
    )
  }

  render() {
    const {
      questionsData,
      answers,
      isLoading,
      error,
      currentQuestionIndex,
      timeLeft,
    } = this.state

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#263868" height={50} width={50} />
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
          />
          <p>{error}</p>
          <button
            type="button"
            className="retry-button"
            onClick={this.getQuestionDetails}
          >
            Retry
          </button>
        </div>
      )
    }

    const answeredCount = Object.keys(answers).length
    const unansweredCount = questionsData.length - answeredCount

    return (
      <div className="main-assessment-container">
        <div className="assessment-container">
          {this.renderQuestions()}

          <div className="sidebar">
            <div className="timer-section">
              <p className="time-left">Time Left</p>
              <div className="timer-display">
                <span>{this.formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="questions-status">
              <div className="status-item">
                <span className="status-count answered">{answeredCount}</span>
                <span className="status-label">Answered Questions</span>
              </div>
              <div className="status-item">
                <span className="status-count unanswered">
                  {unansweredCount}
                </span>
                <span className="status-label">Unanswered Questions</span>
              </div>
            </div>

            <div className="questions-section">
              <p className="questions-title">
                Questions ({questionsData.length})
              </p>
              <div className="questions-grid">
                {questionsData.map((_, index) => (
                  <button
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    type="button"
                    className={`question-number-button ${
                      index === currentQuestionIndex ? 'active' : ''
                    } ${answers[questionsData[index]?.id] ? 'answered' : ''}`}
                    onClick={() => this.handleQuestionChange(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="submit-button"
              onClick={this.handleSubmitAssessment}
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Assessment
