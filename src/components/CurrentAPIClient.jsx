
// Class for handling the fetch requests - 
class CurrentsAPIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // main fetch function - 
    async fetchArticles(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                return { status: false, data: response };
                // throw new Error(`Error fetching articles: ${response.statusText}`);
            }
            let data = await response.json();
            return { status: true, data };
        } catch (error) {
            return { status: false, data: error };
        }
    }

    // fetch function for category - 
    async fetchArticlesByCategory(category, page) {
        let url = `https://api.currentsapi.services/v1/latest-news?category=${category}&language=en&page_number=${page}&apiKey=${this.apiKey}`;
        return await this.fetchArticles(url);
    }

    // fetch function for latest news - 
    async fetchLatestNews(page) {
        let url = `https://api.currentsapi.services/v1/latest-news?language=en&page_number=${page}&apiKey=${this.apiKey}`;
        return await this.fetchArticles(url);
    }

    // fetch function for news articles by query -
    async fetchArticlesByQuery(query, page) {
        const encodedQuery = encodeURIComponent(query);
        let url = `https://api.currentsapi.services/v1/search?keywords=${encodedQuery}&language=en&page_number=${page}&apiKey=${this.apiKey}`;

        return await this.fetchArticles(url);
    }

    // fetch function for news articles by query -
    async fetchArticlesByQAndC(query, category, page) {
        const encodedQuery = encodeURIComponent(query);
        let url = `https://api.currentsapi.services/v1/search?keywords=${encodedQuery}&category=${category}&language=en&page_number=${page}&apiKey=${this.apiKey}`;
        return await this.fetchArticles(url);
    }
}

export default CurrentsAPIClient;