import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferError {
  export class SenderNotFound extends AppError {
    constructor() {
      super('Sender not found', 404);
    }
  }

  export class ReceiverNotFound extends AppError {
    constructor() {
      super('Receiver not found', 404);
    }
  }

  export class OutOfFunds extends AppError {
    constructor() {
      super('You do not have enough funds to make this transfer', 400);
    }
  }
}
