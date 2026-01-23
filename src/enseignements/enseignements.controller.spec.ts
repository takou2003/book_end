import { Test, TestingModule } from '@nestjs/testing';
import { EnseignementsController } from './enseignements.controller';

describe('EnseignementsController', () => {
  let controller: EnseignementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnseignementsController],
    }).compile();

    controller = module.get<EnseignementsController>(EnseignementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
