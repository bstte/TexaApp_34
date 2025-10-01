import axios from "axios";
import { UserData, Credentials, ShopData, updateshopData, DosageData,UpdateDosage,equipmentdata,subuser,raisequery,updateprofile,resetcredentials,updatecredentials } from "./types";



const BASE_API_URL = 'https://texa.teamwebdevelopers.com/api';

export const Image_Base_Url = 'https://texa.teamwebdevelopers.com/public'


const instance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 20000, // Set your desired timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  register: (userData: UserData) => instance.post('/registered', userData),
  login: (credentials: Credentials) => instance.post('/login', credentials),
  admin_login: (credentials: Credentials) => instance.post('/admin-login', credentials),
  get_contries:()=>instance.get('/countrys'),
  get_user: (token: string) => instance.get('/get_user', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),

  user_update: (userId: number, token: string, updateprofile: FormData) => instance.post(`/user_update/${userId}`, updateprofile, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  get_count: (userId: number, token: string) => instance.get(`/get_count/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  logout: (token: string) => instance.get('/logout', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
  }),
  deleteaccount: (token: string) => instance.delete('/delete-account', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
  }),

  
  forget_password: (resetcredentials:resetcredentials) => instance.post('/forget-password',resetcredentials),
  update_password: (updatecredentials:updatecredentials) => instance.post('/update-password',updatecredentials),



  // manage shop api

  get_shop: (shopId: string, token: string) => instance.get(`/get_shop/${shopId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  application_type: (token: string) => instance.get('/get_application', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  add_Shop: (formData: FormData, token: string) => instance.post('/add-shop', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  edit_shop: (id: number, token: string) => instance.get(`/edit-shop/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  update_shop: (shopId: number, token: string, updateshopData: FormData) => instance.post(`/update-shop/${shopId}`, updateshopData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  view_shop: (id: number, token: string) => instance.get(`/view-shop/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),

  delete_shop: (id: number, token: string) => instance.delete(`/delete-shop/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),

  delete_shop_image:(id:number,token:string)=>instance.delete(`delete-shop-image/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),




  // manage dosage api
  get_dosage: (userId: string, token: string) => instance.get(`/get_dosage/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  add_dosage: (formData: FormData, token: string) => instance.post('/add-dosage', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  
  edit_dosage: (id: number, token: string) => instance.get(`/edit-dosage/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  update_dosage: (dosageId: number, token: string, UpdateDosage: FormData) => instance.post(`/update-dosage/${dosageId}`, UpdateDosage, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),

  view_dosage: (id: number, token: string) => instance.get(`/view-dosage/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  delete_dosage: (id: number, token: string) => instance.delete(`/delete-dosage/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  delete_dosage_front_image:(dosageId:number,token:string)=>instance.delete(`/delete-dosage-front-image/${dosageId}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  delete_dosage_back_image:(dosageId:number,token:string)=>instance.delete(`/delete-dosage-back-image/${dosageId}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),

  dosage_items: (token: string) => instance.get(`/dosage-items`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
 

  dosage_items_add: (token:string,item: { dosage_name: string }) => instance.post(`/dosage-items-add`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  dosage_model_number: (token:string,item: { dosage_number: string },modelId:any) => instance.post(`/dosage/model-number/${modelId}`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  // here equipment api
  equipment_data: (userId: string, token: string) => instance.get(`/equipment-data/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  get_equipment: (userId: string, token: string) => instance.get(`/get_equipment/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  add_equipment: (equipmentdata: FormData, token: string) => instance.post('/add-equipment', equipmentdata, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  delete_equipment: (id: number, token: string) => instance.delete(`/delete-equipment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  edit_equipment: (id: number, token: string) => instance.get(`/edit-equipment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  equipment_view: (id: number, token: string) => instance.get(`/equipment-view/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  update_equipment: (equipmentId: number, token: string, equipmentdata: FormData) => instance.post(`/update-equipment/${equipmentId}`, equipmentdata, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  delete_equipment_front_image:(equipmentId:number,token:string)=>instance.delete(`/delete-equipment-front-image/${equipmentId}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  delete_equipment_back_image:(equipmentId:number,token:string)=>instance.delete(`/delete-equipment-back-image/${equipmentId}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),

  equipment_items: (token: string) => instance.get(`/equipment-items`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),

  equiment_add: (token:string,item: any) => instance.post(`/equiment-add`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  equiment_machineName_add: (token:string,item: any,machineType:number) => instance.post(`add-equipment-machine-name/${machineType}`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  equipment_brand_items: (machineType: string, token: string) => instance.get(`/equipment-brand-items/${machineType}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),

  equipment_machine_name: (machineType: number, token: string) => instance.get(`/equipment-machine-name/${machineType}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  // here subUser api

  get_subUser: (userId: string, token: string) => instance.get(`/get_subUser/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),

  add_subUser: (subuser: subuser, token: string) => instance.post('/add-subUser', subuser, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  delete_subUser: (id: number, token: string) => instance.delete(`/delete-subUser/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  get_query_shop: (userId: string, token: string) => instance.get(`/get-query-shop/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),

  // here raise a query api
  get_query_equipment: (shopId: string, token: string) => instance.get(`/get-query-applicationtype/${shopId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  get_query_product: (shopId:string,equipmentId: string, token: string) => instance.get(`/get-query-product/${shopId}/${equipmentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  query: (raisequery: FormData, token: string) => instance.post('/query', raisequery, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  get_query_list: (userId: string, token: string) => instance.get(`/get-query-list/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  admin_query: (userId: string, token: string) => instance.get(`/admin-query/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  view_query: (user_id:number,case_id: number, token: string) => instance.get(`/view-query/${user_id}/${case_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  delete_query: (id: number, token: string) => instance.delete(`/delete-query/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }),
  user_query_reply: (ReplyData: FormData, token: string) => instance.post('/user-query-reply', ReplyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),


  chat_query_create: (chatbot: FormData, token: string) => instance.post('chat-query-create', chatbot, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),

  Getadminlist: (CaseId: string, token: string) => instance.get(`/getUser/${CaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),

  GetChat: (CaseId: string, token: string,limit:number,page:number) => instance.get(`/getChat/${CaseId}/${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params:{
      page:page,
    }
  }),

  sendmsg: (sendMsg: FormData, token: string,sender_id:number,) => instance.post(`/chat/${sender_id}`, sendMsg, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  adminsendmsg: (sendMsg: FormData, token: string,sender_id:string,) => instance.post(`/admin-chat/${sender_id}`, sendMsg, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
  ChatCount: (CaseId: number,UserId:number, token: string) => instance.get(`/getChatCount/${UserId}/${CaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  getChatCount_admin: (CaseId: number,adminId:any, token: string) => instance.get(`/getChatCount-admin/${adminId}/${CaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  UpdateChat: (CaseId: number,UserId:number, token: string) => instance.get(`/ChatStatusUpdate/${CaseId}/${UserId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  AdminChatUpdate: (CaseId: number,adminId:number, token: string) => instance.get(`/ChatStatusUpdate-admin/${CaseId}/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }),
  assignquery_to_reprsentative: (query: any, token: string,representative_id:string,) => instance.post(`/assign-to-query/${representative_id}`, query, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Add this header
    }
  }),
};


export default api;