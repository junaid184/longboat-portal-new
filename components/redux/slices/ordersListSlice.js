import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: [] ,
  count:0
};

export const OrdersListSlice = createSlice({
  name: "OrdersList",
  initialState,
  reducers: {
    setOrdersList: (state, action) => {
       return {
        data: action.payload?.data,
        count:action.payload?.count
      };
    },
    addOrderList:(state, action)=>{
         //@ts-ignore
        
         var updatedData=[{...action?.payload},...state.data]
      
          
         return {
          data: [...updatedData],
          count:state?.count
        };
    },
    updateOrderStatusList: (state, action) => {
      //@ts-ignore
      
      var oldeData=[...state.data]
      
      var foundData=oldeData.find(x=>x.orderId==action?.payload?.orderId);
        if(foundData!=undefined)
        {
        
           oldeData[oldeData.findIndex(x=>x.orderId==action?.payload?.orderId)]={
            ...foundData,
            ...action?.payload
          };
 
        } 
       
      return {
       data: [...oldeData],
       count:state?.count
     };
   },
   
   removeOrderList: (state, action) => {
    //@ts-ignore
    
    var oldeData=[...state.data]
     
    oldeData=oldeData.filter(x=>x?.orderId!=action?.payload)
    return {
     data: [...oldeData],
     count:(initialState?.count)-1
   };
 },
  },
});
export const { setOrdersList,updateOrderStatusList,addOrderList,removeOrderList } = OrdersListSlice.actions;

export default OrdersListSlice.reducer;
