import { Test, TestingModule } from '@nestjs/testing';
import { EnseignementsService } from './enseignements.service';

describe('EnseignementsService', () => {
  let service: EnseignementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnseignementsService],
    }).compile();

    service = module.get<EnseignementsService>(EnseignementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
