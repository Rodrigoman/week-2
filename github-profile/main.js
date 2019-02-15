class GitHubFy {
  constructor() {
    this.headers = {
      Authorization: 'token 7780b41a1bbd1a474133226c842cebaaba84e84d',
    };
    this.searchForm = document.querySelector('#searchForm');
    this.renderRepoInformationIn = document.querySelector('#repoInfo');
    this.searchUserInput = document.querySelector('#user');
  }

  async checkForUser() {
    this.cleanErrors();
    await this.searchUser();
    if (this.user.message !== 'Not Found') {
      await this.getRepos();
      this.renderRepositories();
      this.renderUserBio();
    } else {
      this.notFound();
    }
  }

  async searchUser() {
    const user = await fetch(`https://api.github.com/users/${this.query}`, { headers: this.headers });
    this.user = await user.json().then(userJson => userJson);
  }

  async getRepos() {
    const repos = await fetch(`https://api.github.com/users/${this.query}/repos`, { headers: this.headers });
    this.repos = await repos.json().then(repoJson => repoJson);
  }

  static isnull(value, defaultValue) {
    if (value === null || value === '') {
      return defaultValue;
    }

    return value;
  }

  notFound() {
    this.searchUserInput.classList.add('is-error');
    document.querySelector('#secret-message').classList.remove('secret-message');
    document.querySelector('#secret-message').classList.add('error-message');
  }

  cleanErrors() {
    this.searchUserInput.classList.remove('is-error');
    document.querySelector('#secret-message').classList.remove('error-message');
    document.querySelector('#secret-message').classList.add('secret-message');
  }

  renderUserBio() {
    const to = document.querySelector('#bio');
    const name = GitHubFy.isnull(this.user.name, this.user.login);
    const company = GitHubFy.isnull(this.user.company, '');
    const blog = GitHubFy.isnull(this.user.blog, this.user.html_url);
    const location = GitHubFy.isnull(this.user.location, 'unknown');

    const template = ` <section class="retro-container  margin-bottom-and-top">
    <div class="info">
        <div class="nes-container is-rounded" style=" width: 164px; height: 152px;">
            <img src="${this.user.avatar_url}" width="120px">
        </div>
        <div class="info-bio" style=" width: 100px; ">
            <h3 class="title">${name}</h3>
            <small>Since:${moment(this.user.created_at).format('YYYY')}</small>
            <small>Location:${location}</small><br>
            <small>repositories:${this.repos.length}</small>
        </div>
    </div>
    <br>
    <div class="info">
        <small> stars:  ${this.user.totalStars}<br> 
            Followers : ${this.user.followers} <br>
            Followings: ${this.user.following} <br>
        </small>
        <small> company: ${company} <br> 
            blog: <p class="truncate-text"><a href="${blog}" target="_blank">
             ${blog}</a></p><br>
        </small>
    </div>
  </section>`;
    to.innerHTML = template;
  }

  listenToSearchAction() {
    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = document.querySelector('#user').value;
      this.query = query;
      this.checkForUser();
    });
  }

  renderRepositories() {
    let template = '';
    this.user.totalStars = 0;
    if (this.repos.length !== 0) {
      this.repos.forEach((repo) => {
        this.user.totalStars += repo.stargazers_count;
        template += `
        <div class="retro-container is-rounded repo">
        <h5 class="repo-name"><a href="${repo.html_url}" target="_blank"> ${repo.name}</a></h5>
        <i class="nes-icon star"></i> ${repo.stargazers_count}
        <br>
        <br>
        <ul class="nes-list is-disc">
        <li>forks: ${repo.forks_count}</li>
        <li>watchers: ${repo.watchers_count}</li>
        <ul>
        </div>
        `;
      });
    } else {
      template = '<h1 style="color: red;"> This user does not have a repository  </h1>';
    }
    this.renderRepoInformationIn.innerHTML = template;
  }
}


const github = new GitHubFy();
github.listenToSearchAction();
