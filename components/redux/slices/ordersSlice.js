import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  count:0
};

export const OrdersSlice = createSlice({
  name: "Orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
       return {
        data: action.payload?.data,
        count:action.payload?.count
      };
    },
    addOrder:(state, action)=>{
         //@ts-ignore
        
         var updatedData=[{...action?.payload},...state.data]
      
          
         return {
          data: [...updatedData],
          count:initialState?.count
        };
    },
    updateOrderStatus: (state, action) => {
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
       count:initialState?.count
     };
   },
   removeOrder: (state, action) => {
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
export const { setOrders,updateOrderStatus,addOrder,removeOrder } = OrdersSlice.actions;

export default OrdersSlice.reducer;
