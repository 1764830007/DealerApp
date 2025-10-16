import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// 工单接口定义
export interface WorkOrder {
  code: string;
  status: string;
  productModel: string;
  serialNumber: string;
  reportTime: string;
  constructionSite: string;
  maintenanceDept: string;
}

export interface WorkOrderResponse {
  success: boolean;
  result: {
    data: any[];
    amount: number;
  };
  error?: string;
}

export interface WorkOrderParams {
  limit?: number;
  offset?: number;
  createByUser?: string | null;
  workOrderNoOrMachineNo?: string | null;
  workOrderSource?: string | null;
  onsiteOrNot?: string | null;
  status?: number[];
  type?: string | null;
  dealer?: string | null;
  orderByLastUpdatedTime?: boolean;
  department?: string | null;
}

export interface WorkOrderSegStatusParams {
  limit?: number;
  offset?: number;
  segStatusIds?: number[];
  onsiteOrNot?: string;
  workOrderNoOrMachineNo?: string | null;
  orderByLastUpdatedTime?: boolean;
}

class WorkOrderService {
  /**
   * 根据参数获取工单列表
   * @param params 请求参数
   * @returns 工单响应
   */
  async getWorkOrdersByParameters(params: WorkOrderParams): Promise<WorkOrderResponse> {
    try {
      const response = await api.post('/services/app/WorkOrderService/GetWorkOrdersByParameters', params);
      return response.data;
    } catch (error) {
      console.error('获取工单列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据分段状态获取工单列表
   * @param params 请求参数
   * @returns 工单响应
   */
  async getWorkOrdersBySegStatus(params: WorkOrderSegStatusParams): Promise<WorkOrderResponse> {
    try {
      const response = await api.post('/services/app/WorkOrderService/GetWorkOrdersBySegStatus', params);
      return response.data;
    } catch (error) {
      console.error('根据分段状态获取工单列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据权限获取待派工参数配置
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 参数配置
   */
  async getPendingAssignmentParams(
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean
  ): Promise<WorkOrderParams> {
    const currentUser = await AsyncStorage.getItem('userLoginName');
    
    console.log('待派工权限状态', hasWorkOrderCreate, hasWorkOrderAssign, hasWorkOrderExecute);
    
    // 申请权限
    if (hasWorkOrderCreate && !hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取待派工参数 - 申请权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: currentUser,
        workOrderNoOrMachineNo: null,
        workOrderSource: "代理提报",
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: true,
        department: null
      };
    }
    
    // 派工权限
    if (!hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取待派工参数 - 派工权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 执行权限
    if (!hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待派工参数 - 执行权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 申请+派工权限
    if (hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取待派工参数 - 申请+派工权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 申请+执行权限
    if (hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待派工参数 - 申请+执行权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: currentUser,
        workOrderNoOrMachineNo: null,
        workOrderSource: "代理提报",
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 派工+执行权限
    if (!hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待派工参数 - 派工+执行权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 申请+派工+执行权限
    if (hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待派工参数 - 申请+派工+执行权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [1],
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 默认使用派工权限的参数
    return {
      limit: 1000,
      offset: 0,
      createByUser: null,
      workOrderNoOrMachineNo: null,
      workOrderSource: null,
      onsiteOrNot: null,
      status: [1],
      type: null,
      dealer: null,
      orderByLastUpdatedTime: false,
      department: null
    };
  }

  /**
   * 根据权限获取待出发参数配置
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 参数配置
   */
  async getPendingDepartParams(
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean
  ): Promise<any> {
    const currentUser = await AsyncStorage.getItem('userLoginName');
    
    // 申请权限
    if (hasWorkOrderCreate && !hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取待出发参数 - 申请权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [3],  // 待出发状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 派工权限
    if (!hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取待出发参数 - 派工权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [3],  // 待出发状态ID
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 执行权限
    if (!hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待出发参数 - 执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [3],  // 待出发状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 申请+派工权限
    if (hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取待出发参数 - 申请+派工权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [3],  // 待出发状态ID
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 申请+执行权限
    if (hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待出发参数 - 申请+执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [3],  // 待出发状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 派工+执行权限
    if (!hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待出发参数 - 派工+执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [3],  // 待出发状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 申请+派工+执行权限
    if (hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取待出发参数 - 申请+派工+执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [3],  // 待出发状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 默认使用执行权限的参数
    return {
      limit: 1000,
      offset: 0,
      segStatusIds: [3],  // 待出发状态ID
      onsiteOrNot: 'Y',
      workOrderNoOrMachineNo: null
    };
  }

  /**
   * 根据权限获取进行中参数配置
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 参数配置
   */
  async getInProgressParams(
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean
  ): Promise<any> {
    const currentUser = await AsyncStorage.getItem('userLoginName');
    
    // 申请权限
    if (hasWorkOrderCreate && !hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取进行中参数 - 申请权限');
      return {
        limit: 1000,
        offset: 0,
        segStatusIds: [4],  // 进行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 派工权限
    if (!hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取进行中参数 - 派工权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [4,5,6,8],  // 进行中状态ID
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 执行权限
    if (!hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取进行中参数 - 执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [4,5,6,8],  // 进行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 申请+派工权限
    if (hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
      console.log('获取进行中参数 - 申请+派工权限');
      return {
        limit: 2,
        offset: 0,
        createByUser: null,
        workOrderNoOrMachineNo: null,
        workOrderSource: null,
        onsiteOrNot: null,
        status: [4,5,6,8],  // 进行中状态ID
        type: null,
        dealer: null,
        orderByLastUpdatedTime: false,
        department: null
      };
    }
    
    // 申请+执行权限
    if (hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取进行中参数 - 申请+执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [4,5,6,8],  // 进行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 派工+执行权限
    if (!hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取进行中参数 - 派工+执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [4,5,6,8],  // 进行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 申请+派工+执行权限
    if (hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
      console.log('获取进行中参数 - 申请+派工+执行权限');
      return {
        limit: 2,
        offset: 0,
        segStatusIds: [4,5,6,8],  // 进行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
    }
    
    // 默认使用执行权限的参数
    return {
      limit: 1000,
      offset: 0,
      segStatusIds: [4],  // 进行中状态ID
      onsiteOrNot: 'Y',
      workOrderNoOrMachineNo: null
    };
  }

  /**
   * 根据segStatusIds获取工单数量
   * @param segStatusId 状态ID
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 工单数量
   */
  async fetchOrderSegCount(
    segStatusId: number,
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean
  ): Promise<number> {
    try {
      let requestParams: any;
      
      requestParams = await this.getPendingAssignmentParams(hasWorkOrderCreate, hasWorkOrderAssign, hasWorkOrderExecute);
      console.log(`待派工请求参数 `, requestParams);
      const response = await this.getWorkOrdersByParameters(requestParams);
      console.log(`获取segStatusId=${segStatusId}的API响应数据:`, response);

      // 验证响应有效性：成功且有result.data，则orderSegNo数量 = data数组长度
      if (response.success && response.result?.data) {
        return response.result.amount;
      }
      console.warn(`获取segStatusId=${segStatusId}数据失败，返回0`);
      return 0;
    } catch (err: any) {
      console.error(`获取segStatusId=${segStatusId}错误:`, err.response?.data?.error?.message || err.message);
      return 0;
    }
  }

  /**
   * 获取待出发数量
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 待出发数量
   */
  async fetchPendingDepartCount(
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean
  ): Promise<number> {
    try {
      const requestParams = await this.getPendingDepartParams(hasWorkOrderCreate, hasWorkOrderAssign, hasWorkOrderExecute);
      let response: any;
      
      // 根据权限选择不同的API
      if ((!hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) || 
          (hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute)) {
        // 派工权限和申请+派工权限使用GetWorkOrdersByParameters API
        response = await this.getWorkOrdersByParameters(requestParams);
      } else {
        // 其他权限使用GetWorkOrdersBySegStatus API
        response = await this.getWorkOrdersBySegStatus(requestParams);
      }
      
      const data = response;
      //console.log('获取待出发数量的API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则数量 = data数组长度
      if (data.success && data.result?.data) {
        return data.result.data.length;
      }
      console.warn('获取待出发数量失败，返回0');
      return 0;
    } catch (err: any) {
      console.error('获取待出发数量错误:', err.response?.data?.error?.message || err.message);
      return 0;
    }
  }

  /**
   * 获取进行中数量
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 进行中数量
   */
  async fetchInProgressCount(
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean
  ): Promise<number> {
    try {
      const requestParams = await this.getInProgressParams(hasWorkOrderCreate, hasWorkOrderAssign, hasWorkOrderExecute);
      let response: any;
      
      // 根据权限选择不同的API
      if ((!hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) || 
          (hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute)) {
        // 派工权限和申请+派工权限使用GetWorkOrdersByParameters API
        response = await this.getWorkOrdersByParameters(requestParams);
      } else {
        // 其他权限使用GetWorkOrdersBySegStatus API
        response = await this.getWorkOrdersBySegStatus(requestParams);
      }
      
      const data = response;
      //console.log('获取进行中数量的API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则数量 = data数组长度
      if (data.success && data.result?.data) {
        return data.result.data.length;
      }
      console.warn('获取进行中数量失败，返回0');
      return 0;
    } catch (err: any) {
      console.error('获取进行中数量错误:', err.response?.data?.error?.message || err.message);
      return 0;
    }
  }

  /**
   * 获取最新工单
   * @param hasWorkOrderExecute 是否有执行权限
   * @returns 最新工单
   */
  async fetchLatestWorkOrder(hasWorkOrderExecute: boolean): Promise<WorkOrder | null> {
    try {
      if (!hasWorkOrderExecute) {
        return null;
      }

      // 调用执行中工单的API
      const requestParams = {
        limit: 2,
        offset: 0,
        segStatusIds: [4, 5, 6, 8],  // 执行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
      
      const response = await this.getWorkOrdersBySegStatus(requestParams);
      const data = response;
      //console.log('获取最新工单的API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则取第一条作为最新工单
      if (data.success && data.result?.data && data.result.data.length > 0) {
        const firstOrder = data.result.data[0];
        const latestOrder: WorkOrder = {
          code: firstOrder.workOrderNo || firstOrder.myWorkOrderSegNo || '',
          status: firstOrder.workOrderStatusName || '',
          productModel: firstOrder.machineModel || '',
          serialNumber: firstOrder.machineNo || '',
          reportTime: this.formatDate(firstOrder.reportTime),
          constructionSite: firstOrder.constructionLocation || '',
          maintenanceDept: firstOrder.maintenanceDeptName || ''
        };
        return latestOrder;
      }
      return null;
    } catch (err: any) {
      console.error('获取最新工单错误:', err.response?.data?.error?.message || err.message);
      return null;
    }
  }

  /**
   * 根据权限获取工单数据
   * @param hasWorkOrderCreate 是否有创建权限
   * @param hasWorkOrderAssign 是否有分配权限
   * @param hasWorkOrderExecute 是否有执行权限
   * @param locale 语言环境
   * @returns 工单数据和错误信息
   */
  async fetchWorkOrdersByPermission(
    hasWorkOrderCreate: boolean,
    hasWorkOrderAssign: boolean,
    hasWorkOrderExecute: boolean,
    locale: string
  ): Promise<{ workOrders: WorkOrder[]; error: string | null }> {
    try {
      let workOrdersData: WorkOrder[] = [];
      let displayMessage = '';
      
      console.log('当前权限状态:', {
        hasWorkOrderCreate,
        hasWorkOrderAssign,
        hasWorkOrderExecute
      });

      // 根据不同的权限组合调用不同的API
      if (hasWorkOrderCreate && !hasWorkOrderAssign && !hasWorkOrderExecute) {
        // 仅申请权限
        const requestParams = {
          limit: 2,
          offset: 0,
          createByUser: await AsyncStorage.getItem('userLoginName'),
          workOrderSource: "DelegateSubmitted",
          status: [1],
          orderByLastUpdatedTime: true
        };
        
        const response = await this.getWorkOrdersByParameters(requestParams);
        console.log('仅申请权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo,
            status: order.workOrderStatus,
            productModel: order.machineModel,
            serialNumber: order.machineNo,
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '您目前没有在申请中的工单' : 'You do not have any work order applications';
          }
        }
      } else if (!hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
        // 仅派工权限
        const requestParams = {
          limit: 2,
          offset: 0,
          orderByLastUpdatedTime: true,
          status: [1, 3, 4, 5, 6, 8]
        };
        
        const response = await this.getWorkOrdersByParameters(requestParams);
        console.log('仅派工权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo,
            status: order.workOrderStatus,
            productModel: order.machineModel,
            serialNumber: order.machineNo,
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '暂无工单' : 'No work order to operate';
          }
        }
      } else if (!hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
        // 仅执行权限
        const requestParams = {
          limit: 2,
          offset: 0,
          segStatusIds: [1, 3, 4, 5, 6, 8],
          onsiteOrNot: 'Y',
          orderByLastUpdatedTime: true
        };
        
        const response = await this.getWorkOrdersBySegStatus(requestParams);
        console.log('仅执行权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo || order.myWorkOrderSegNo || '',
            status: order.workOrderStatusName || '',
            productModel: order.machineModel || '',
            serialNumber: order.machineNo || '',
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '您目前没有待出发工单' : 'you do not have work orders for departure';
          }
        }
      } else if (hasWorkOrderCreate && hasWorkOrderAssign && !hasWorkOrderExecute) {
        // 申请+派工权限
        const requestParams = {
          limit: 2,
          offset: 0,
          orderByLastUpdatedTime: true,
          status: [1, 3, 4, 5, 6, 8]
        };
        
        const response = await this.getWorkOrdersByParameters(requestParams);
        console.log('申请+派工权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo,
            status: order.workOrderStatus,
            productModel: order.machineModel,
            serialNumber: order.machineNo,
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '暂无工单' : 'No work order to operate';
          }
        }
      } else if (hasWorkOrderCreate && !hasWorkOrderAssign && hasWorkOrderExecute) {
        // 申请+执行权限
        const requestParams = {
          limit: 2,
          offset: 0,
          segStatusIds: [1, 3, 4, 5, 6, 8],
          onsiteOrNot: 'Y',
          orderByLastUpdatedTime: true
        };
        
        const response = await this.getWorkOrdersBySegStatus(requestParams);
        console.log('申请+执行权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo || order.myWorkOrderSegNo || '',
            status: order.workOrderStatusName || '',
            productModel: order.machineModel || '',
            serialNumber: order.machineNo || '',
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '您目前没有待出发工单' : 'you do not have work orders for departure';
          }
        }
      } else if (!hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
        // 派工+执行权限
        const requestParams = {
          limit: 2,
          offset: 0,
          orderByLastUpdatedTime: true,
          status: [1, 3, 4, 5, 6, 8]
        };
        
        const response = await this.getWorkOrdersByParameters(requestParams);
        console.log('派工+执行权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo,
            status: order.workOrderStatus,
            productModel: order.machineModel,
            serialNumber: order.machineNo,
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '暂无工单' : 'No work order to operate';
          }
        }
      } else if (hasWorkOrderCreate && hasWorkOrderAssign && hasWorkOrderExecute) {
        // 申请+派工+执行权限
        const requestParams = {
          limit: 2,
          offset: 0,
          orderByLastUpdatedTime: true,
          status: [1, 3, 4, 5, 6, 8]
        };
        
        const response = await this.getWorkOrdersByParameters(requestParams);
        console.log('申请+派工+执行权限API响应数据:', response);

        if (response.success && response.result?.data) {
          workOrdersData = response.result.data.slice(0, 2).map((order: any) => ({
            code: order.workOrderNo,
            status: order.workOrderStatus,
            productModel: order.machineModel,
            serialNumber: order.machineNo,
            reportTime: this.formatDate(order.reportTime),
            constructionSite: order.constructionLocation || '',
            maintenanceDept: order.maintenanceDeptName || ''
          }));
          
          if (workOrdersData.length === 0) {
            displayMessage = locale === 'zh' ? '暂无工单' : 'No work order to operate';
          }
        }
      }

      return {
        workOrders: workOrdersData,
        error: displayMessage || null
      };
    } catch (err: any) {
      console.error('获取工单列表错误:', err);
      const errorMessage = err.response?.data?.error?.message || err.message || '网络请求失败';
      return {
        workOrders: [],
        error: errorMessage
      };
    }
  }

  /**
   * 日期格式化函数
   * @param dateString 日期字符串
   * @returns 格式化后的日期
   */
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  }
}

export default new WorkOrderService();
