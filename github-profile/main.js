class GitHubFy {
  constructor({
    searchForm, repoList, searchUserInput, searchUserBtn, sortByRadios,
  }) {
    this.headers = {
      Authorization: 'token 7780b41a1bbd1a474133226c842cebaaba84e84d',
    };
    this.searchForm = searchForm;
    this.renderRepoInformationIn = repoList;
    this.searchUserInput = searchUserInput;
    this.searchUserBtn = searchUserBtn;
    this.busy = false;
    this.similarUsers = { total_count: 0 };
    this.sortByRadios = sortByRadios;
    this.sortBy = 'Stars';
  }

  async checkForUser() {
    this.cleanErrors();
    await this.searchUser();
    if (this.user.message !== 'Not Found') {
      await this.getRepos();
      this.updateSortBy();
      this.renderRepositories();
      this.renderUserBio();
    } else {
      await this.searchSimilarUsers();
      this.notFound();
    }
    this.searchUserBtn.classList.remove('busy');
    this.busy = false;
  }

  async searchUser() {
    this.busy = true;
    this.searchUserBtn.classList.add('busy');
    const user = await fetch(`https://api.github.com/users/${this.query}`, { headers: this.headers });
    this.user = await user.json().then(userJson => userJson);
  }

  async getRepos() {
    const repos = await fetch(`https://api.github.com/users/${this.query}/repos`, { headers: this.headers });
    this.repos = await repos.json().then(repoJson => repoJson);
  }

  async searchSimilarUsers() {
    this.busy = true;
    this.searchUserBtn.classList.add('busy');
    const similarUsers = await fetch(`https://api.github.com/search/users?q=${this.query}`, { headers: this.headers });
    this.similarUsers = await similarUsers.json().then(userJson => userJson);
  }

  static isnull(value, defaultValue) {
    if (value === null || value === '') {
      return defaultValue;
    }

    return value;
  }

  notFound() {
    let reason = `User '${this.query}' not found,try with this one: `;
    let userList = '';
    if (this.similarUsers.total_count === 0) {
      reason = 'You are the first to think about that name, try  with another one';
    } else {
      const suggestedUser = this.similarUsers.items[0].login;
      userList = `<span >${suggestedUser}</span>`;
      this.searchUserInput.value = suggestedUser;
      reason += userList;
    }
    document.querySelector('#reason').innerHTML = reason;
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
            <h3 class="title truncate-text">${name}</h3>
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
        <small class="truncate-text"> company: ${company} <br> 
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
      const regex = RegExp('^[a-zA-Z0-9]');
      if ((this.busy === false) && (this.query !== query) && (regex.test(query))) {
        this.query = query;
        this.checkForUser();
      }
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
        <h5 class="repo-name truncate-text"><a href="${repo.html_url}" target="_blank"> ${repo.name}</a></h5>
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

  addListenerToSortRadios() {
    this.sortByRadios.forEach((radio) => {
      radio.addEventListener('click', (event) => {
        event.stopPropagation();
        this.sortBy = radio.value;
        this.updateSortBy();
        if (this.query !== undefined) {
          this.renderRepositories();
        }
      });
    });
  }

  updateSortBy() {
    if (this.repos !== undefined) {
      let compare = null;
      switch (this.sortBy) {
        case 'Stars':
          compare = 'stargazers_count';
          break;
        case 'Forks':
          compare = 'forks_count';
          break;
        case 'Watchers':
          compare = 'watchers_count';
          break;
        default:
          compare = 'stargazers_count';
          break;
      }
      this.repos = this.repos.sort((a, b) => (a[compare] > b[compare] ? -1 : 1));
    }
  }
}

const UI = {
  searchForm: document.querySelector('#searchForm'),
  repoList: document.querySelector('#repoInfo'),
  searchUserInput: document.querySelector('#user'),
  searchUserBtn: document.querySelector('#submit'),
  sortByRadios: document.querySelectorAll('input[name="starSort"]'),
};
const github = new GitHubFy(UI);
github.addListenerToSortRadios();
github.listenToSearchAction();
