export interface FenceDto {
    FenceID: string;
    FenceName: string;
    FenceType: string;
    FenceStatus: string;
    InRule: string;
    OutRule: string;
    CreateTime: string;
    LatLon: string;
    Radius: number;
    Numberofequipment?: number;
    IsUnfold?: boolean;
}

export interface FenceListDto {
    items: FenceDto[];
    totalCount: number;
}

export interface FenceCreateDto {
    FenceID?: string;
    FenceName: string;
    FenceType: string;
    FenceStatus: string;
    InRule: string;
    OutRule: string;
    CreateTime: string;
    LatLon: string;
    Radius: number;
}

export interface FenceListRequest {
    fenceId?: string;
    contains?: string;
    serialNumbers?: string;
    model?: string[];
    eqptType?: string[];
}

export interface FenceAddSnDto {
    FenceID: string;
    SerialNumbers: string[];
}

export interface FenceEqListRequest {
    Contains: string;
    SerialNumbers: string;
    Model: string[];
    EqptType: string[];
}

export interface EquipmentModel {
    Id: string;
    EquipmentModelName: string;
}

export interface SelectListItem {
    Value: string;
    Text: string;
}

export interface FenceEqListDto {
    items: Array<{
        SerialNumber: string;
        Model: string;
        Type: string;
        Status: string;
    }>;
    totalCount: number;
}