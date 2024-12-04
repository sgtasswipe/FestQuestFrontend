class UnsplashAPI {
    constructor() {
        this.ACCESS_KEY = "rwTK8Bqlzzqmvf05Slh20N2Z92il3u_NYt5_mhD5V_Q";
    }

    async searchImages(query) {
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${query}&per_page=21`,
                {
                    headers: {
                        'Authorization': `Client-ID ${this.ACCESS_KEY}`
                    }
                }
            );
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    }
}

export default UnsplashAPI;
