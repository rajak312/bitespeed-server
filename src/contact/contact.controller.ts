import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { IdentifyDto } from './dto/identify.dto';

@Controller('identify')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  identify(@Body() identifyDto: IdentifyDto) {
    return this.contactService.identifyUser(identifyDto);
  }
}
