# Contribution Counters

[![NPM](https://nodei.co/npm/contribution-counters.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/contribution-counters)

[![CodeFactor](https://www.codefactor.io/repository/github/jahidulpabelislam/contribution-counters/badge?style=flat-square)](https://www.codefactor.io/repository/github/jahidulpabelislam/contribution-counters)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f0650e656bae4ca1ba9e9c2809b77991)](https://www.codacy.com/gh/jahidulpabelislam/contribution-counters/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jahidulpabelislam/contribution-counters&amp;utm_campaign=Badge_Grade)
![npm](https://img.shields.io/npm/v/contribution-counters.svg)
![npm](https://img.shields.io/npm/dm/contribution-counters.svg)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/jahidulpabelislam/contribution-counters/2.x.svg?label=last%20activity)
![npm bundle size](https://img.shields.io/bundlephobia/min/contribution-counters.svg)
![NPM](https://img.shields.io/npm/l/contribution-counters.svg)

Have you ever wanted to find out how many repos/projects you've contributed to and with how many commits?
Well, now you can easily do so with this simple to use module!

This contribution counter is for 3 VCSs: GitHub, Bitbucket &amp; GitLab and is achieved via each of their APIs and access tokens.

## Instructions

### Installing

1.  To install locally: `npm install contribution-counters --save`
2.  To install globally: `npm install contribution-counters --global`

### Using module

1.  Import the necessary counter like below:

   `const { getGitHubCounts } = require("contribution-counters");`

2.  Set up the configuration for the selected counter

   The config is an object with the following properties (all available on all counters unless specified):

    -  `username`: Your username (string:required)
    -  `accessToken`: An access token for the user above (string:required)
    -  `minCommits`: The minimum number of commits a repo needs to count as a contribution (int:default=1)
    -  `includeCommits`: Whether to include count of your commits (bool:default=true)
    -  `includeProjects`: Whether to include count of repo/projects you've contributed to (bool:default=true)
    -  `includePullRequests`: Whether to include count of pull/merge request contributions (bool:default=false)

   The below two are only used if a commit doesn't have a real user attached (At least one is required for Bitbucket & GitLab & both optional for GitHub BUT advised to use both for all)

    -  `userEmailAddresses`: Array of email addresses which may be associated with your commits (array)
    -  `userNames`: Array of names which may be associated with your commits (array)

   If you only want counts for after and/or before a particular date (inclusive) (or if you know the date you first and/or last contributed this can be used to minimise API requests)

    -  `fromDate`: Datetime string (ISO-8601 Date/timestamp (YYYY-MM-DDTHH:mm:ss.sssZ))
    -  `untilDate`: Datetime string (ISO-8601 Date/timestamp (YYYY-MM-DDTHH:mm:ss.sssZ))

   To get repos of which you have a minimum access to

    -  `minRepoAccessLevel`: Only for GitLab (int:default=30)\[10, 20, 30, 40, 50] (see [here](https://docs.gitlab.com/ee/api/members.html))
    -  `minRepoRole`: Only for Bitbucket (string:default=contributor)\[admin, contributor, member, owner] (see [here](https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D))
    -  `minRepoRole`: Only for GitHub (comma separated string:default=owner,collaborator,organization_member)\[owner, collaborator, organization_member] (see [here](https://developer.github.com/v3/repos/#parameters))

   If you have a self-hosted GitLab, you will need to use the `url` option

    - `url`: The URL where your GitLab is located at (for example `https://gitlab.jahidulpabelislam.com/` or `https://jahidulpabelislam.com/gitlab/`)

3.  Start the counter with the following:

        ```javascript
        const counts = await getGitHubCounts(config);
        ```

4.  The returned result (`counts`) is an object with one or more properties (based on what you've requested):

      - `commits` total number of your commits
      - `projects` total number of projects you've contributed to
      - `pullRequests` total number of pull/merge requests you've authored

`getGitHubCounts` in the above example can be replaced with `getBitbucketCounts` or `getGitLabCounts`.

### Creating access tokens

  - [GitHub](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)
  - [GitLab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#creating-a-personal-access-token)
  - [Bitbucket](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)

## Upgrading

### v1 to v2

In version 2, the only breaking change is that only functions can be imported/required, instead of Counter classes.

To upgrade you will need to import/require the 3 new functions: `getBitbucketCounts`, `getGitHubCounts` &amp; `getGitLabCounts` instead of `Bitbucket`, `GitHub` &amp; `GitLab`.
Where before you created an instance of a class (e.g. `GitHub`) and passed in an object of config, then called a function (`getCounters`) to get the counts.
Now the new functions will do both in one. So just call the new function and pass in the existing config object as the only parameter and then your counts will be returned.

## Support

If you found this module interesting or useful please spread the word about this module: share on your socials, star on GitHub, etc.

If you find any issues or have any feature requests, you can open an [issue](https://github.com/jahidulpabelislam/contribution-counters/issues) or email [me @ jahidulpabelislam.com](mailto:me@jahidulpabelislam.com) :smirk:.

## Authors

  - [Jahidul Pabel Islam](https://jahidulpabelislam.com/) [<me@jahidulpabelislam.com>](mailto:me@jahidulpabelislam.com)

## Licence

This module is licenced under the General Public Licence - see the [Licence](LICENSE.md) file for details
