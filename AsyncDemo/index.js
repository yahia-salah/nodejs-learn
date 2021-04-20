console.log('Before');

// Callback Named Function
getUser(1, getRepos);

console.log('After');

function getUser(id, callback) {
    setTimeout(() => {
        console.log('Reading a user from database...');
        callback({ id: id, githubUserName: "yahia-salah" });
    }, 2000);
}

function getGitHubRepos(githubUserName, callback) {
    setTimeout(() => {
        console.log('Getting repos from GitHub...');
        callback(['One', 'Two', 'Three']);
    }, (2000));
}

function getRepos(user){
    console.log('User:', user);
    getGitHubRepos(user.githubUserName, displayRepos);
}

function displayRepos(repos) {
    console.log('Repos:', repos);
}