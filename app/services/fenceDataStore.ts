import { Alert } from 'react-native';
import { networkManager } from '../utils/NetworkStateManager';
import api from './api';
import {
    EquipmentModel,
    FenceAddSnDto,
    FenceCreateDto,
    FenceDto,
    FenceEqListDto,
    FenceEqListRequest,
    FenceListDto,
    FenceListRequest,
    SelectListItem
} from './types/fence';

class FenceDataStore {
    private logTag = 'FenceDataStore';

    /**
     * Get fence list by text search
     */
    async getFenceList(searchTxt: string): Promise<FenceListDto> {
        const url = `/services/app/Yingyanservice/GetBDFenceListByTxt?searchTxt=${encodeURIComponent(searchTxt)}`;
        console.log(`${this.logTag}.getFenceList - Full URL:`, url);
        try {
            const response = await api.post(url);

            const result = response.data;

            // If we were offline before but now got a successful response
            if (networkManager.getIsOffline()) {
                networkManager.setIsOffline(false);
            }

            // Check if the request was successful
            if (!result.success) {
                return { items: [], totalCount: 0 };
            }

            // Return the data
            return { 
                items: result.result || [], 
                totalCount: result.result?.length || 0 
            };

        } catch (error: any) {
            console.error(`${this.logTag}.getFenceList error:`, error);

            // Handle network error (status code 0)
            if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
                networkManager.setIsOffline(true);
                return { items: [], totalCount: 0 };
            }

            // Handle specific HTTP status codes
            if (error.response) {
                const status = error.response.status;

                // Handle server errors (500)
                if (status === 500) {
                    return { items: [], totalCount: 0 };
                }

                // Handle bad gateway, not found, or method not allowed
                if (status === 502 || status === 404 || status === 405) {
                    Alert.alert('Notice', 'Server is currently upgrading');
                    return { items: [], totalCount: 0 };
                }
            }

            // Handle JSON parse errors
            if (error instanceof SyntaxError) {
                Alert.alert('Notice', 'Server is currently upgrading');
                return { items: [], totalCount: 0 };
            }

            // For any other errors, return empty result
            return { items: [], totalCount: 0 };
        }
    }

    /**
     * Get fence list by model and other criteria
     */
    async getFenceListByModel(request: FenceListRequest): Promise<FenceListDto> {
        const url = '/services/app/Yingyanservice/GetBDFenceListByModel';
        console.log(`${this.logTag}.getFenceListByModel - Full URL:`, url);
        console.log(`${this.logTag}.getFenceListByModel - Request body:`, JSON.stringify(request, null, 2));
        try {
            const response = await api.post(url, request);

            const result = response.data;

            // If we were offline before but now got a successful response
            if (networkManager.getIsOffline()) {
                networkManager.setIsOffline(false);
            }

            // Check if the request was successful
            if (!result.success || !result.result) {
                return { items: [], totalCount: 0 };
            }

            // Return the data
            return { 
                items: result.result || [], 
                totalCount: result.result?.length || 0 
            };

        } catch (error: any) {
            console.error(`${this.logTag}.getFenceListByModel error:`, error);

            // Handle network error (status code 0)
            if (!error.response || error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
                networkManager.setIsOffline(true);
                return { items: [], totalCount: 0 };
            }

            // Handle specific HTTP status codes
            if (error.response) {
                const status = error.response.status;

                // Handle server errors (500)
                if (status === 500) {
                    return { items: [], totalCount: 0 };
                }

                // Handle bad gateway, not found, or method not allowed
                if (status === 502 || status === 404 || status === 405) {
                    Alert.alert('Notice', 'Server is currently upgrading');
                    return { items: [], totalCount: 0 };
                }
            }

            // Handle JSON parse errors
            if (error instanceof SyntaxError) {
                Alert.alert('Notice', 'Server is currently upgrading');
                return { items: [], totalCount: 0 };
            }

            // For any other errors, return empty result
            return { items: [], totalCount: 0 };
        }
    }

    /**
     * Check fence number
     */
    async checkFenceNumber(): Promise<FenceListDto> {
        console.log(`${this.logTag}.checkFenceNumber`);
        try {
            const fenceListRequest: FenceListRequest = {
                fenceId: '',
                model: [],
                eqptType: [],
                serialNumbers: '',
                contains: ''
            };
            return await this.getFenceListByModel(fenceListRequest);
        } catch (error) {
            console.error(`${this.logTag}.checkFenceNumber error:`, error);
            return { items: [], totalCount: 0 };
        }
    }

    /**
     * Create new fence
     */
    async createFence(fence: Omit<FenceDto, 'FenceID'>): Promise<string> {
        console.log(`${this.logTag}.createFence`);
        try {
            const fenceCreateDto: FenceCreateDto = {
                FenceName: fence.FenceName,
                FenceType: fence.FenceType,
                FenceStatus: fence.FenceStatus,
                InRule: fence.InRule,
                OutRule: fence.OutRule,
                CreateTime: fence.CreateTime,
                LatLon: fence.LatLon,
                Radius: fence.Radius,
            };
            const response = await api.post('/services/app/Fence/CreateNewFence', fenceCreateDto);
            return response.data.result;
        } catch (error) {
            console.error(`${this.logTag}.createFence error:`, error);
            throw error;
        }
    }

    /**
     * Update existing fence
     */
    async updateFence(fence: FenceDto): Promise<string> {
        console.log(`${this.logTag}.updateFence`);
        try {
            const fenceCreateDto: FenceCreateDto = {
                FenceID: fence.FenceID,
                FenceName: fence.FenceName,
                FenceType: fence.FenceType,
                FenceStatus: fence.FenceStatus,
                InRule: fence.InRule,
                OutRule: fence.OutRule,
                CreateTime: fence.CreateTime,
                LatLon: fence.LatLon,
                Radius: fence.Radius,
            };
            const response = await api.post('/services/app/Fence/UpdateFence', fenceCreateDto);
            return response.data.result;
        } catch (error) {
            console.error(`${this.logTag}.updateFence error:`, error);
            throw error;
        }
    }

    /**
     * Delete fence by ID
     */
    async deleteFence(fenceId: string): Promise<boolean> {
        console.log(`${this.logTag}.deleteFence`);
        try {
            const fenceIdArray = fenceId.split(',');
            const response = await api.post('/services/app/Fence/DeleteFence', fenceIdArray);
            return response.data.result;
        } catch (error) {
            console.error(`${this.logTag}.deleteFence error:`, error);
            throw error;
        }
    }

    /**
     * Set fence serial numbers
     */
    async setFenceSn(fenceID: string, serialnumbers: string[]): Promise<boolean> {
        console.log(`${this.logTag}.setFenceSn: FenceID${fenceID}`);
        try {
            const fenceAddSnDto: FenceAddSnDto = {
                FenceID: fenceID,
                SerialNumbers: serialnumbers
            };
            const response = await api.post('/services/app/Fence/SetFenceSn', fenceAddSnDto);
            return response.data.result;
        } catch (error) {
            console.error(`${this.logTag}.setFenceSn error:`, error);
            throw error;
        }
    }

    /**
     * Load fence detail by ID
     */
    async loadFenceDetail(fenceID: string): Promise<FenceListDto> {
        console.log(`${this.logTag}.loadFenceDetail`);
        try {
            const fenceListRequest: FenceListRequest = {
                fenceId: fenceID,
                contains: '',
                serialNumbers: '',
                model: [],
                eqptType: [],
            };
            const response = await api.post('/services/app/Fence/GetFenceListByModel', fenceListRequest);
            return response.data.result;
        } catch (error) {
            console.error(`${this.logTag}.loadFenceDetail error:`, error);
            throw error;
        }
    }

    /**
     * Get equipment list
     */
    async getEquipmentList(
        contains: string,
        serialNumbers: string,
        models: string | null,
        eqptTypes: string[]
    ): Promise<FenceEqListDto> {
        console.log(`${this.logTag}.getEquipmentList`);
        try {
            const tempModel = models?.length ? models.split(',') : [];
            
            const fenceEqListRequest: FenceEqListRequest = {
                Contains: contains,
                SerialNumbers: serialNumbers,
                Model: tempModel,
                EqptType: eqptTypes
            };

            const response = await api.post('/services/app/Fence/GetFenceEqList', fenceEqListRequest);
            return response.data.result;
        } catch (error) {
            console.error(`${this.logTag}.getEquipmentList error:`, error);
            throw error;
        }
    }

    /**
     * Get equipment model list
     */
    async getEquipmentModelList(): Promise<EquipmentModel[]> {
        console.log(`${this.logTag}.getEquipmentModelList`);
        try {
            const response = await api.get('/services/app/Fence/GetEquipmentModelList');
            const equipmentModelItems: SelectListItem[] = response.data.result;

            if (!equipmentModelItems) return [];

            return equipmentModelItems.map(item => ({
                Id: item.Value,
                EquipmentModelName: item.Text
            }));
        } catch (error) {
            console.error(`${this.logTag}.getEquipmentModelList error:`, error);
            throw error;
        }
    }
}

// Create a singleton instance
const fenceDataStore = new FenceDataStore();
export default fenceDataStore;