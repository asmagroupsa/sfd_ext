export interface BaseEntity {
    id?: any;
};

export interface CreateByEntity {
    createdBy?: string;
    createdDate?: Date;
    lastModifiedBy?: string;
    lastModifiedDate?: Date;
};
