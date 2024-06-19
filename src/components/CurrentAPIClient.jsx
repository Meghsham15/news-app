class CurrentsAPIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

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

    async fetchArticlesByCategory(category, page) {
        let url = `https://api.currentsapi.services/v1/latest-news?category=${category}&language=en&page_number=${page}&apiKey=${this.apiKey}`;
        return await this.fetchArticles(url);
    }

    async fetchLatestNews(page) {
        let url = `https://api.currentsapi.services/v1/latest-news?language=en&page_number=${page}&apiKey=${this.apiKey}`;
        return await this.fetchArticles(url);
    }

    async fetchArticlesByQuery(query, page) {
        const encodedQuery = encodeURIComponent(query);
        let url = `https://api.currentsapi.services/v1/search?keywords=${encodedQuery}&language=en&page_number=${page}&apiKey=${this.apiKey}`;

        return await this.fetchArticles(url);
    }

    async fetchArticlesByQueryAndCategory(query,category, page) {
        query = encodeURIComponent(query);
        let url = `https://api.currentsapi.services/v1/search?keywords=${query}&category=${category}&language=en&page_number=${page}&apiKey=${this.apiKey}`;

        return await this.fetchArticles(url);
    }
}

export default CurrentsAPIClient;