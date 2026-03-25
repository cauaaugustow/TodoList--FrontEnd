
import axios from "axios";
import type { Label } from "../types/label";

const API_URL = import.meta.env.VITE_API_URL;

export const getLabels = async (): Promise<Label[]> => {

    const response = await axios.get<Label[]>(
        `${API_URL}/labels`
    );

    console.log("Labels obtidas do servidor:", response.data);

    return response.data;

}
