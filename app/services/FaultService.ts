import api from './api';

// 故障列表接口响应类型
export interface FaultItem {
  serialNumber: string;
  faultCodeSPNFMI: string;
  reportTime: string;
  faultGrade: string;
  faultGradeSort: number;
  faultDescription: string;
  reportLocation: string;
  maintenanceGuide: string;
}

export interface FaultListResponse {
  result: {
    code: string;
    amount: number;
    rows: FaultItem[];
  };
  targetUrl: null;
  success: boolean;
  error: null;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}

export interface FaultListParams {
  serialNumbers: string[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  faultGrade?: string;
  faultCode?: string;
  startTime?: string;
  endTime?: string;
}

class FaultService {
  /**
   * 根据序列号获取设备故障列表
   * @param params 请求参数
   * @returns 故障列表响应
   */
  async getFaultListBySn(params: FaultListParams): Promise<FaultListResponse> {
    try {
      const { 
        serialNumbers, 
        limit = 10, 
        offset = 0, 
        sortBy = '', 
        faultGrade = '', 
        faultCode = '',
        startTime = '',
        endTime = ''
      } = params;
      
      const response = await api.post('/services/app/FaultService/FaultListBySn', {
        limit,
        offset,
        serialNumbers,
        sortBy,
        faultGrade,
        faultCode,
        startTime,
        endTime
      });
      console.log('获取故障列表响应:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('获取故障列表失败:', error);
      throw error;
    }
  }
}

export default new FaultService();
