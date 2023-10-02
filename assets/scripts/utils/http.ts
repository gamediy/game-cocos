
export  class http{


    static baseUrl:string=""
  
       static get(url: string, params: object, callback: (err: any, response: any) => void) {
        const xhr = new XMLHttpRequest();
        url = `${this.baseUrl+url}?${this._paramStringify(params)}`;

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    callback(null, JSON.parse(xhr.responseText));
                } else {
                    callback(new Error('Request failed'), null);
                }
            }
        };
        xhr.send();
    }

    static post(url: string, data: object, callback: (err: any, response: any) => void) {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', this.baseUrl+url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    callback(null, JSON.parse(xhr.responseText));
                } else {
                    callback(new Error('Request failed'), null);
                }
            }
        };
        xhr.send(JSON.stringify(data));
    }

        private static _paramStringify(params: object): string {
            let queryString = '';
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                    if (queryString) queryString += '&';
                    queryString += `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`;
                }
            }
    return queryString;
        }
}
