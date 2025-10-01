export interface UserData {
    email: string;
    name: string;
    password: string;
  }

  export interface ShopData{
    user_id:string,
    shop_name:string,
    shop_contact_person:string,
    email:string,
    phone:string,
    products:any
  }

  export interface Credentials{
    email:string,
    password:string
  }

  export interface resetcredentials{
    email:string,
  }

  export interface updatecredentials{
    email:string,
    otp:string,
    password:string,
    cpassword:string
  }
  export interface updateshopData{
    shop_name:string,
    shop_contact_person:string,
    email:string,
    phone:string,
    products:any
  }
  export interface DosageData{
    user_id:string,
    model_name:string,
    model_no:string,
    product_no:string,
    washers_no:string,
    pupmps_no:string,
    front_image:any,
    back_image:any

  }
export interface UpdateDosage{
  user_id:string,
  model_name:string,
  model_no:string,
  product_no:string,
  washers_no:string,
  pupmps_no:string,
  front_image:any,
  back_image:any
}

export interface equipmentdata{
  
    user_id :string,
    shop_id : string,
    machine_type : string,
    brand_name : string,
    machine_name : string,
    model_name : string,
    capacity : string,
    install_year : string,
    dosage : string,
    dc_no_tank : string,
    dc_solvent : string,
    dc_heat_Type :string,
    dc_filter : string,
    dc_frequency_motor : string,
    dc_spray_unit : string,
    dc_solvent_cooling_system : string,
    dc_distilation : string,
    dc_distilation_type : string,
    dc_distilation_method : string,
    wm_machion_type : string,
    wm_heat_type : string,
    wm_volume : string,
    wm_program_type : string,
    fe_finishing_equipment_type : string
    dryer_type : string
    dryer_volume : string
    dryer_program_number : string
    dryer_program_name : string
    front_image : string
    back_image : string

}

export interface subuser{
  head_user_id:string,
  name:string,
  email:string,
  password:string,
  shop_id:number,
  user_type:string
}
export interface raisequery{
  shop_id:string,
  user_id :string,
  product_name:any,
  query_title:string,
  description:string,
  front_image : string
  back_image : string
}

export interface updateprofile{
  name:string,
  image:string
}