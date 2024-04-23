import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Message } from 'src/db-classes/message.class';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageRepository } from '../repository/message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) { }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const files = new Message({
      created_at: new Date(Date.now()),
      message: createMessageDto.message,
      id: randomUUID(),
    });
    return await this.messageRepository.create(files);
  }

  async createMessageTable() {
    await this.messageRepository.createMessageTable()
  }

  async findAllMessage(): Promise<Message[]> {
    return await this.messageRepository.findAll();
  }

  async findMessageById(id: string) {
    console.log(id);
    return await this.messageRepository.findById(id);
  }

  async findUnseenMessages() {
    const files = await this.messageRepository.findUnseenMessages();
    await this.setDeleteAt(files.map((item) => item.id));
    return files;
  }

  async setDeleteAt(id: string[]) {
    return await this.messageRepository.setDeleteAt(id);
  }
}