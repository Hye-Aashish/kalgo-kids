const axios = require('axios');
(async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/products');
        console.log('SUCCESS: Products fetched');
    } catch (err) {
        console.log('FAILED:', err.response ? err.response.data : err.message);
    }
})();
