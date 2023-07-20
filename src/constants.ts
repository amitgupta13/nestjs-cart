export enum userRoles {
  admin = 1,
  customer = 2,
}

export const regex = {
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!.%*?&]{8,}$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

export enum TransactionStatus {
  PENDING,
  SUCCESS,
  FAILED,
}

export enum DispatchStatus {
  PENDING,
  INITIATED,
  DISPATCHED,
  DELIVERED,
}
