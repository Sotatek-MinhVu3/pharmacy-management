import { Module } from '@nestjs/common';
import { RackController } from './rack.controller';
import { SharedModule } from '../shared/shared.module';
import { RackService } from './rack.service';

@Module({
  imports: [SharedModule],
  providers: [RackService],
  controllers: [RackController],
})
export class RackModule {}
