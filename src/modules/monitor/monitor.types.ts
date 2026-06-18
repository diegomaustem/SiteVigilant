export interface InputMonitor {
    periodicityId: number;
    name: string;
    description: string;
    url: string;    
}

export interface Monitor {
    id: number;
    periodicityId: number;
    name: string;
    description: string;
    url: string;
    createdAt : Date;
    updatedAt: Date;
}