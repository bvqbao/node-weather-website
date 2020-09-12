export default class ExternalJsonData {
    error: string;
    data: any;

    constructor(error: string, data: any) {
        this.error = error
        this.data = data
    }
}