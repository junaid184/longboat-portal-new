
export const roles = Object.freeze({
    admin: 'admin',
})

export const TicketMasterAPIKey = "JArJtzXSEFsFZetPVGW7WdmAgaNtR2XB";

export const GetStatusById = (state) => { 
    switch (state) {
      case 0: {
        return "New Order";
      }
      case 1: {
        return "Pending";
      }
      case 2: {
        return "Fulfilled / Completed";
      }
      case 3: {
        return "NLA";
      }
      default: {
        return "";
      }
    }
  };

 export const statusList = [
    { id: 0, label: "Draft" },
    { id: 1, label: "Pending" },
    { id: 2, label: "Completed" },
    { id: 3, label: "Report NLA" },
    { id: 4, label: "Update Invoice" },
  ];
  

export const baseUrl = "https://v2g3pd1n-5212.uks1.devtunnels.ms";