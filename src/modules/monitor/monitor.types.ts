export interface InputMonitor {
    periodicityId: number;
    name: string;
    description: string;
    url: string;    
}

export interface CreatedMonitor {
    id: number;
    periodicityId: number;
    name: string;
    description: string;
    url: string;
    createdAt : Date;
    updatedAt: Date;
}

export interface ListMonitors {
    id: number;
    periodicity_id: number;
    name: string;
    description: string;
    url: string;
    created_at : Date;
    updated_at: Date;
}