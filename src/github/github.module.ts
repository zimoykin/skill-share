import { Module } from '@nestjs/common';
import { GithubStrategy } from './github.strategy';
import { GithubService } from './github.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GithubStrategy, GithubService],
  exports: [GithubService],
})
export class GithubModule {}
