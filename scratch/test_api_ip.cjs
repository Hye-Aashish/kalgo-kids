const axios = require('axios');
(async () => {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/home-sections');
        console.log('SUCCESS:', res.data);
    } catch (err) {
        console.log('FAILED:', err.response ? err.response.data : err.message);
    }
})();
