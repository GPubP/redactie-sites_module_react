import ky from 'ky';

// Create ky instance with defaults
const api: any = ky.create({
	prefixUrl: '/proxy/sites-engine',
});

export default api;
