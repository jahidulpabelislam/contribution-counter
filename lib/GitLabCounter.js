;/**
 * The API wrapper to generate counts for GitLab, extending/overwriting the base BaseCounter class/functions.
 *
 * @author Jahidul Pabel Islam <me@jahidulpabelislam.com>
 * @copyright (c) 2010 - 2022 JPI
 * @license: GPL-3.0
 */

const BaseCounter = require("./BaseCounter");

class GitLabCounter extends BaseCounter {

    constructor(config) {
        super(config);

        // Define the endpoint and params to use in the getAllRepos function in BaseCounter

        this.relativeAPIEndpoint = "api/v4";

        let apiEndpoint = `https://gitlab.com/${this.relativeAPIEndpoint}`;
        if ({}.hasOwnProperty.call(config, "url")) {
            apiEndpoint = this.buildAPIEndpoint(config.url);
        }
        this.reposEndpoint = `${apiEndpoint}/projects`;

        this.reposParams = {
            min_access_level: config.minRepoAccessLevel || 30,
            simple: true,
            per_page: this.itemsPerPage,
            page: 1,
            order_by: "updated_at",
            direction: "desc",
        };
        this.repoUpdatedAtField = "last_activity_at";
        this.repoCreatedAtField = "created_at";
    }

    buildAPIEndpoint(baseURL) {
        const relativeEndpoint = this.relativeAPIEndpoint;

        baseURL = BaseCounter.removeSlashes(baseURL);

        // If base URL already has the API part of the URL remove to format it the way we want
        if (baseURL.substr(-relativeEndpoint.length) === relativeEndpoint) {
            baseURL = baseURL.substr(0, baseURL.length - relativeEndpoint.length);
            baseURL = BaseCounter.removeSlashes(baseURL);
        }

        // Make sure the protocol is included
        if (!baseURL.startsWith("https://") && !baseURL.startsWith("http://")) {
            baseURL = `http://${baseURL}`;
        }

        return `${baseURL}/${relativeEndpoint}`;
    }

    /**
     * Extend the base function to override the auth property as GitLab doesn't use Auth
     * Instead done via a 'Private Token' in the headers
     */
    async getFromAPI(endpoint, params = {}, extraOptions = {}) {
        const options = {
            headers: {
                "Private-Token": this.accessToken,
            },
            auth: {},
            ...extraOptions,
        };
        return super.getFromAPI(endpoint, params, options);
    }

    /**
     * A recursive function to get an array of ALL pull requests created by user in a repo.
     * (so loop until there is no next page)
     */
    async getUsersRepoPullRequestsCount(endpoint, params = {}) {
        const pullRequests = await this.getFromAPI(endpoint, params);
        if (!pullRequests || !pullRequests.length) {
            return 0;
        }

        let count = 0;

        const self = this;
        pullRequests.forEach(function(pullRequest) {
            if (
                pullRequest.state !== "closed" &&
                pullRequest.author &&
                pullRequest.author.username == self.username
            ) {
                count++;
            }
        });

        // If this response has the max try next page
        if (pullRequests.length === this.itemsPerPage) {
            params.page++;
            count += await this.getUsersRepoPullRequestsCount(endpoint, params);
        }

        return count;
    }

    async getUsersRepoPullRequestsCountAll(repo) {
        const endpoint = `${this.reposEndpoint}/${repo.id}/merge_requests`;
        const params = {
            per_page: this.itemsPerPage,
            page: 1,
        };

        // Only add since/from values if dates are set
        if (this.fromDate) {
            params.created_after = this.fromDate;
        }
        if (this.untilDate) {
            params.created_before = this.untilDate;
        }

        return this.getUsersRepoPullRequestsCount(endpoint, params);
    }

    /**
     * Return whether or not the author of the commit is the requested user
     */
    isCommitter(commit) {
        return (
            commit && (
                this.userEmailAddresses.indexOf(commit.author_email) !== -1 ||
                this.userNames.indexOf(commit.author_name) !== -1
            )
        );
    }

    shouldAddCommit(commit) {
        // If this commit has more than one parent commit, assume it's a merge commit
        if (commit.parent_ids && commit.parent_ids.length > 1) {
            return false;
        }

        return this.isCommitter(commit);
    }

    /**
     * A recursive function to get total count of ALL commits by a user in a particular repo,
     * so loop until there is no next page
     */
    async getUsersRepoCommitsCount(endpoint, params = {}, usersCommitsCount = 0) {
        if (this.includeCommits === false && usersCommitsCount >= this.minCommits) {
            return;
        }

        const commits = await this.getFromAPI(endpoint, params);
        if (!commits || !commits.length) {
            return usersCommitsCount;
        }

        const self = this;
        commits.forEach(function(commit) {
            if (self.shouldAddCommit(commit)) {
                usersCommitsCount++;
            }
        });

        // If this response has the max items try next page
        if (commits.length === this.itemsPerPage) {
            params.page++;
            usersCommitsCount = await this.getUsersRepoCommitsCount(endpoint, params, usersCommitsCount);
        }

        return usersCommitsCount;
    }

    /**
     * Wrapper function around getUsersRepoCommitsCount to trigger the first recursive repo commits GET call
     */
    async getUsersRepoCommitsCountAll(repo) {
        const endpoint = `${this.reposEndpoint}/${repo.id}/repository/commits`;
        const params = {
            all: true,
            per_page: this.itemsPerPage,
            page: 1,
        };

        // Only add since/from values if dates are set
        if (this.fromDate) {
            params.since = this.fromDate;
        }
        if (this.untilDate) {
            params.until = this.untilDate;
        }

        return this.getUsersRepoCommitsCount(endpoint, params);
    }
}

module.exports = GitLabCounter;
