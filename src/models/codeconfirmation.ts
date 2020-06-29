import { ApiResponse } from "./response.class";

export class CodeConfirmation extends ApiResponse {
    
    constructor(success: boolean, message: string, code: string, validForSeconds: number)
    {
        super(success, message);
        this.code = code;
        this.validForSeconds = validForSeconds;
    }

    public code: string;
    public validForSeconds: number;
}