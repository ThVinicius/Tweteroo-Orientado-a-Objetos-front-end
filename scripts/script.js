import escapeHtml from '../utils/escapeHtml.js'

class Messenger {
  #username

  constructor() {
    this.#username = ''
  }

  loadTweets() {
    axios.get('http://localhost:5001/tweets').then(res => {
      const tweets = res.data
      let tweetsHtml = ''

      for (const tweet of tweets) {
        tweetsHtml += `
          <div class="tweet">
            <div class="avatar">
              <img src="${tweet.avatar}" />
            </div>
            <div class="content">
              <div class="user">
                @${tweet.username}
              </div>
              <div class="body">
                ${escapeHtml(tweet.tweet)}
              </div>
            </div>
          </div>
        `
      }

      document.querySelector('.tweets').innerHTML = tweetsHtml
      document.querySelector('.pagina-inicial').classList.add('hidden')
      document.querySelector('.tweets-page').classList.remove('hidden')
    })
  }

  signUp() {
    const username = document.querySelector('#username').value
    const picture = document.querySelector('#picture').value

    axios
      .post('http://localhost:5001/sign-up', {
        username,
        avatar: picture
      })
      .then(() => {
        this.#username = username
        this.loadTweets()
      })
      .catch(err => {
        console.error(err)
        alert('Erro ao fazer cadastro! Consulte os logs.')
      })
  }

  signUpOnClick() {
    document.querySelector('.btn-enviar').addEventListener('click', () => {
      this.signUp()
    })
  }

  postTweet() {
    const tweet = document.querySelector('#tweet').value

    axios
      .post('http://localhost:5001/tweets', {
        username: this.#username,
        tweet
      })
      .then(() => {
        document.querySelector('#tweet').value = ''
        this.loadTweets()
      })
      .catch(err => {
        console.error(err)
        alert('Erro ao fazer tweet! Consulte os logs.')
      })
  }

  postTweetOnClick() {
    document
      .querySelector('.btn-enviar-tweet')
      .addEventListener('click', () => {
        this.postTweet()
      })
  }
}

window.onload = () => {
  const app = new Messenger()

  app.signUpOnClick()
  app.postTweetOnClick()
}
