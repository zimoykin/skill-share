import { Module } from '@nestjs/common';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [],
  providers: [GithubStrategy],
})
export class GithubModule {}
