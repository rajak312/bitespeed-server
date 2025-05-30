import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IdentifyDto } from './dto/identify.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async identifyUser(dto: IdentifyDto) {
    const { email, phoneNumber } = dto;

    const matchedContacts = await this.prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    let allContacts = [...matchedContacts];

    if (allContacts.length === 0) {
      const newContact = await this.prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary',
        },
      });

      return {
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: [],
        },
      };
    }

    const primaryContact =
      allContacts.find((c) => c.linkPrecedence === 'primary') ?? allContacts[0];
    const primaryId = primaryContact.linkedId ?? primaryContact.id;

    const relatedContacts = await this.prisma.contact.findMany({
      where: {
        OR: [{ id: primaryId }, { linkedId: primaryId }],
      },
      orderBy: { createdAt: 'asc' },
    });

    const emailExists = relatedContacts.some((c) => c.email === email);
    const phoneExists = relatedContacts.some(
      (c) => c.phoneNumber === phoneNumber,
    );

    if ((!emailExists && email) || (!phoneExists && phoneNumber)) {
      await this.prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'secondary',
          linkedId: primaryId,
        },
      });
    }

    const updatedContacts = await this.prisma.contact.findMany({
      where: {
        OR: [{ id: primaryId }, { linkedId: primaryId }],
      },
    });

    const primary = updatedContacts.find((c) => c.id === primaryId);
    const secondaries = updatedContacts.filter((c) => c.id !== primaryId);

    return {
      contact: {
        primaryContatctId: primaryId,
        emails: [
          ...new Set(
            [primary?.email, ...secondaries.map((c) => c.email)].filter(
              Boolean,
            ),
          ),
        ],
        phoneNumbers: [
          ...new Set(
            [
              primary?.phoneNumber,
              ...secondaries.map((c) => c.phoneNumber),
            ].filter(Boolean),
          ),
        ],
        secondaryContactIds: secondaries.map((c) => c.id),
      },
    };
  }
}
