import { DepotsService } from './depots.service';
export declare class DepotsController {
    private readonly depotsService;
    constructor(depotsService: DepotsService);
    findAll(): Promise<any>;
    create(body: {
        name: string;
        location?: string;
        type: string;
    }): Promise<any>;
}
