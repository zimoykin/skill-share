import { Module } from '@nestjs/common';
import { GithubStrategy } from './github.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'github' }),
  ],
  providers: [GithubStrategy],
  exports: [GithubStrategy],
})
export class GithubModule {}
