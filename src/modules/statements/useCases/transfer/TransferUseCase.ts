import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { OperationType, Statement } from '../../entities/Statement';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { TransferError } from './TransferError';

interface IRequest {
  sender_id: string,
  receiver_id: string;
  description: string;
  amount: number;
}

@injectable()
class TransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({sender_id, receiver_id, description, amount}: IRequest): Promise<Statement> {
    const sender = await this.usersRepository.findById(sender_id);

    if(!sender) {
      throw new TransferError.SenderNotFound();
    }

    const receiver = await this.usersRepository.findById(receiver_id);

    if(!receiver) {
      throw new TransferError.ReceiverNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (amount > balance) {
      throw new TransferError.OutOfFunds();
    }

    const statement = await this.statementsRepository.create({
      description,
      amount,
      type: OperationType.TRANSFER,
      user_id: receiver_id,
      sender_id
    });

    return statement;
  }
}

export { TransferUseCase };
