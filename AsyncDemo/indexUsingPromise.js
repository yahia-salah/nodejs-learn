console.log('Before');

// const p1 = getUser(1);
// p1.then(user => {
//     console.log('User', user);
//     const p2 = getGitHubRepos(user.githubUserName);
//     p2.then(repos => {
//         console.log('Repos', repos);
//     })
// });

// getUser(1).then(user => getGitHubRepos(user.githubUserName))
//     .then(repos => { console.log(repos) })
//     .catch(err => console.error(err.message));

async function getRepos() {
    try {
        const user = await getUser(1);
        const repos = await getGitHubRepos(user.githubUserName);
        console.log(repos);
    }
    catch (err) {
        console.log(err.message);
    }
}
getRepos();

console.log('After');

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Reading a user from database...');
            resolve({ id: id, githubUserName: "yahia-salah" });
        }, 2000);
    });
}

function getGitHubRepos(githubUserName) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Getting repos from GitHub...');
            resolve(['One', 'Two', 'Three']);
            //reject(new Error('Unreachable API...'));
        }, (2000));
    });
}
