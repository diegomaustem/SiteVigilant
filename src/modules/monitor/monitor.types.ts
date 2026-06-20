export interface InputMonitor {
    userId: number;
    periodicityId: number;
    name: string;
    description: string;
    url: string;    
}

export interface Monitor {
    id: number;
    userId: number;
    periodicityId: number;
    name: string;
    description: string;
    url: string;
    createdAt : Date;
    updatedAt: Date;
}