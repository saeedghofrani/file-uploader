import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageService } from '../service/message.service';

@ApiTags('Message')
@Controller('message')
export class MessageController {

  constructor(
    private messageService: MessageService
  ) { }

  @Get()
  @ApiOperation({ summary: 'get message by id' })
  async findMessageById(
    @Query('id') id: string
  ) {
    return await this.messageService.findMessageById(id);
  }

  @Post('table')
  @ApiOperation({ summary: 'create message table if not exist' })
  async createMessageTable() {
    await this.messageService.createMessageTable();
  }

  @Post()
  @ApiBody({ type: CreateMessageDto })
  @ApiOperation({ summary: 'create message record' })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto
  ) {
    await this.messageService.createMessage(createMessageDto);
  }

  @Get('unseen')
  @ApiOperation({ summary: 'get all unseen message' })
  async findUnseenMessages(
  ) {
    return await this.messageService.findUnseenMessages();
  }
}