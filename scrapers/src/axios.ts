import Axios from "axios";

/**
 * A configured axios instance, always use
 */
const axios = Axios.create({
    // Be a good neighbour and always send honest user agents as well as a contact
    // This makes it easy for institutions to track any impact the scrapers have on their systems and contact about it
    headers: {
        'User-Agent': 'Uni Final 1.0',  // version is not important, just keep it constant
        'From': 'https://github.com/gricey432/unifinal',
    }
});

export default axios;
