class GitHubFy {
  constructor() {
    this.headers = {
      Authorization: 'token 7780b41a1bbd1a474133226c842cebaaba84e84d',
    };
    this.searchForm = document.querySelector('#searchForm');
  }

  search(query) {
    fetch(`https://api.github.com/users/${query}`, { headers: this.headers })
      .then((data) => {
        this.user = data.json();
      });
  }

  listenToSearchAction() {
    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = document.querySelector('#user').value;
      this.search(query);
    });
  }
}


const github = new GitHubFy();
github.listenToSearchAction();
