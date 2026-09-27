const http = require('http');

http.get('http://localhost:3000/api/settings', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.settings && json.settings.about) {
                console.log('About settings exists in API response:', json.settings.about);
            } else {
                console.log('About settings missing in API response');
            }
        } catch(e) {
            console.error('Error parsing response', e.message);
        }
    });
}).on('error', e => {
    console.error('Error making request', e.message);
});
