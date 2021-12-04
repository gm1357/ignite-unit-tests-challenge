import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransferUseCase } from './TransferUseCase';

class TransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params;
    const { description, amount } = request.body;

    const transferUseCase = container.resolve(TransferUseCase);

    const statementOperation = await transferUseCase.execute({
      sender_id,
      receiver_id,
      description,
      amount
    });

    return response.json(statementOperation);
  }
}

export { TransferController };
