import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVERENDPOINT;

const proposal_registry = async (param: any, name: String) => {
    try {
        var res = await axios.post("/api/proposal-registry", {
            param: param,
            name: name,
        });

        if (res.data.status) {
            return res.data;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

// Export Functions
const Action = {
    proposal_registry,
};

export default Action;
