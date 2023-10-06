export default class Http {
    
    private static BASE_URL: string = 'http://127.0.0.1:5000';

    public static get(endpoint: string, params: object = {}): Promise<any> {
        const url = new URL(`${this.BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        return fetch(url.toString())
            .then(response => this.processResponse(response));
    }

    public static post(endpoint: string, body: object = {}): Promise<any> {
        return fetch(`${this.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => this.processResponse(response));
    }

    private static processResponse(response: Response): Promise<any> {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(data => {
                throw new Error(data.message || 'Server Error');
            });
        }
    }
}