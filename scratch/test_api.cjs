const axios = require('axios');
(async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/home-sections', {
            title: "Test Section",
            highlight: "Test",
            productIds: []
        });
        console.log('SUCCESS:', res.data);
    } catch (err) {
        console.log('FAILED:', err.response ? err.response.data : err.message);
    }
})();
